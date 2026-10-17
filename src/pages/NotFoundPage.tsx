import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        The page you requested does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </section>
  )
}

export default NotFoundPage