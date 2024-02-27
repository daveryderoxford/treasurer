import { Injectable, computed, Signal} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, User, authState } from '@angular/fire/auth';

@Injectable( {
    providedIn: 'root'
  } )
  export class AuthService {

    user: Signal<User | null | undefined>;
    isTreasurer = computed( () => this.user()?.uid == 'mSHcPGvXG0NxYPqBlMopoKDjrty1');

    constructor( private auth: Auth) {

        this.user = toSignal( authState(auth) );
        
    }
  }

