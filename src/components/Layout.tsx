import { NavLink, Outlet } from 'react-router'
import useAuthStore from '../store/authStore'
import useUiStore from '../store/uiStore'

function Layout() {
  const isDarkMode = useUiStore((state) => state.isDarkMode)
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode)
  const userName = useAuthStore((state) => state.userName)
  const logout = useAuthStore((state) => state.logout)

  const base = 'rounded-md px-3 py-1.5 text-sm font-medium transition'
  const active = `${base} bg-blue-600 text-white`
  const idle = `${base} text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700`
  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? active : idle

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white text-slate-800 dark:bg-[#16171d] dark:text-slate-100">
        <nav className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <span className="mr-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
            Lost & Found Router App
          </span>
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/users" className={linkClass}>Users</NavLink>
          <NavLink to="/items" className={linkClass}>Items</NavLink>
          <NavLink to="/claims" className={linkClass}>Claims</NavLink>
          {userName === null ? (
            <NavLink to="/login" className={linkClass}>Login</NavLink>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Logout ({userName})
            </button>
          )}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="ml-auto rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>

        <main className="mx-auto w-full max-w-6xl p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout