import { Injectable, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CollectionReference, Firestore, collection, collectionData, deleteDoc, doc, getDocFromServer, increment, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Invoice } from './invoice.model';

const INVOICES_COLLECTION = 'invoices';
const INVOICE_COUNT = 'system/invoice-count';

interface Count {
   count: number;
}

@Injectable({
   providedIn: 'root'
})
export class InvoiceService {

   public invoices: Signal<Invoice[]>;

   constructor(private fs: Firestore,
      private auth: AuthService) {

      // Any is used here as Firebase returns Timestamps and not Dates.  
      const invoiceCollection = collection(this.fs, INVOICES_COLLECTION) as CollectionReference<any>;

      const invoices$ = toObservable(this.auth.user).pipe(
         switchMap((user) => {
            if (!user) {
               return of<Invoice[]>([]);
            } else {
               const q = query(invoiceCollection, orderBy('dateSubmitted', 'desc'));
               return collectionData(q);
            }
         }),
         map((fsInvoices) => this.mapInvoiceDates(fsInvoices))
      );

      this.invoices = toSignal(invoices$, { initialValue: [] });

   }

   /** Converts invoice fields as stored in Firestore to their correct types.
    * - dates from Timestamps (used by Firestore) to Dates 
    * - decinal numbers that get stored in Firestore as strings back to Numbers 
   */
   private mapInvoiceDates(fsInvoices: any[]): Invoice[] {
      return fsInvoices.map((fsInvoice: any) => {
         fsInvoice.dateSubmitted = fsInvoice.dateSubmitted.toDate();
         fsInvoice.datePaid = fsInvoice.datePaid?.toDate();
         fsInvoice.amount = parseFloat(fsInvoice.amount);
         return fsInvoice as Invoice;
      });
   }

   async update(id: string, invoice: Partial<Invoice>): Promise<void> {
      const d = doc(this.fs, INVOICES_COLLECTION, id);
      await setDoc(d, invoice, { merge: true });
   }

   // Incremments the invoice count and retruns the new value
   private async incrementCount(): Promise<number> {
      // Increment the count
      const d = doc(this.fs, INVOICE_COUNT);
      await updateDoc(d, { count: increment(1) });

      // read the count again
      const snap = await getDocFromServer(d);

      return (snap.data() as Count).count;

   }

   async add(invoice: Partial<Invoice>): Promise<void> {

      // Generate next numeric id
      const id = await this.incrementCount();
      invoice.id = 'EX-' + id.toString();

      await setDoc(doc(this.fs, INVOICES_COLLECTION, invoice.id), invoice);

   }

   async delete(id: string): Promise<void> {
      const d = doc(this.fs, INVOICES_COLLECTION, id);
      await deleteDoc(d);
   }
}
