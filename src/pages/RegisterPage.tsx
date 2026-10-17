import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import useAuthStore from '../store/authStore'
import { loginWithEmailPassword, registerWithEmailPassword } from '../api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const token = useAuthStore((state) => state.token)
  const saveLogin = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setIsSubmitting(true)

    try {
      await registerWithEmailPassword(name.trim(), email.trim(), password)
      const loginResult = await loginWithEmailPassword(email.trim(), password)
      saveLogin(loginResult.token, loginResult.user.name)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not register.')
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
      <h1 className="text-2xl font-bold">Register</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Create an account to report and claim lost & found items.
      </p>
      <form className="space-y-4" onSubmit={handleRegister}>
        <div className="space-y-1.5">
          <Label htmlFor="register-name">Full Name</Label>
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jane Doe"
            required
            minLength={2}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            required
            minLength={8}
          />
        </div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
          Log In
        </Link>
      </p>
    </section>
  )
}

export default RegisterPage
