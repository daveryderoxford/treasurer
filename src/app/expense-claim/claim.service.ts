import { Injectable, Signal, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth } from '@angular/fire/auth';
import { CollectionReference, Firestore, collection, collectionData, deleteDoc, doc, getCountFromServer, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { Claim } from './claim.model';
import { AuthService } from '../auth/auth.service';

const CLAIMS_COLLECTION = 'claims'

@Injectable( {
    providedIn: 'root'
  } )
  export class ClaimService {
  
    private claims$ = of<Claim[]>([]);
    claims = signal<Claim[]>([]);
  
    constructor ( private fs: Firestore,
      private auth: AuthService ) {

      effect( () {
        if (auth.isTreasurer()) {
          const claimCollection = collection( this.fs, CLAIMS_COLLECTION ) as CollectionReference<Claim>;

          this.claims$ = collectionData<Claim>( claimCollection ).pipe(
            tap( claims => console.log('Claim count: ' + claims.length)),
            shareReplay( 1 ),
          );
          this.claims = toSignal(this.claims$, { initialValue: [] });
        } else {
          

        }
      })
  



    }
  
    async update( id: string, claim: Partial<Claim> ): Promise<void> {
      const d = doc( this.fs, CLAIMS_COLLECTION, id );
      await setDoc( d, claim, { merge: true } );
    }

    private async getCount(): Promise<number> {
    const coll = collection(this.fs, CLAIMS_COLLECTION);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  }
  
    async add( claim: Partial<Claim> ): Promise<void> {

      // Generate next numeric id
      const id = await this.getCount()+1;
      claim.id = 'EX-' + id.toString();

      await setDoc(doc(this.fs, CLAIMS_COLLECTION, claim.id), claim);
      
    }
  
    async delete( id: string ): Promise<void> {
      const d = doc( this.fs, CLAIMS_COLLECTION, id );
      await deleteDoc( d );
    }

  }
  