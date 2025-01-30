import config = require('config');
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Payment, PaymentStatus } from '../payment/models';
import { Partner } from '../partner/models';
import { Client } from '../client/models';

export type Table = 'partners' | 'payments' | 'clients';

export type Filter<T> = {
  [K in keyof T]?: T[K] | T[K][];
};

export type UpdateFilter<T> = {
  [K in keyof T]?: T[K];
};

type StorageData = {
  partners: Partner[];
  payments: Payment[];
  clients: Client[];
};

type RecordType = Partner | Payment | Client;

export type BulkWrite<Record> = {
  filter: UpdateFilter<Record>;
  update: Partial<Record>;
}[];

@Injectable()
export class Storage implements OnModuleInit {
  private data: StorageData;

  constructor() {
    this.data = {
      partners: [],
      payments: [],
      clients: [],
    };
  }

  create<T extends keyof StorageData>(table: T, data: StorageData[T][number]) {
    if (table === 'partners') {
      this.data.partners.push(data as Partner);
    } else if (table === 'payments') {
      this.data.payments.push(data as Payment);
    } else if (table === 'clients') {
      this.data.clients.push(data as Client);
    } else {
      throw new Error('Invalid data for the specified table');
    }

    return data;
  }

  // Another approach can be used for more complex and larger data structures, such as copying JSON objects or iterating through keys
  private cloneRecord(record: RecordType) {
    if (!record) return null;
    return { ...record };
  }

  private filter(
    data: RecordType,
    filter: Filter<RecordType> | UpdateFilter<RecordType>,
  ) {
    let fitted = true;
    for (const key in filter) {
      if (Array.isArray(filter[key])) {
        if (!filter[key].includes(data[key])) return (fitted = false);
      } else if (data[key] !== filter[key]) return (fitted = false);
    }
    return fitted;
  }

  getOne<T extends keyof StorageData>(
    table: T,
    filter: UpdateFilter<StorageData[T][number]>,
  ) {
    const result = this.data[table].find((d) => this.filter(d, filter));
    return this.cloneRecord(result);
  }

  getByFilter<T extends keyof StorageData>(
    table: T,
    filter: Filter<StorageData[T][number]>,
  ) {
    const result = this.data[table].filter((d) => this.filter(d, filter));
    return result.map((r) => this.cloneRecord(r));
  }

  updateOne<T extends keyof StorageData>(
    table: T,
    filter: UpdateFilter<StorageData[T][number]>,
    update: Partial<StorageData[T][number]>,
  ) {
    const record = this.data[table].find((d) => this.filter(d, filter));
    if (!record) return;

    Object.keys(update).forEach((key) => {
      record[key] = update[key];
    });
  }

  bulkWrite<T extends keyof StorageData>(
    table: T,
    data: BulkWrite<StorageData[T][number]>,
  ) {
    for (const obj of data) {
      const record = this.data[table].find((d) => this.filter(d, obj.filter));
      if (!record) continue;

      Object.keys(obj.update).forEach((key) => {
        record[key] = obj.update[key];
      });
    }
  }

  async onModuleInit() {
    if (process.env.NODE_ENV !== 'production') {
      const partnerToCreate = {
        id: config.get<string>('defaultPartnerId'),
        paymentCommission: 0.02,
        holdPercentage: 0.05,
      };

      this.create('partners', partnerToCreate);

      this.create('clients', {
        partnerId: partnerToCreate.id,
        name: 'My shop',
        id: 'a6a84180-d',
        aggregatorCommission: 0.1,
      });
      this.create('payments', {
        id: 'b947f029-e',
        clientId: 'a6a84180-d',
        status: PaymentStatus.ACCEPTED,
        availableAmount: 0,
        amount: 150,
      });
      this.create('payments', {
        id: 'e000720b-f',
        clientId: 'a6a84180-d',
        status: PaymentStatus.ACCEPTED,
        availableAmount: 0,
        amount: 1000,
      });
      this.create('payments', {
        id: '46b12409-7',
        clientId: 'a6a84180-d',
        status: PaymentStatus.ACCEPTED,
        availableAmount: 0,
        amount: 100,
      });
    }
  }
}
