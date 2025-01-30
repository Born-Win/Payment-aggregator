import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalModule } from './global.module';
import { ClientModule } from '../client/client.module';
import { PartnerModule } from '../partner/partner.module';
import { PaymentModule } from '../payment/payment.module';
import * as ExceptionFilters from '../exception-filters';

@Module({
  imports: [GlobalModule, ClientModule, PartnerModule, PaymentModule],
  providers: [
    ...Object.values(ExceptionFilters).map((filter) => ({
      provide: APP_FILTER,
      useClass: filter,
    })),
  ],
})
export class AppModule {}
