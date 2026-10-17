import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import useAuthStore from '../store/authStore'
import { loginWithEmailPassword } from '../api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const token = useAuthStore((state) => state.token)
  const saveLogin = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await loginWithEmailPassword(email.trim(), password)
      saveLogin(result.token, result.user.name)
      navigate('/')
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Could not log in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (token !== null) {
    return (
      <section className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
        <p>You are already logged in.</p>
        <Button
          type="button"
          onClick={() => navigate('/')}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Go to Dashboard
        </Button>
      </section>
    )
  }

  return (
    <section className="max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Sign in with your email and password.
      </p>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        No account yet?{' '}
        <Link to="/register" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
          Register
        </Link>
      </p>
    </section>
  )
}

export default LoginPage