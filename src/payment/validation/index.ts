import Joi = require('joi');
import {
  AcceptPaymentDto,
  ProcessPaymentBodyDto,
  ProcessPayoutBodyDto,
} from '../dto';

type PaymentsInput = {
  initiate: {
    body: AcceptPaymentDto;
  };
  transactions: {
    body: ProcessPaymentBodyDto;
  };
  settlements: {
    body: ProcessPaymentBodyDto;
  };
  payouts: {
    body: ProcessPayoutBodyDto;
  };
};

export const paymentsValidationSchema = {
  initiate: Joi.object<PaymentsInput['initiate']>({
    body: Joi.object({
      clientId: Joi.string().length(10).required(),
      amount: Joi.number().greater(0).required(),
    }).required(),
  }),
  transactions: Joi.object<PaymentsInput['transactions']>({
    body: Joi.object({
      ids: Joi.array().items(Joi.string().length(10).required()).required(),
    }).required(),
  }),
  settlements: Joi.object<PaymentsInput['settlements']>({
    body: Joi.object({
      ids: Joi.array().items(Joi.string().length(10).required()).required(),
    }).required(),
  }),
  payouts: Joi.object<PaymentsInput['settlements']>({
    body: Joi.object({
      clientId: Joi.string().length(10).required(),
    }).required(),
  }),
};
