import { useMemo, useCallback, useRef, DependencyList } from "react";

/**
 * Hook para memoización profunda de objetos
 * Útil cuando las dependencias son objetos/arrays
 */
export function useDeepMemo<T>(factory: () => T, deps: DependencyList): T {
  const ref = useRef<{ deps: DependencyList; value: T } | undefined>(undefined);

  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      value: factory(),
    };
  }

  return ref.current.value;
}

/**
 * Comparación profunda simple
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

/**
 * Hook para callback memoizado con comparación profunda
 */
export function useDeepCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  const ref = useRef<{ deps: DependencyList; callback: T } | undefined>(
    undefined
  );

  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      callback,
    };
  }

  return useCallback(ref.current.callback, [ref.current]);
}

/**
 * Hook para memoizar datos de API
 * Incluye timestamp para invalidación
 */
interface CachedData<T> {
  data: T;
  timestamp: number;
}

export function useCachedData<T>(
  key: string,
  ttl: number = 5 * 60 * 1000 // 5 minutos por defecto
): {
  get: () => T | null;
  set: (data: T) => void;
  clear: () => void;
  isExpired: () => boolean;
} {
  const cacheRef = useRef<Map<string, CachedData<T>>>(new Map());

  const get = useCallback(() => {
    const cached = cacheRef.current.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > ttl) {
      cacheRef.current.delete(key);
      return null;
    }

    return cached.data;
  }, [key, ttl]);

  const set = useCallback(
    (data: T) => {
      cacheRef.current.set(key, {
        data,
        timestamp: Date.now(),
      });
    },
    [key]
  );

  const clear = useCallback(() => {
    cacheRef.current.delete(key);
  }, [key]);

  const isExpired = useCallback(() => {
    const cached = cacheRef.current.get(key);
    if (!cached) return true;
    return Date.now() - cached.timestamp > ttl;
  }, [key, ttl]);

  return { get, set, clear, isExpired };
}

/**
 * Hook para memoizar async functions
 */
export function useAsyncMemo<T>(
  factory: () => Promise<T>,
  deps: DependencyList,
  initialValue: T
): { value: T; loading: boolean; error: Error | null } {
  const [state, setState] = React.useState<{
    value: T;
    loading: boolean;
    error: Error | null;
  }>({
    value: initialValue,
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    let cancelled = false;

    setState((prev) => ({ ...prev, loading: true }));

    factory()
      .then((value) => {
        if (!cancelled) {
          setState({ value, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false, error }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  return state;
}

// React import
import * as React from "react";
