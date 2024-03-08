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

export type ReconciliationMatchStatus = 'IDMatch' | 'DataMatch' | 'NotFound';

export type ReconcilationDataStatus = 'OK' | 'NotFound' | 'AmountIncorrect';

export interface ReconciliationResult {
   trans: BankTransaction;
   claim?: Claim;
   match: ReconciliationMatchStatus;
   status: ReconcilationDataStatus;
}
