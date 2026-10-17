import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LostFoundItem } from '../types/index'

interface UiState {
  isDarkMode: boolean
  searchValue: string
  itemFilter: 'all' | LostFoundItem['status']
  toggleDarkMode: () => void
  setSearchValue: (value: string) => void
  setItemFilter: (filter: UiState['itemFilter']) => void
}

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      searchValue: '',
      itemFilter: 'all',
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setSearchValue: (searchValue) => set({ searchValue }),
      setItemFilter: (itemFilter) => set({ itemFilter }),
    }),
    {
      name: 'lost-found-ui',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
)

export default useUiStore