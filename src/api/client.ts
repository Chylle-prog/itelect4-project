import type {
  ApiClaim,
  ApiLostFoundItem,
  ApiUser,
  Claim,
  LostFoundItem,
  NewClaim,
  User,
} from '../types/index'
import useAuthStore from '../store/authStore'

export const API_URL = (
  import.meta.env.VITE_API_URL ?? ''
).replace(/\/$/, '')

function getAuthHeaders(): HeadersInit {
  const token = useAuthStore.getState().token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { headers: getAuthHeaders() })
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
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
  const saved = await fetch(`${API_URL}/api/claims`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(claim),
  })
  if (!saved.ok) {
    const result = (await saved.json().catch(() => null)) as { message?: string } | null
    throw new Error(result?.message ?? 'Could not create claim')
  }
  const data = (await saved.json()) as ApiClaim
  return toClaim(data)
}

export async function updateClaimStatus(
  id: string,
  status: Extract<Claim['status'], 'approved' | 'rejected'>,
): Promise<Claim> {
  const response = await fetch(`${API_URL}/api/claims/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(result?.message ?? 'Could not update claim')
  }

  return toClaim((await response.json()) as ApiClaim)
}