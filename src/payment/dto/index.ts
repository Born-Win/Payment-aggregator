import { PaymentStatus } from '../models';

export class AcceptPaymentDto {
  clientId: string;
  amount: number;
}

// export class AcceptPaymentDto {
//   clientId: string;
//   amount: number;

//   constructor(data, partnerId: string) {
//     this.clientId = data.clientId;
//     this.amount = data.amount;
//   }
// }

export class CreatePaymentDto {
  amount: number;
  status: PaymentStatus;
  availableAmount: number;
  clientId: string;

  constructor(data) {
    this.amount = data.amount;
    this.status = data.status;
    this.availableAmount = data.availableAmount;
    this.clientId = data.clientId;
  }
}

export class ProcessPaymentBodyDto {
  ids: string[];
}

export class ProcessPaymentDto {
  ids: string[];
  partnerId: string;

  constructor(ids: string[], partnerId: string) {
    this.ids = ids;
    this.partnerId = partnerId;
  }
}

export class ProcessPayoutBodyDto {
  clientId: string;
}

export class ProcessPayoutDto {
  clientId: string;
  partnerId: string;

  constructor(clientId: string, partnerId: string) {
    this.clientId = clientId;
    this.partnerId = partnerId;
  }
}

export class ReadPayoutPaymentDto {
  id: string;
  amount: number;
}
