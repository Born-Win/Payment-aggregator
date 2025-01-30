import { Injectable } from '@nestjs/common';
import { Repository } from '../../database/repository';
import { Storage } from '../../database/storage';
import { Client } from '../models';

type Table = 'clients';

type ClientData = Omit<Client, 'id'>;

@Injectable()
export class ClientRepository extends Repository {
  private table: Table = 'clients';

  constructor(private storage: Storage) {
    super();
  }

  createOne(data: ClientData) {
    const id = this.generateId();
    const dataToSave = { ...data, id };
    return this.storage.create(this.table, dataToSave);
  }

  getOneById(id: string) {
    return this.storage.getOne(this.table, { id }) as Client;
  }
}
