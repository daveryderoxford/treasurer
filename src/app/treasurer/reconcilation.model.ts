import { Claim } from '../expense-claim/claim.model';

export interface BankTransaction {
   number: string;
   date: Date;
   ac: number;
   sortCode: string;
   amount: number;
   subcategory: string;
   memo: string;
}

export type ReconcilationDataStatus = 'OK' | 'NotFound' | 'AmountIncorrect' | 'AlreadyPaid';

export interface ReconciliationResult extends BankTransaction {
   claims: Claim[];
   status: ReconcilationDataStatus;
}
