import { Injectable, Signal, effect, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Auth } from '@angular/fire/auth';
import { CollectionReference, Firestore, collection, collectionData, deleteDoc, doc, getCountFromServer, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { Claim } from './claim.model';
import { AuthService } from '../auth/auth.service';

const CLAIMS_COLLECTION = 'claims'

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  public claims: Signal<Claim[]>;

  constructor(private fs: Firestore,
    private auth: AuthService) {

    const claimCollection = collection(this.fs, CLAIMS_COLLECTION) as CollectionReference<Claim>;

    const claims$ = toObservable(this.auth.user).pipe(
      switchMap((user) => {
        if (!user) {
          return of<Claim[]>([])
        } else {
          const q = this.auth.isTreasurer() ?
            query(claimCollection) :
            query(claimCollection, where('userId', '==', user.uid));
          return collectionData(q);
        }
      })
    );

    this.claims = toSignal(claims$, {initialValue: []});

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
