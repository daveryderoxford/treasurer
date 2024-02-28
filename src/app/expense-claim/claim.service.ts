import { Injectable, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CollectionReference, Firestore, Timestamp, collection, collectionData, deleteDoc, doc, getCountFromServer, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Claim } from './claim.model';

const CLAIMS_COLLECTION = 'claims'

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
          return of<Claim[]>([])
        } else {
          const q = this.auth.isTreasurer() ?
            query(claimCollection, orderBy('dateSubmitted', 'desc')) :
            query(claimCollection, where('userId', '==', user.uid), orderBy('dateSubmitted', 'desc') );
          return collectionData(q);
        }
      }),
      map((fsClaims) => this.mapClaimDates(fsClaims))
    );

    this.claims = toSignal(claims$, { initialValue: [] });

  }

  /** Converts data from Firestore that has Timestamps to dates */
  mapClaimDates(fsClaims: any[]): Claim[] {
    return fsClaims.map((fsClaim: any) => {
      fsClaim.dateSubmitted = fsClaim.dateSubmitted.toDate();
      fsClaim.datePaid = fsClaim.datePaid?.toDate();
      return fsClaim as Claim;
    });
  }

  async update(id: string, claim: Partial<Claim>): Promise<void> {
    const d = doc(this.fs, CLAIMS_COLLECTION, id);
    await setDoc(d, claim, { merge: true });
  }

  private async getCount(): Promise<number> {
    const coll = collection(this.fs, CLAIMS_COLLECTION);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  }

  async add(claim: Partial<Claim>): Promise<void> {

    // Generate next numeric id
    const id = await this.getCount() + 1;
    claim.id = 'EX-' + id.toString();

    await setDoc(doc(this.fs, CLAIMS_COLLECTION, claim.id), claim);

  }

  async delete(id: string): Promise<void> {
    const d = doc(this.fs, CLAIMS_COLLECTION, id);
    await deleteDoc(d);
  }

}
