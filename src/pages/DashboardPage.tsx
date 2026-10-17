import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { fetchClaims, fetchItems, fetchUsers } from '../api/client'
import type { Claim, LostFoundItem, User } from '../types/index'
import useAuthStore from '../store/authStore'

function DashboardPage() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const usersQuery = useQuery<User[]>({ queryKey: ['users'], queryFn: fetchUsers })
  const itemsQuery = useQuery<LostFoundItem[]>({ queryKey: ['items'], queryFn: fetchItems })
  const claimsQuery = useQuery<Claim[]>({ queryKey: ['claims'], queryFn: fetchClaims })

  if (usersQuery.isPending || itemsQuery.isPending || claimsQuery.isPending) {
    return <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">Loading dashboard...</div>
  }

  if (usersQuery.isError || itemsQuery.isError || claimsQuery.isError) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">Could not load dashboard data. Please log in again and retry.</p>
  }

  const users = usersQuery.data
  const items = itemsQuery.data
  const claims = claimsQuery.data

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Quick overview of users, items, and claims.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Users</p>
          <p className="mt-2 text-2xl font-bold">{users.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Items</p>
          <p className="mt-2 text-2xl font-bold">{items.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Claims</p>
          <p className="mt-2 text-2xl font-bold">{claims.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">Session</p>
          <p className="mt-2 text-sm font-semibold">{token === null ? 'Logged out' : 'Logged in'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate('/items')}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Browse Items
        </button>
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          View Users
        </button>
        <button
          type="button"
          onClick={() => navigate('/claims')}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          Open Claims Queue
        </button>
      </div>
    </section>
  )
}

export default DashboardPage