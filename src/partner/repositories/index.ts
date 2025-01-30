import { Injectable } from '@nestjs/common';
import config = require('config');
import { Repository } from '../../database/repository';
import { Storage } from '../../database/storage';
import { Partner } from '../models';

type Table = 'partners';

type PartnerData = Omit<Partner, 'id'>;

@Injectable()
export class PartnerRepository extends Repository {
  private table: Table = 'partners';

  constructor(private storage: Storage) {
    super();
  }

  updateById(id: string, update: Partial<PartnerData>) {
    this.storage.updateOne(this.table, { id }, update);
  }

  getOneById(id: string) {
    return this.storage.getOne(this.table, { id }) as Partner;
  }
}
