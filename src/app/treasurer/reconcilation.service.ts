import { Injectable, Signal, signal } from '@angular/core';
import { ClaimService } from '../expense-claim/claim.service';
import { Claim, isAwaitingPayment } from '../expense-claim/claim.model';
import { ReconciliationResult, BankTransaction, ReconcilationDataStatus } from './reconcilation.model';

@Injectable({
   providedIn: 'root'
})
export class ReconciliationService {

   results = signal<ReconciliationResult[]>([]);

   constructor(private cs: ClaimService) { }

   /** Parse CSV transaction export from Barclays */
   async readTransactionCSV(file: File): Promise<BankTransaction[]> {

      const data = await file.text();
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

   /** Reconcile bank transactions with  */
   reconcile(inputTransactions: BankTransaction[]) {

      let status: ReconcilationDataStatus;

      const transactions = inputTransactions.map<ReconciliationResult>((trans) => {
         return {
            ...trans,
            status: 'NotFound',
            claims: []
         };
      });

      //  Find transactions that are 
      for (const trans of transactions) {
         const claim = this.cs.claims().find((c) =>
            c.bankAccountNo === trans.ac &&
            isAwaitingPayment(c) &&
            c.amount == trans.amount
         );
         if (claim) {
            trans.claims = [claim];
            trans.status = 'OK';
            claim.state = 'Reconciled';
            this.cs.update(claim.id, claim);
         }
      }

      // Assume the rest of then outstanding claims for a bank account are related to a single 
      for (const trans of transactions) {
         const claims = this.cs.claims().filter((c) =>
            c.bankAccountNo === trans.ac &&
            isAwaitingPayment(c)
         );

         if (claims.length > 0) {
            // Check the payment 
            const total = claims.map(c => c.amount).reduce((total, acc) => total + acc, 0.0);
            const status = (trans.amount == total) ? 'OK' : 'AmountIncorrect';

            trans.claims = claims;
            trans.status = status;
            for (const claim of claims) {
               if (status == 'OK') {
                  claim.state = 'Reconciled';
               } else {
                  claim.state = 'Error';
                  claim.reason = 'Total claims not equal to transaction: Total: ' + total + 'transaction' + trans.amount
                     + ' /n Claims' + claims.map(c => c.id).toString();
               }
               this.cs.update(claim.id, claim);
            }
         }
      }
   }

   /** Saves reconcile transactions to a   */
   save() {

   }
}
