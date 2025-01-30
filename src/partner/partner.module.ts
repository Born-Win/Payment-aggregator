import { Module } from '@nestjs/common';
import { PartnerRepository } from './repositories';
import { PartnerService } from './services';
import { PartnerController } from './controllers';

@Module({
  controllers: [PartnerController],
  providers: [PartnerRepository, PartnerService],
  exports: [PartnerRepository],
})
export class PartnerModule {}
