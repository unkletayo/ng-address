import { useRef, useEffect, useInsertionEffect } from 'react';

const useIsomorphicInsertionEffect =
  typeof window !== 'undefined' ? useInsertionEffect : useEffect;

/**
 * Stores the latest value in a ref so callbacks and effects always have access
 * to current props without needing them in dependency arrays.
 * Follows Vercel React Best Practices: `advanced-use-latest` & `advanced-event-handler-refs`.
 */
export function useLatest<T>(value: T): React.MutableRefObject<T> {
  const ref = useRef<T>(value);
  useIsomorphicInsertionEffect(() => {
    ref.current = value;
  });
  return ref;
}
