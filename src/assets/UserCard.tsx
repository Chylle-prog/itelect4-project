// src/assets/UserCard.tsx
import type { User } from "../types/index";

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{user.email}</p>
      <span className="mt-2 inline-flex rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">{user.role}</span>
      {user.score !== undefined && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Score: {user.score}</p>
      )}
    </div>
  );
}

export default UserCard;
