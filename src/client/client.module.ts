import { Module } from '@nestjs/common';
import { ClientRepository } from './repositories';
import { ClientService } from './services';
import { ClientController } from './controllers';

@Module({
  controllers: [ClientController],
  providers: [ClientRepository, ClientService],
  exports: [ClientRepository],
})
export class ClientModule {}
