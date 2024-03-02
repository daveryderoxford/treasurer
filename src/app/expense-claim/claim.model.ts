import { Attachment } from "../shared/components/file-upload/file-upload.model";

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
    attachments: Attachment[];
    state: ClaimState;
    bankAccountHolder: string;
    bankAccountNo: number;
    bankSortCode: string;
    description: string;
    reason?: string;
}
