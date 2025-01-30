import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import config = require('config');
import currency = require('currency.js');
import { PaymentRepository } from '../repositories';
import { PartnerRepository } from '../../partner/repositories';
import { ClientRepository } from '../../client/repositories';
import { PaymentStatus } from '../models';
import {
  AcceptPaymentDto,
  CreatePaymentDto,
  ProcessPaymentDto,
  ProcessPayoutDto,
  ReadPayoutPaymentDto,
} from '../dto';

@Injectable()
export class PaymentService {
  private fixedCommission: number;

  constructor(
    private paymentRepository: PaymentRepository,
    private partnerRepository: PartnerRepository,
    private clientRepository: ClientRepository,
  ) {
    this.fixedCommission = config.get<number>('commission.fixedAmount');
  }

  acceptPayment(data: AcceptPaymentDto) {
    const client = this.clientRepository.getOneById(data.clientId);

    if (!client)
      throw new HttpException(
        'Client with the provided ID not found',
        HttpStatus.BAD_REQUEST,
      );

    const paymentData = new CreatePaymentDto({
      ...data,
      status: PaymentStatus.ACCEPTED,
      availableAmount: 0,
    });

    const result = this.paymentRepository.createOne(paymentData);

    return result.id;
  }

  processPayment(data: ProcessPaymentDto) {
    const filteredPayments = this.paymentRepository.getMany({
      id: data.ids,
      status: PaymentStatus.ACCEPTED,
    });

    if (!filteredPayments.length)
      throw new HttpException(
        'Payments with the provided IDs not found',
        HttpStatus.BAD_REQUEST,
      );

    const partner = this.partnerRepository.getOneById(data.partnerId);
    const dataToUpdate = {};

    filteredPayments.forEach((payment) => {
      const totalDeductions = currency(this.fixedCommission).add(
        currency(payment.amount).multiply(partner.paymentCommission),
      ).value;

      const availableAmount = currency(payment.amount)
        .subtract(totalDeductions)
        .subtract(
          currency(payment.amount).multiply(partner.holdPercentage),
        ).value;

      dataToUpdate[payment.id] = {
        status: PaymentStatus.PROCESSED,
        availableAmount,
      };
    });

    this.paymentRepository.updateManyById(dataToUpdate);
  }

  completePayment(data: ProcessPaymentDto) {
    const filteredPayments = this.paymentRepository.getMany({
      id: data.ids,
      status: PaymentStatus.PROCESSED,
    });

    if (!filteredPayments.length)
      throw new HttpException(
        'Accepted payments with the provided IDs not found',
        HttpStatus.BAD_REQUEST,
      );

    const partner = this.partnerRepository.getOneById(data.partnerId);

    const dataToUpdate = {};

    filteredPayments.forEach((payment) => {
      const availableAmount = currency(payment.amount).add(
        currency(payment.amount).multiply(partner.holdPercentage),
      ).value;
      dataToUpdate[payment.id] = {
        status: PaymentStatus.COMPLETED,
        availableAmount,
      };
    });

    this.paymentRepository.updateManyById(dataToUpdate);
  }

  processPayout(data: ProcessPayoutDto) {
    const filteredPayments = this.paymentRepository.getMany({
      clientId: data.clientId,
      status: [PaymentStatus.PROCESSED, PaymentStatus.COMPLETED],
    });

    if (!filteredPayments.length)
      throw new HttpException(
        'Processed or completed payments with the provided clientId not found',
        HttpStatus.BAD_REQUEST,
      );

    const client = this.clientRepository.getOneById(data.clientId);
    const partner = this.partnerRepository.getOneById(data.partnerId);

    const availableBalance = filteredPayments.reduce((total, payment) => {
      payment.availableAmount = currency(payment.availableAmount).subtract(
        currency(payment.amount).multiply(client.aggregatorCommission),
      ).value;
      total += payment.availableAmount;
      return total;
    }, 0);

    let totalPayout = 0;
    const paidPayments: ReadPayoutPaymentDto[] = [];
    const dataToUpdate = {};

    filteredPayments.sort((a, b) => b.availableAmount - a.availableAmount);

    for (const payment of filteredPayments) {
      let holdAmount = 0;

      if (payment.status === PaymentStatus.PROCESSED) {
        holdAmount = partner.holdPercentage * payment.amount;
      }

      const payoutAmount = payment.availableAmount + holdAmount;

      if (totalPayout + payoutAmount > availableBalance) continue;

      totalPayout += payoutAmount;
      payment.status = PaymentStatus.PAID_OUT;

      if (holdAmount) {
        payment.availableAmount += holdAmount;
      }

      paidPayments.push({ id: payment.id, amount: payment.availableAmount });

      dataToUpdate[payment.id] = {
        status: payment.status,
        availableAmount: payment.availableAmount,
      };
    }

    this.paymentRepository.updateManyById(dataToUpdate);

    return {
      total: totalPayout,
      payments: paidPayments,
    };
  }
}
