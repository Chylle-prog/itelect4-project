import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import UserCard from '../assets/UserCard'
import { fetchUsers } from '../api/client'
import type { User } from '../types/index'

function UsersPage() {
  const { data: users = [], isPending, isError, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
  const [activeUserIndex, setActiveUserIndex] = useState(0)
  const navigate = useNavigate()

  const activeUser = users[activeUserIndex] ?? null

  const showPrevUser = (): void => {
    if (users.length === 0) {
      return
    }
    setActiveUserIndex((prev) => (prev === 0 ? users.length - 1 : prev - 1))
  }

  const showNextUser = (): void => {
    if (users.length === 0) {
      return
    }
    setActiveUserIndex((prev) => (prev === users.length - 1 ? 0 : prev + 1))
  }

  if (isPending) {
    return <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">Loading users...</div>
  }

  if (isError) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{error.message} Make sure `npm run api` is running.</p>
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <span className="text-xs text-slate-500 dark:text-slate-300">
          {users.length === 0 ? '0 / 0' : `${activeUserIndex + 1} / ${users.length}`}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={showPrevUser}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={showNextUser}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          Next
        </button>
      </div>

      {activeUser ? (
        <div className="max-w-md">
          <UserCard user={activeUser} />
        </div>
      ) : (
        <p className="text-sm text-slate-600 dark:text-slate-300">No users available.</p>
      )}

      <button
        type="button"
        onClick={() => navigate('/claims', { state: { userId: activeUser?.id ?? null } })}
        disabled={activeUser === null}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Review Claims for Current User
      </button>
    </section>
  )
}

export default UsersPage