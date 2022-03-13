import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export const getQuery = <T extends object>(search: URLSearchParams) => {
  const query = {} as T
  for (const [key, value] of search.entries()) {
    Object.assign(query, { [key]: value })
  }
  return query
}

export function useQuery(): [query: URLSearchParams, search: string]
export function useQuery(key: string): [query: string | null, search: string]
export function useQuery(key?: string) {
  const { search } = useLocation()
  return useMemo(() => {
    const query = new URLSearchParams(search)
    return [key ? query.get(key) : query, search]
  }, [key, search])
}
