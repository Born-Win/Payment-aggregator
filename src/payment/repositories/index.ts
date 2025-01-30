import { Injectable } from '@nestjs/common';
import { Repository } from '../../database/repository';
import { Storage, Filter, BulkWrite } from '../../database/storage';
import { Payment } from '../models';

type Table = 'payments';

type PaymentData = Omit<Payment, 'id'>;

@Injectable()
export class PaymentRepository extends Repository {
  private table: Table = 'payments';

  constructor(private storage: Storage) {
    super();
  }

  createOne(data: PaymentData) {
    const id = this.generateId();
    const dataToSave = { ...data, id };
    return this.storage.create(this.table, dataToSave);
  }

  getMany(filter: Filter<Payment>) {
    return this.storage.getByFilter(this.table, filter) as Payment[];
  }

  updateManyById(update: { [key: string]: Partial<Payment> }) {
    const bulkWrite: BulkWrite<Payment> = [];
    for (const key in update) {
      bulkWrite.push({
        filter: { id: key },
        update: update[key],
      });
    }
    this.storage.bulkWrite(this.table, bulkWrite);
  }
}
