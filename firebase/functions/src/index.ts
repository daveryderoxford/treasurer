/**
 * OFixtures Google clould functions exports
 */
import * as admin from "firebase-admin";
import { setGlobalOptions } from 'firebase-functions/v2/options';

const firebaseAdmin = admin.initializeApp();
setGlobalOptions({ region: 'europe-west1' });

export { createUser, deleteUser } from "./user/user";
export { claimWritten } from "./expense-claim/claim";
