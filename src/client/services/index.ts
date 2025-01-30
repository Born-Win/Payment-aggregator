import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../repositories';
import { CreateClientDto } from '../dto';

@Injectable()
export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  addClient(data: CreateClientDto) {
    const result = this.clientRepository.createOne(data);
    return result.id;
  }
}
