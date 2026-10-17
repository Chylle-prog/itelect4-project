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

  if (typeof result?.token !== 'string' || typeof result.user?.name !== 'string') {
    throw new Error('The backend returned an invalid login response.')
  }

  return result as LoginResponse
}