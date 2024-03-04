
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { Claim } from "./claim.model";
import { MailMessage, sendMail } from '../mail/mail';

export const claimWritten = onDocumentWritten("claims/{id}", (event) => {

   const snapshot = event.data;
   if (!snapshot) {
      console.log("No data associated with the event");
      return;
   }
   const before = snapshot.before.data() as Claim;
   const after = snapshot.after.data() as Claim;

   // Send mail when new claim added
   if (!before) {
      const msg: MailMessage = {
         to: after.email,
         message: {
            subject: `IBRSC Expense claim ${after.id} - Submitted`,
            text: `Amount £${after.amount.toString()} to ${after.name}
                   ${after.description}`
         }
      };
      sendMail(msg);
   }
});

