import { GoogleStorageReference } from "../shared/components/file-upload/google-storage-ref.model";

export const claimSources = ['Internal', 'External'] as const;
export type ClaimSource = typeof claimSources[number];

export const claimStates = ['Submitted', 'Approved', 'Rejected', 'Paid', 'Reconciled', 'Error', 'Cancelled'] as const;
export type ClaimState = typeof claimStates[number];

export interface Claim {
    id: string;
    userId: string;
    dateSubmitted: Date;
    datePaid?: Date;
    source: ClaimSource;
    name: string;
    email: string;
    amount: number;
    attachments: GoogleStorageReference[];
    state: ClaimState;
    bankAccountHolder: string;
    bankAccountNo: number;
    bankSortCode: string;
    description: string;
    reason?: string;
}

export const isAwaitingPayment = (c: Claim) => c.state === 'Submitted' || c.state === 'Approved';

export const isPaid = (c: Claim) => c.state === 'Paid' || c.state === 'Reconciled' || c.state === 'Error';

export const isCanceled = (c: Claim) => c.state === 'Cancelled' || c.state === 'Rejected';
