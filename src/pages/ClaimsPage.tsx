import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router'
import ClaimBadge from '../assets/ClaimBadge'
import { createClaim, fetchClaims, fetchItems, fetchUsers, updateClaimStatus } from '../api/client'
import { claimSchema, type ClaimFormValues } from '../schemas/claimSchema'
import type { Claim, LostFoundItem, NewClaim, User } from '../types/index'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ClaimsPage() {
  const claimsQuery = useQuery<Claim[]>({ queryKey: ['claims'], queryFn: fetchClaims })
  const itemsQuery = useQuery<LostFoundItem[]>({ queryKey: ['items'], queryFn: fetchItems })
  const usersQuery = useQuery<User[]>({ queryKey: ['users'], queryFn: fetchUsers })
  const [activeClaimIndex, setActiveClaimIndex] = useState(0)
  const [claimMode, setClaimMode] = useState<'submit' | 'review'>('review')
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const currentUserId = (location.state as { userId?: string | null } | null)?.userId ?? null
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    mode: 'onBlur',
    defaultValues: { itemId: '', notes: '' },
  })

  const claims = (claimsQuery.data ?? []).filter(
    (claim) => currentUserId === null || claim.claimantUserId === currentUserId,
  )
  const items = itemsQuery.data ?? []
  const users = usersQuery.data ?? []
  const activeClaim = claims[activeClaimIndex] ?? null
  const claimant = activeClaim
    ? users.find((user) => user.id === activeClaim.claimantUserId) ?? null
    : null
  const item = activeClaim
    ? items.find((entry) => entry.id === activeClaim.itemId) ?? null
    : null
  const submitItemId = watch('itemId')
  const submitItem = items.find((entry) => entry.id === submitItemId) ?? null
  const displayedClaim = activeClaim

  const addClaim = useMutation<Claim, Error, NewClaim>({
    mutationFn: createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] })
      reset()
    },
  })

  const reviewClaim = useMutation<Claim, Error, { id: string; status: 'approved' | 'rejected' }>({
    mutationFn: ({ id, status }) => updateClaimStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] })
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  const showPrevClaim = (): void => {
    if (claims.length === 0) {
      return
    }
    setActiveClaimIndex((prev) => (prev === 0 ? claims.length - 1 : prev - 1))
  }

  const showNextClaim = (): void => {
    if (claims.length === 0) {
      return
    }
    setActiveClaimIndex((prev) => (prev === claims.length - 1 ? 0 : prev + 1))
  }

  const updateClaim = (status: Claim['status']): void => {
    if (!activeClaim) {
      return
    }

    if (status === 'approved' || status === 'rejected') {
      reviewClaim.mutate({ id: activeClaim.id, status })
    }
  }

  const onSubmit = (values: ClaimFormValues): void => {
    addClaim.mutate({ itemId: values.itemId, notes: values.notes.trim() })
  }

  if (claimsQuery.isPending || itemsQuery.isPending || usersQuery.isPending) {
    return <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">Loading claims...</div>
  }

  if (claimsQuery.isError || itemsQuery.isError || usersQuery.isError) {
    return <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">Could not load claims data. Make sure `npm run api` is running.</p>
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Claims Queue</h1>
        <span className="text-xs text-slate-500 dark:text-slate-300">
          {claims.length === 0 ? '0 / 0' : `${activeClaimIndex + 1} / ${claims.length}`}
        </span>
      </div>

          {currentUserId !== null && (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Showing the claim context for user #{currentUserId} first.
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setClaimMode((mode) => mode === 'submit' ? 'review' : 'submit')}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          {claimMode === 'submit' ? 'Switch to Review Claims' : 'Switch to Submit Claim'}
        </button>
      </div>

      {claimMode === 'submit' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="space-y-1.5">
            <Label htmlFor="claim-item">Item to claim</Label>
            <select
              id="claim-item"
              {...register('itemId')}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-600 dark:bg-slate-900"
              aria-invalid={errors.itemId ? true : undefined}
            >
              <option value="">Choose an item</option>
              {items.map((availableItem) => (
                <option key={availableItem.id} value={availableItem.id}>
                  {availableItem.title} ({availableItem.status})
                </option>
              ))}
            </select>
            {errors.itemId && <p className="text-sm text-red-600">{errors.itemId.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="claim-notes">Evidence</Label>
            <Input
              id="claim-notes"
              {...register('notes')}
              placeholder="Explain why this item belongs to you"
              aria-invalid={errors.notes ? true : undefined}
            />
            {errors.notes && <p className="text-sm text-red-600">{errors.notes.message}</p>}
          </div>
          <Button type="submit" disabled={submitItem === null || addClaim.isPending}>
            {addClaim.isPending ? 'Submitting...' : 'Submit Claim'}
          </Button>
          {addClaim.isError && <p className="text-sm text-red-700">{addClaim.error.message}</p>}
          {addClaim.isSuccess && <p className="text-sm text-emerald-700">Claim submitted and list refreshed.</p>}
        </form>
      ) : (
        <>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={showPrevClaim}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={showNextClaim}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              Next
            </button>
            {item && (
              <button
                type="button"
                onClick={() => navigate(`/items/${item.id}`)}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Open Item Detail
              </button>
            )}
          </div>

          <div className="max-w-xl">
            <ClaimBadge
              claim={displayedClaim}
              claimantName={claimant?.name}
              itemName={item?.title}
              onAccept={() => updateClaim('approved')}
              onReject={() => updateClaim('rejected')}
              showDetails
            >
              {item && (
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  Item status updates immediately when claim is accepted or rejected.
                </p>
              )}
            </ClaimBadge>
            {reviewClaim.isError && <p className="mt-2 text-sm text-red-700">{reviewClaim.error.message}</p>}
          </div>
        </>
      )}
    </section>
  )
}

export default ClaimsPage