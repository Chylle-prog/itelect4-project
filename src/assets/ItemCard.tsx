// src/assets/ItemCard.tsx
import type { LostFoundItem } from "../types/index";

interface ItemCardProps {
  item: LostFoundItem;
  variant?: 'default' | 'compact';
}

function ItemCard({ item, variant = 'default' }: ItemCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div className={`w-full rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 ${isCompact ? 'p-3' : 'p-5'}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${item.status === 'lost' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'}`}>{item.status}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{item.category}</span>
      </div>
      <h3 className={`font-bold text-slate-900 dark:text-white ${isCompact ? 'text-base' : 'text-lg'}`}>{item.title}</h3>
      {!isCompact && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>}
      {!isCompact && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Location: {item.location}</p>}
      <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">Status: {item.status}</p>
    </div>
  );
}

export default ItemCard;
