import { Injectable, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CollectionReference, Firestore, collection, collectionData, deleteDoc, doc, getDocFromServer, increment, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Claim } from './claim.model';

const CLAIMS_COLLECTION = 'claims';
const CLAIM_COUNT = 'system/claim-count';

interface Count {
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  public claims: Signal<Claim[]>;

  constructor(private fs: Firestore,
    private auth: AuthService) {

    // Any is used here as Firebase returns Timestamps and not Dates.  
    const claimCollection = collection(this.fs, CLAIMS_COLLECTION) as CollectionReference<any>;

    const claims$ = toObservable(this.auth.user).pipe(
      switchMap((user) => {
        if (!user) {
          return of<Claim[]>([]);
        } else {
          const q = this.auth.isTreasurer() ?
            query(claimCollection, orderBy('dateSubmitted', 'desc')) :
            query(claimCollection, where('userId', '==', user.uid), orderBy('dateSubmitted', 'desc'));
          return collectionData(q);
        }
      }),
      map((fsClaims) => this.mapClaimDates(fsClaims))
    );

    this.claims = toSignal(claims$, { initialValue: [] });

  }

  /** Converts claim fields as stored in Firestore to their correct types.
   * - dates from Timestamps (used by Firestore) to Dates 
   * - decinal numbers that get stored in Firestore as strings back to Numbers 
  */
  private mapClaimDates(fsClaims: any[]): Claim[] {
    return fsClaims.map((fsClaim: any) => {
      fsClaim.dateSubmitted = fsClaim.dateSubmitted.toDate();
      fsClaim.datePaid = fsClaim.datePaid?.toDate();
      fsClaim.amount = parseFloat(fsClaim.amount);
      return fsClaim as Claim;
    });
  }

  async update(id: string, claim: Partial<Claim>): Promise<void> {
    const d = doc(this.fs, CLAIMS_COLLECTION, id);
    await setDoc(d, claim, { merge: true });
  }

  // Incremments the claim count and retruns the new value
  private async incrementCount(): Promise<number> {
    // Increment the count
    const d = doc(this.fs, CLAIM_COUNT);
    await updateDoc(d, { count: increment(1) });

    // read the count again
    const snap = await getDocFromServer(d);

    return (snap.data() as Count).count;

  }

  async add(claim: Partial<Claim>): Promise<void> {

    // Generate next numeric id
    const id = await this.incrementCount();
    claim.id = 'EX-' + id.toString();

    await setDoc(doc(this.fs, CLAIMS_COLLECTION, claim.id), claim);

  }

  async delete(id: string): Promise<void> {
    const d = doc(this.fs, CLAIMS_COLLECTION, id);
    await deleteDoc(d);
  }

}
