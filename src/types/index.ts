export interface User {
id: string;
name: string;
email: string;
role: "student" | "admin" | "instructor";
isActive: boolean;
score?: number;
}

// ===== APP TYPES =====
export interface LostFoundItem {
id: string;
title: string;
description: string;
category: string;
status: "lost" | "found";
location: string;
postedByUserId: string;
claimedByUserId?: string;
verifiedByUserId?: string;
createdAt: Date;
}

export interface Claim {
id: string;
itemId: string;
claimantUserId: string;
notes: string;
status: "pending" | "approved" | "rejected";
verifiedByUserId?: string;
createdAt: Date;
}

export interface AiReview {
  summary: string
  strengths: string[]
  improvements: string[]
  readiness: 'ready' | 'almost' | 'not-yet'
}

// ===== GENERIC INTERFACE =====
export interface ApiResponse<T> {
success: boolean;
data: T;
message?: string;
}

// ===== UTILITY TYPES =====
export type UserUpdate = Partial<User>;
export type ItemSummary = Pick<LostFoundItem, "id" | "title" | "status">;
export type PublicClaim = Omit<Claim, "verifiedByUserId">;
export type ItemStatusCount = Record<LostFoundItem["status"], number>;

export type ApiUser = Omit<User, "id"> & { id: string };
export type ApiLostFoundItem = Omit<LostFoundItem, "id" | "postedByUserId" | "createdAt"> & {
  id: string;
  postedByUserId: string;
  createdAt: string;
};
export type ApiClaim = Omit<Claim, "createdAt"> & {
  createdAt: string;
};

export type NewClaim = Pick<Claim, "itemId" | "notes">;

// ===== ENUMS (as const objects — compatible with erasableSyntaxOnly) =====
export const ClaimStatus = {
  Pending: "pending",
  Verified: "verified",
  Rejected: "rejected",
  Released: "released",
} as const;
export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus];

export const ClaimDecision = {
  Approved: "approved",
  Rejected: "rejected",
} as const;
export type ClaimDecision = (typeof ClaimDecision)[keyof typeof ClaimDecision];
