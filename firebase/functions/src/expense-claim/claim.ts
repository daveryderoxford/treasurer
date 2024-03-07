
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
            text: `            
Thanks for submitting an expense claim to IBRSC.  Details are as follows:
  Name: ${after.name}
  Amount £${after.amount.toString()}
  Email: ${after.email}
  ${after.attachments.length} attachments
  Bank account number: ${after.bankAccountNo}
  Sort code: ${after.bankSortCode}
  Details: ${after.description}

Please replay to this email if any of these details is not correct. 

Regards
Dave Ryder
IBRSC Treasurer
`}
      };
      sendMail(msg);
   }
});
