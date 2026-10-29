import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { askAi } from '../api/client'
import { reviewFormSchema, type ReviewFormValues } from '../schemas/reviewSchema'
import type { AiReview } from '../types/index'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const readinessStyles: Record<AiReview['readiness'], string> = {
  ready: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
  almost: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
  'not-yet': 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200',
}

function ReviewPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { prompt: '' },
  })
  const review = useMutation<AiReview, Error, string>({ mutationFn: askAi })

  const onSubmit = (values: ReviewFormValues): void => review.mutate(values.prompt)

  return (
    <section className="max-w-3xl space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">AI Item Report Review</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Get feedback on how clear and useful a lost-and-found report is. This is a suggestion, not proof of ownership.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="ai-prompt">Describe the lost or found item</Label>
          <textarea
            id="ai-prompt"
            rows={6}
            maxLength={2000}
            placeholder="Include the item, distinguishing features, and where or when it was lost or found. Avoid personal contact details."
            aria-invalid={errors.prompt ? true : undefined}
            className="w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
            {...register('prompt')}
          />
          {errors.prompt && <p className="text-sm text-destructive">{errors.prompt.message}</p>}
        </div>

        <Button type="submit" disabled={review.isPending}>
          {review.isPending ? 'Reviewing...' : 'Review report'}
        </Button>
      </form>

      {review.isError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {review.error.message}
        </p>
      )}

      {review.data && (
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Review</h2>
            <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${readinessStyles[review.data.readiness]}`}>
              {review.data.readiness}
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200">{review.data.summary}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold">What is clear</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                {review.data.strengths.map((strength, index) => <li key={`${index}-${strength}`}>{strength}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Possible improvements</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                {review.data.improvements.map((improvement, index) => <li key={`${index}-${improvement}`}>{improvement}</li>)}
              </ul>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AI feedback can be inaccurate. Verify details yourself and do not include passwords or sensitive personal information.
          </p>
        </section>
      )}
    </section>
  )
}

export default ReviewPage