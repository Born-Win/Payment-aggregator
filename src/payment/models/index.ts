export enum PaymentStatus {
  ACCEPTED = 'ACCEPTED',
  PROCESSED = 'PROCESSED',
  COMPLETED = 'COMPLETED',
  PAID_OUT = 'PAID_OUT',
}

export class Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  availableAmount: number;
  clientId: string;
}
