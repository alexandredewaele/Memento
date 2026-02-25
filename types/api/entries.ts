import { EntryCategory, JournalEntry } from '../models'

export interface GetEntriesParams {
  category?: EntryCategory
  search?: string
  is_favorite?: boolean
  skip?: number
  limit?: number
}

export interface EntryListResponse {
  entries: JournalEntry[]
  total: number
  skip: number
  limit: number
}

export interface EntryPayload {
  title: string
  content: string
  category: EntryCategory
  phonetic?: string
  example?: string
  is_favorite?: boolean
}
