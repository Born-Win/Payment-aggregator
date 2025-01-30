import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PartnerRepository } from '../repositories';
import { ConfigurePartnerDto } from '../dto';

@Injectable()
export class PartnerService {
  constructor(private partnerRepository: PartnerRepository) {}

  configurePartner(data: ConfigurePartnerDto): void {
    const partner = this.partnerRepository.getOneById(data.id);

    if (!partner)
      throw new HttpException(
        'Partner with the provided ID not found',
        HttpStatus.BAD_REQUEST,
      );

    this.partnerRepository.updateById(partner.id, data);
  }
}
