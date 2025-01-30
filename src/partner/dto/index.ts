export class ConfigurePartnerBodyDto {
  paymentCommission: number;
  holdPercentage: number;
}

export class ConfigurePartnerDto {
  paymentCommission: number;
  holdPercentage: number;
  id: string;

  constructor(data, id: string) {
    this.paymentCommission = data.paymentCommission;
    this.holdPercentage = data.holdPercentage;
    this.id = id;
  }
}

export class ReadPartnerDto {
  id: string;
  paymentCommission: number;
  holdPercentage: number;
}
