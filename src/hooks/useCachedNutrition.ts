/**
 * API caching - cache nutrition analysis results by image hash or URI
 * Reduces duplicate API calls for same image
 */
import { useCallback, useRef } from 'react';
import { FoodItem } from '@models/nutrition';

const CACHE_MAX = 50;
const cache = new Map<string, { item: FoodItem; ts: number }>();

function pruneCache(): void {
  if (cache.size <= CACHE_MAX) return;
  const entries = Array.from(cache.entries()).sort((a, b) => a[1].ts - b[1].ts);
  const toDelete = entries.slice(0, cache.size - CACHE_MAX).map((e) => e[0]);
  toDelete.forEach((k) => cache.delete(k));
}

export function useCachedNutrition() {
  const cacheKeyRef = useRef<string | null>(null);

  const getCached = useCallback((key: string): FoodItem | null => {
    const entry = cache.get(key);
    if (!entry) return null;
    const maxAge = 1000 * 60 * 30;
    if (Date.now() - entry.ts > maxAge) {
      cache.delete(key);
      return null;
    }
    return entry.item;
  }, []);

  const setCached = useCallback((key: string, item: FoodItem): void => {
    cache.set(key, { item, ts: Date.now() });
    pruneCache();
  }, []);

  const setCacheKey = useCallback((key: string | null) => {
    cacheKeyRef.current = key;
  }, []);

  const getCacheKey = useCallback(() => cacheKeyRef.current, []);

  return { getCached, setCached, setCacheKey, getCacheKey };
}
