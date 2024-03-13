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

export const transactionTypes = ['BBP', 'BGC', 'DDR', 'FT', 'BG', 'ATM', 'Other'] as const;
export type TransactionType = typeof transactionTypes[number];

export interface ReconciliationResult extends BankTransaction {
   claims: Claim[];
   status: ReconcilationDataStatus;
   type: TransactionType;
}
