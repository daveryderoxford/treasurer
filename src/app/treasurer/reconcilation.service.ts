import { Injectable, Signal, signal } from '@angular/core';
import { ClaimService } from '../expense-claim/claim.service';
import { Claim } from '../expense-claim/claim.model';
import { ReconciliationResult, BankTransaction, ReconciliationMatchStatus, ReconcilationDataStatus } from './reconcilation.model';

@Injectable({
   providedIn: 'root'
})
export class ReconciliationService {

   results = signal<ReconciliationResult[]>([]);

   constructor(private cs: ClaimService) { }

   /** Parse CSV transaction export from Barclays 
    * 
    * 
   */
   readTransactionCSV(data: string): BankTransaction[] {
      const lines = data.split('\n');

      // slice(1) to skip header row
      return lines.slice(1).map((line, index) => {
         const data = line.split(',');
         const bankdetails = data[2].split(' ');
         try {
            return {
               number: data[0],
               date: new Date(data[1]),
               sortCode: bankdetails[0],
               ac: parseInt(bankdetails[1]),
               amount: parseFloat(data[3]),
               subcategory: data[4],
               memo: data[5],
            };
         } catch (e: any) {
            console.error("Error parsing bank transaction  line: " + index + '  data:   '
               + line + '\n' + e.toString());
            throw (e);
         }
      });
   }

   /** Find claim related to a bank transaction */
   private findClaim(trans: BankTransaction, claims: Claim[]): { claim: Claim | undefined; status: ReconciliationMatchStatus; } {
      let status: ReconciliationMatchStatus;
      // Match on the ID initally
      let claim = claims.find((c) => c.id === trans.number);
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

   private checkClaim(claim: Claim, trans: BankTransaction): ReconcilationDataStatus {
      return 'OK';
      // TODO
   }

   /**  */
   resolve(transactions: BankTransaction[]) {

      const r = transactions.map((trans) => {
         let status: ReconcilationDataStatus = 'NotFound';
         let found = this.findClaim(trans, this.cs.claims());
         if (found.claim) {
            status = this.checkClaim(found.claim, trans);
         }

         return {
            trans: trans,
            claim: found.claim,
            match: found.status,
            status: status
         };

      });
      this.results.set(r);
   }
}
