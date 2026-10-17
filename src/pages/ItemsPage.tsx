import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import ItemCard from '../assets/ItemCard'
import { fetchItems } from '../api/client'
import useUiStore from '../store/uiStore'
import type { LostFoundItem } from '../types/index'

function ItemsPage() {
  const { data = [], isPending, isError, error } = useQuery<LostFoundItem[]>({
    queryKey: ['items'],
    queryFn: fetchItems,
  })
  const searchValue = useUiStore((state) => state.searchValue)
  const setSearchValue = useUiStore((state) => state.setSearchValue)
  const itemFilter = useUiStore((state) => state.itemFilter)
  const setItemFilter = useUiStore((state) => state.setItemFilter)

  const filteredItems = data.filter((item) => {
    const keyword = searchValue.trim().toLowerCase()
    const searchPass =
      keyword.length === 0 ||
      item.title.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword) ||
      item.location.toLowerCase().includes(keyword)

    const filterPass = itemFilter === 'all' || item.status === itemFilter

    return searchPass && filterPass
  })

  if (isPending) {
    return <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">Loading items...</div>
  }

  if (isError) {
    return (
      <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
        <p>{error.message} Make sure `npm run api` is running.</p>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Items</h1>
      </div>

      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search items by title, category, or location"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setItemFilter('all')}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${itemFilter === 'all' ? 'border-sky-600 bg-sky-100 text-sky-700 dark:border-sky-400 dark:bg-sky-900/40 dark:text-sky-200' : 'border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700'}`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setItemFilter('lost')}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${itemFilter === 'lost' ? 'border-amber-600 bg-amber-100 text-amber-700 dark:border-amber-400 dark:bg-amber-900/40 dark:text-amber-200' : 'border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700'}`}
        >
          Lost
        </button>
        <button
          type="button"
          onClick={() => setItemFilter('found')}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${itemFilter === 'found' ? 'border-emerald-600 bg-emerald-100 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-900/40 dark:text-emerald-200' : 'border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700'}`}
        >
          Found
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Link key={item.id} to={`/items/${item.id}`} className="block">
            <ItemCard item={item} variant="compact" />
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300">
          No items match your current search and filter.
        </p>
      )}
    </section>
  )
}

export default ItemsPage