// src/assets/ClaimBadge.tsx
import type { Claim } from "../types/index";

interface ClaimBadgeProps {
  claim: Claim | null;
  claimantName?: string;
  itemName?: string;
  onAccept?: () => void;
  onReject?: () => void;
  showDetails?: boolean;
  children?: React.ReactNode;
}

const ClaimBadge: React.FC<ClaimBadgeProps> = ({
  claim,
  claimantName,
  itemName,
  onAccept,
  onReject,
  showDetails = true,
  children,
}) => {
  const handleAccept = (_e: React.MouseEvent<HTMLButtonElement>): void => {
    if (onAccept) {
      onAccept();
    }
  };

  const handleReject = (_e: React.MouseEvent<HTMLButtonElement>): void => {
    if (onReject) {
      onReject();
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {claim ? (
        <>
          <div className="mb-2 flex items-center gap-2">
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${claim.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : claim.status === 'rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'}`}>{claim.status}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Item #{claim.itemId}</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            Item: {itemName ?? `Item ${claim.itemId}`}
          </p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
            Claimant: {claimantName ?? `User ${claim.claimantUserId}`}
          </p>
          {showDetails && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Evidence: {claim.notes}</p>}
          {showDetails && claim.verifiedByUserId !== undefined && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Verified by User {claim.verifiedByUserId}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={handleAccept} className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700">Accept Claim</button>
            <button onClick={handleReject} className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700">Reject Claim</button>
          </div>
          {showDetails && <div className="mt-3">{children}</div>}
        </>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-300">No claim loaded yet.</p>
      )}
    </div>
  );
};

export default ClaimBadge;
