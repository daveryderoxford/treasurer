import { Injectable, computed, signal } from '@angular/core';
import { isAwaitingPayment } from '../expense-claim/claim.model';
import { ClaimService } from '../expense-claim/claim.service';
import { BankTransaction, ReconcilationDataStatus, ReconciliationResult, TransactionType, transactionTypes } from './reconcilation.model';
import { parse } from "date-fns";

@Injectable({
   providedIn: 'root'
})
export class ReconciliationService {

   results = signal<ReconciliationResult[]>([]);

   billPaymentResults = computed(() => this.results().filter(res => res.type === 'BBP'));

   constructor(private cs: ClaimService) { }

   private typeFromMemo(memo: string): TransactionType {
      const str = memo.substring(memo.length - 3).trim();
      if (transactionTypes.includes(str as TransactionType)) {
         return str as TransactionType;
      } else {
         return 'Other';
      }
   }

   async readTransactionCSV(file: File): Promise<void> {
      const data = await file.text();
      const r = this.parseTransactionCSV(data);
      console.log(r);
      const res = this.defaultReconcilation(r);
      this.results.set(res);
   }

   /** Parse CSV transaction export from Barclays */
   parseTransactionCSV(data: string): BankTransaction[] {

      const lines = data.split('\n');
    
      return lines
         .slice(1)                                      // slice(1) to skip header row
         .filter(line => line && line.trim() !== '')    // Filter out empty rows
         .map((line, index) => {
            try {
               const data = line.trim().split(',');
               const bankdetails = data[2].split(' ');
               const trans = {
                  number: data[0],
                  date: parse(data[1], 'dd/MM/yyyy', new Date()),
                  sortCode: bankdetails[0],
                  ac: parseInt(bankdetails[1]),
                  amount: parseFloat(data[3]),
                  subcategory: data[4],
                  memo: data[5],
                  type: this.typeFromMemo(data[5])
               };
               return trans;
            } catch (e: any) {
               console.error("Error parsing bank transaction line: " + (index+1).toString() + '  data:   '
                  + line + '\n' + e.toString());
               throw (e);
            }
         });
   }

   /** Reconcile bank transactions with claims.  */
   defaultReconcilation(inputTransactions: BankTransaction[]): ReconciliationResult[] {

      let status: ReconcilationDataStatus;

      // Copy all transactions to output
      const transactions = inputTransactions.map<ReconciliationResult>((trans) => {
         return {
            ...trans,
            status: 'NotFound',
            claims: [],
            type: 'Other',
         };
      });

      //  Find waiting transactions where bank account and  amount matches. 
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
         }
      }

      // Assume the rest of then outstanding claims for a bank account are related to a single transaction
      for (const trans of transactions) {
         const claims = this.cs.claims().filter((c) =>
            c.bankAccountNo === trans.ac &&
            isAwaitingPayment(c)
         );

         if (claims.length > 0) {
            // Check the payment totals 
            const total = claims.reduce((total, c) => total + c.amount, 0.0);
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
            }
         }
      }
      return transactions;
   }

   /** Saves reconciled claim data for all bank transactions */
   saveClaims() {
      for (const trans of this.results()) {
         for (const claim of trans.claims) {
            this.cs.update(claim.id, claim);
         }
      }
   }

   /** Saves reconciled transactiuon data to cloud storage 
    * the data file is named */
   saveTransactions() {
      const data = this.results().map(trans => {
         return;
      });


   }

   save() {
      this.saveClaims();
      this.saveTransactions();
   }
}
