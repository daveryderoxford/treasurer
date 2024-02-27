

export const invoiceStates = ['Submitted', 'Paid', 'Reconciled', 'Error', 'Cancelled'] as const;
export type InvoiceState = typeof invoiceStates[number];

export interface Invoice {
    id: string;
    userId: string;
    email: string;
    dateSubmitted: Date;
    dateSPaid: Date;

    name: string;
    amount: number;
    attachments: string[];
    state: InvoiceState;
   
    description: string;
    notes: string | undefined;
}
