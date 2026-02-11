
export enum EntryCategory {
  FACT = 'Fact',
  WORD = 'Word',
  INSIGHT = 'Insight',
  QUOTE = 'Quote'
}

export interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  category: EntryCategory;
  phonetic?: string;
  example?: string;
  isFavorite?: boolean;
}

export type ScreenType = 'home' | 'search' | 'new' | 'history' | 'stats' | 'profile';
