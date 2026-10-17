interface LoginResponse {
  token: string
  user: {
    name: string
  }
}

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? ''
).replace(/\/$/, '')

export async function loginWithEmailPassword(
  email: string,
  password: string,
): Promise<LoginResponse> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    throw new Error('Could not reach the backend. Make sure it is running and try again.')
  }

  const result = (await response.json().catch(() => null)) as
    | (Partial<LoginResponse> & { message?: string })
    | null

  if (!response.ok) {
    throw new Error(result?.message ?? 'Could not log in. Check your email and password.')
  }

  return result as LoginResponse
}

export async function registerWithEmailPassword(
  name: string,
  email: string,
  password: string,
): Promise<{ id: string; name: string; email: string }> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
  } catch {
    throw new Error('Could not reach the backend. Make sure it is running and try again.')
  }

  const result = (await response.json().catch(() => null)) as
    | ({ id?: string; name?: string; email?: string; message?: string })
    | null

  if (!response.ok) {
    throw new Error(result?.message ?? 'Could not register account.')
  }

  return result as { id: string; name: string; email: string }
}