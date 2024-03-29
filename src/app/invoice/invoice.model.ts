import { GoogleStorageReference } from '../shared/components/file-upload/google-storage-ref.model';


export const invoiceStates = ['Submitted', 'Paid', 'Reconciled', 'Error', 'Cancelled'] as const;
export type InvoiceState = typeof invoiceStates[number];

export interface Invoice {
    id: string;
    userId: string;

    name: string;
    organisation?: string;
    email: string;
    dateSubmitted: Date;
    datePaid: Date;

    amount: number;
    attachments: GoogleStorageReference[];
    state: InvoiceState;
   
    description: string;
    reason?: string;
}
