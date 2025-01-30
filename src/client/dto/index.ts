export class CreateClientBodyDto {
  name: string;
  aggregatorCommission: number;
}

export class CreateClientDto {
  name: string;
  aggregatorCommission: number;
  partnerId: string;

  constructor(data, partnerId: string) {
    this.name = data.name;
    this.aggregatorCommission = data.aggregatorCommission;
    this.partnerId = partnerId;
  }
}
