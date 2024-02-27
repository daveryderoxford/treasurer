/**
 * OFixtures Google clould functions exports
 */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as user from "./user/user";

const firebaseAdmin = admin.initializeApp();

export const createUsder = user.createUser;
export const deleteUsder = user.deleteUser;
