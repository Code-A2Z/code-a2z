import { useEffect } from 'react';

interface UseThrottledFetchOptions {
  isAuthenticated: boolean;
  fetch: () => Promise<void>;
  storageKey?: string;
  throttleMs?: number;
}

export const useThrottledFetch = ({
  isAuthenticated,
  fetch,
  storageKey = 'a2z_last_fetch',
  throttleMs = 1000 * 60 * 30, // 30 minutes default
}: UseThrottledFetchOptions) => {
  useEffect(() => {
    if (!isAuthenticated) return;

    const shouldFetch = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return true;
        const ts = Number(raw);
        return Number.isFinite(ts) ? Date.now() - ts > throttleMs : true;
      } catch {
        return true;
      }
    };

    if (shouldFetch()) {
      fetch()
        .then(() => {
          try {
            localStorage.setItem(storageKey, String(Date.now()));
          } catch {
            // ignore storage write errors
          }
        })
        .catch(() => {
          // don’t update timestamp so it can retry later
        });
    }
  }, [isAuthenticated, fetch, throttleMs, storageKey]);
};
