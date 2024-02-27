import { Injectable, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Auth, authState } from "@angular/fire/auth";
import { DocumentReference, Firestore, doc, docData, updateDoc } from "@angular/fire/firestore";
import { of } from 'rxjs';
import { shareReplay, startWith, switchMap } from 'rxjs/operators';
import { UserData } from "./user.model";

@Injectable({
  providedIn: "root"
})
export class UserDataService {

  user: Signal<UserData | null | undefined>;

  private uid: string | null = '';

  constructor(
    private auth: Auth,
    private fs: Firestore,
  ) {

    const user$ = authState(this.auth).pipe(
      startWith(null),
      switchMap((u) => {
        if (!u) {
          console.log("UserData: Firebase user null.  Stop monitoring user date  ");
          return of(null);
        } else {
          console.log(`UserData: monitoring uid: ${u.uid}`);
          return docData(this._doc(u.uid))
        }
      }),
      shareReplay(1)
    );

    this.user = toSignal(user$);

  }

  /** Update the user info.  Returning the modified user details */
  async updateDetails(details: Partial<UserData>): Promise<void> {
    return updateDoc(this._getUserDoc(), details)
  }

  private _doc(uid: string): DocumentReference<UserData> {
    return doc(this.fs, "users/" + uid) as DocumentReference<UserData>
  }

  /** Get the database documents associated with the user
   * The user must be logged in to use this function.
   */
  private _getUserDoc(): DocumentReference<UserData> {
    return this._doc(this.uid!);
  }
}
