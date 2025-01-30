import { Module } from '@nestjs/common';
import { PaymentRepository } from './repositories';
import { PaymentService } from './services';
import { PaymentController } from './controllers';
import { ClientModule } from '../client/client.module';
import { PartnerModule } from '../partner/partner.module';

@Module({
  imports: [ClientModule, PartnerModule],
  controllers: [PaymentController],
  providers: [PaymentRepository, PaymentService],
  exports: [PaymentRepository],
})
export class PaymentModule {}
