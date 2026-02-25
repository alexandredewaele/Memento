export enum EntryCategory {
  FACT = 'Fact',
  WORD = 'Word',
  INSIGHT = 'Insight',
  QUOTE = 'Quote',
}

export interface JournalEntry {
  id: string
  user_id: string
  title: string
  content: string
  category: EntryCategory
  phonetic?: string | null
  example?: string | null
  is_favorite: boolean
  created_at: string
  updated_at: string
}
