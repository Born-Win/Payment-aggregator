import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthInterceptor } from '../../auth';
import { PaymentService } from '../services';
import { paymentsValidationSchema } from '../validation';
import { JoiValidationPipe } from '../../pipes/joi';
import {
  AcceptPaymentDto,
  ProcessPaymentBodyDto,
  ProcessPaymentDto,
  ProcessPayoutBodyDto,
  ProcessPayoutDto,
} from '../dto';

@Controller('payments')
@UseInterceptors(AuthInterceptor)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UsePipes(new JoiValidationPipe(paymentsValidationSchema.initiate))
  @Post('initiate')
  acceptPayment(@Body() body: AcceptPaymentDto) {
    const paymentId = this.paymentService.acceptPayment(body);
    return {
      id: paymentId,
    };
  }

  @UsePipes(new JoiValidationPipe(paymentsValidationSchema.transactions))
  @Put('transactions')
  processPayment(
    @Body() body: ProcessPaymentBodyDto,
    @Req() req: { partnerId: string },
  ) {
    this.paymentService.processPayment(
      new ProcessPaymentDto(body.ids, req.partnerId),
    );
    return { message: 'Payments marked as processed' };
  }

  @UsePipes(new JoiValidationPipe(paymentsValidationSchema.settlements))
  @Put('settlements')
  completePayment(
    @Body() body: ProcessPaymentBodyDto,
    @Req() req: { partnerId: string },
  ) {
    this.paymentService.completePayment(
      new ProcessPaymentDto(body.ids, req.partnerId),
    );
    return { message: 'Payments marked as completed' };
  }

  @UsePipes(new JoiValidationPipe(paymentsValidationSchema.payouts))
  @Post('payouts')
  processPayout(
    @Body() body: ProcessPayoutBodyDto,
    @Req() req: { partnerId: string },
  ) {
    const payout = this.paymentService.processPayout(
      new ProcessPayoutDto(body.clientId, req.partnerId),
    );
    return payout;
  }
}
