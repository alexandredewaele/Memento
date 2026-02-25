import {
  JournalEntry,
  GetEntriesParams,
  EntryListResponse,
  EntryPayload,
} from '../types'
import { request } from '../api'

export async function getEntries(
  params: GetEntriesParams = {},
): Promise<EntryListResponse> {
  const qs = new URLSearchParams()
  if (params.category) qs.set('category', params.category)
  if (params.search) qs.set('search', params.search)
  if (params.is_favorite !== undefined)
    qs.set('is_favorite', String(params.is_favorite))
  if (params.skip !== undefined) qs.set('skip', String(params.skip))
  if (params.limit !== undefined) qs.set('limit', String(params.limit))
  const query = qs.toString() ? `?${qs}` : ''
  return request(`/api/entries${query}`)
}

export async function createEntry(
  payload: EntryPayload,
): Promise<JournalEntry> {
  return request('/api/entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateEntry(
  id: string,
  payload: Partial<EntryPayload>,
): Promise<JournalEntry> {
  return request(`/api/entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteEntry(id: string): Promise<void> {
  return request(`/api/entries/${id}`, { method: 'DELETE' })
}

export async function toggleFavorite(id: string): Promise<JournalEntry> {
  return request(`/api/entries/${id}/favorite`, { method: 'PATCH' })
}
