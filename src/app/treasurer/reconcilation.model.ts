import { Claim } from '../expense-claim/claim.model';

export const transactionTypes = ['BBP', 'BGC', 'DDR', 'FT', 'BG', 'ATM', 'Other'] as const;
export type TransactionType = typeof transactionTypes[number];

export interface BankLineItem {
   id: string;
   number: string;
   date: Date;
   ac: number;
   sortCode: string;
   amount: number;
   subcategory: string;
   memo: string;
   type: TransactionType;
}

export type ReconcilationDataStatus = 'OK' | 'NotFound' | 'AmountIncorrect' | 'AlreadyPaid';

/** Reconciled transaction */
export interface Transaction extends BankLineItem {
   claims: Claim[];
   status: ReconcilationDataStatus;
}
