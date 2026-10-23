import type {
  ApiClaim,
  ApiLostFoundItem,
  ApiUser,
  AiReview,
  Claim,
  LostFoundItem,
  NewClaim,
  User,
} from '../types/index'
import useAuthStore from '../store/authStore'

export const API_URL = (
  import.meta.env.VITE_API_URL ?? ''
).replace(/\/$/, '')

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = useAuthStore.getState().token
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })
  const result = (await response.json().catch(() => null)) as
    | (T & { message?: string })
    | null
  if (!response.ok) {
    throw new Error(result?.message ?? `Request failed: ${response.status}`)
  }
  return result as T
}

async function getJson<T>(path: string): Promise<T> {
  return request<T>(path)
}

function toUser(user: ApiUser): User {
  return user
}

function toItem(item: ApiLostFoundItem): LostFoundItem {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
  }
}

function toClaim(claim: ApiClaim): Claim {
  return {
    ...claim,
    createdAt: new Date(claim.createdAt),
  }
}

export async function fetchUsers(): Promise<User[]> {
  const users = await getJson<ApiUser[]>('/api/users')
  return users.map(toUser)
}

export async function fetchItems(): Promise<LostFoundItem[]> {
  const items = await getJson<ApiLostFoundItem[]>('/api/items')
  return items.map(toItem)
}

export async function fetchItemById(id: string): Promise<LostFoundItem> {
  const item = await getJson<ApiLostFoundItem>(`/api/items/${id}`)
  return toItem(item)
}

export async function fetchClaims(): Promise<Claim[]> {
  const claims = await getJson<ApiClaim[]>('/api/claims')
  return claims.map(toClaim)
}

export async function createClaim(claim: NewClaim): Promise<Claim> {
  const saved = await request<ApiClaim>('/api/claims', {
    method: 'POST',
    body: JSON.stringify(claim),
  })
  return toClaim(saved)
}

export async function updateClaimStatus(
  id: string,
  status: Extract<Claim['status'], 'approved' | 'rejected'>,
): Promise<Claim> {
  const response = await request<ApiClaim>(`/api/claims/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return toClaim(response)
}

export async function askAi(prompt: string): Promise<AiReview> {
  return request<AiReview>('/api/ai', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  })
}