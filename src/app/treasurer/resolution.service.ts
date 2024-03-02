import { Injectable } from '@angular/core';
import { ClaimService } from '../expense-claim/claim.service';
import { Claim } from '../expense-claim/claim.model';

export interface BankTransaction {
   reference: string;
   name: string;
   ac: number;
   sortCode: string;
   amount: number;
}

export type ResolutionMatchStatus = 'IDMatch' | 'DataMatch' | 'NotFound';

export type ResolutionDataStatus = 'OK' | 'NotFound' | 'AmountIncorrect';

export interface ResolutionResult {
   trans: BankTransaction;
   claim?: Claim;
   match: ResolutionMatchStatus;
   status: ResolutionDataStatus;
}

@Injectable({
   providedIn: 'root'
})
export class ResolutionService {
   constructor(private cs: ClaimService) { }

   readTransactionCSV(data: string): BankTransaction[] {
      const lines = data.split('\n');

      return lines.map((line, index) => {
         const data = line.split(',');
         try {
            return {
               reference: data[0],
               name: data[1],
               ac: parseInt(data[2]),
               sortCode: data[3],
               amount: parseFloat(data[4])
            };
         } catch (e: any) {
            console.error("Error parsing bank transaction  line: " + index + '  data:   '
               + line + '\n' + e.toString());
            throw (e);
         }
      });
   }

   private findClaim(trans: BankTransaction, claims: Claim[]): { claim: Claim | undefined; status: ResolutionMatchStatus } {
      let status: ResolutionMatchStatus;
      // Match on the ID initally
      let claim = claims.find((c) => c.id === trans.reference);
      status = claim ? 'IDMatch' : 'NotFound';

      if (!claim) {
         // Match on account/amount for claims thta have not been reconciled
         claim = claims.find((c) => c.bankAccountNo === trans.ac &&
            c.amount === trans.amount &&
            c.state !== 'Reconciled');
         status = claim ? 'DataMatch' : 'NotFound';
      }
      return { claim: claim, status: status };
   }

   private checkClaim(claim: Claim, trans: BankTransaction): ResolutionDataStatus {
      return 'OK'
      // TODO
   }

   resolve(transactions: BankTransaction[]): ResolutionResult[] {

      const r = transactions.map((trans) => {
         let status: ResolutionDataStatus = 'NotFound'
         let found = this.findClaim(trans, this.cs.claims());
         if (found.claim) {
            status = this.checkClaim(found.claim, trans);
         }

         return {
            trans: trans,
            claim: found.claim,
            match: found.status,
            status: status
         }

      });
      return r;
   }
}
