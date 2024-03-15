import { Injectable, computed, signal } from '@angular/core';
import { parse } from "date-fns";
import { Claim, isAwaitingPayment } from '../expense-claim/claim.model';
import { ClaimService } from '../expense-claim/claim.service';
import { BankLineItem, ReconcilationDataStatus, Transaction, TransactionType, transactionTypes } from './reconcilation.model';

interface RawTransaction extends BankLineItem {
   claimIds: string[];
}

@Injectable({
   providedIn: 'root'
})
export class ReconciliationService {

   /** Source transactions that contains the bank line items and list of claim ids */
   private rawTransactions = signal<RawTransaction[]>([]);

   /** Claims avaliable to be assigned against a transaction
    * These are all claims in submitted/*** state  except ones already assigned againts 
    * a transaction */
   avaliableClaims = computed<Claim[]>(() => {
      // TODO filter if already included in a transaction
      return this.cs.claims().filter(c => isAwaitingPayment(c));
   });

   transactions = computed(() => {
      const claims = this.cs.claims();
      return this.rawTransactions().map(raw => this.makeTransaction(raw, claims));
   });

   /** Creates a transacton from a raw transaction by populationg claim data
    * and calculating totals. 
   */
   private makeTransaction(raw: RawTransaction, allClaims: Claim[]): Transaction {

      const transClaims = raw.claimIds.map(id => allClaims.find(c => c.id === id)!);

      const total = transClaims.reduce((total, c) => total + c.amount, 0.0);

      let status: ReconcilationDataStatus = 'NotFound';
      if (transClaims.length > 0) {
         // Check the payment totals 
         status = (raw.amount === total) ? 'OK' : 'AmountIncorrect';
      }

      let reason = '';
      if (status === 'AmountIncorrect') {
         reason = `Total of claims: ${total}.  Difference is: ${raw.amount - total}`
      }
      
      return {
         ...raw,
         status: status,
         claims: transClaims,
         reason: reason
      };
   }

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
      const bankLineItems = this.parseTransactionCSV(data);

      const res = this.defaultReconcilation(bankLineItems);

      this.rawTransactions.set(res);
   }

   addClaim(transaction: Transaction, claimId: string) {

      const allTrans = [...this.rawTransactions()];

      const index = allTrans.findIndex(raw => raw.id === transaction.id);
      if (index === -1) throw (new Error('ReconcilationService: transaction not found'));

      allTrans[index].claimIds.push(claimId);

      this.rawTransactions.set(allTrans);

   }

   removeClaim(transaction: Transaction, claimId: string) {

      const allTrans = [...this.rawTransactions()];

      const index = allTrans.findIndex(raw => raw.id === transaction.id);
      if (index === -1) throw (new Error('ReconcilationService: transaction not found'));

      allTrans[index].claimIds = allTrans[index].claimIds.filter(id => id !== claimId);

      this.rawTransactions.set(allTrans);
   }

   get inProgress() {
      return this.rawTransactions().length !== 0;
   }

   /** Parse CSV transaction export from Barclays */
   private parseTransactionCSV(data: string): BankLineItem[] {

      const lines = data.split('\n');

      return lines
         .slice(1)                                      // slice(1) to skip header row
         .filter(line => line && line.trim() !== '')    // Filter out any empty lines
         .map((line, index) => {
            try {
               const data = line.trim().split(',');
               const bankdetails = data[2].split(' ');
               const trans: BankLineItem = {
                  id: index.toString(),
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
               console.error("Error parsing bank transaction line: " + (index + 1).toString() + '  data:   '
                  + line + '\n' + e.toString());
               throw (e);
            }
         });
   }

   /** Assign default claims to a bank line item. 
    * Assignment is as follows:
    *  1. Only consider Bill Payment (BBP transactions) 
    *  2. If there is an unpaid transaction with matching amount then use it
    *     ...otherwise assume all outstanding claims for the user are associated with the transaction.
   */
   private defaultReconcilation(lineItems: BankLineItem[]): RawTransaction[] {

      let status: ReconcilationDataStatus;

      // Create default transactions for all line items. 
      const transactions = lineItems.map<RawTransaction>(lineItem => {
         return {
            ...lineItem,
            claimIds: [],
         };
      });

      //  Find waiting transactions where bank account and amount matches. 
      for (const trans of transactions) {
         const claim = this.cs.claims().find((c) =>
            c.bankAccountNo === trans.ac &&
            isAwaitingPayment(c) &&
            c.amount == trans.amount
         );
         if (claim) {
            trans.claimIds = [claim.id];
         }
      }

      // Assume the rest of then outstanding claims for a bank account are related to a single transaction
      for (const trans of transactions) {
         const claims = this.cs.claims().filter((c) =>
            c.bankAccountNo === trans.ac &&
            isAwaitingPayment(c)
         );
      }
      return transactions;
   }

   /** Saves reconciled claim data for all bank transactions */
   private async saveClaims() {
      for (const trans of this.transactions()) {
         for (const claim of trans.claims) {
            claim.datePaid = new Date();

            switch (trans.status) {
               case 'OK':
                  claim.reason = '';
                  claim.state = 'Reconciled';
                  break;
               case 'NotFound':
                  console.error('ReconcilationService: Unexpectly in not found state');
                  break;
               case 'AmountIncorrect':
                  claim.state = 'Error';
                  claim.reason = trans.reason;
                  break;
               default:
                  break;
            }
            await this.cs.update(claim.id, claim);
         }
      }
   }

   /** Saves reconciled transactiuon data to cloud storage 
    * the data file is named */
   private async saveTransactions() {
      const data = this.transactions().map(trans => {
         return;
      });
   }

   /** Save transaction data and reset */
   async save() {
      await this.saveClaims();
      await this.saveTransactions();
      this.rawTransactions.set([]);
   }

   /** Reset the trabsaction data without saving it. */
   cancel() {
     this.rawTransactions.set([]);
   }
}
