import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "@/constants/api";
import type { SuggestionItem } from "@/types/compare";

export function useSuggestions(query: string) {
  const [results, setResults] = useState<SuggestionItem[]>([]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      return;
    }

    let isActive = true;
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get<SuggestionItem[]>(`${API_BASE}/suggest`, {
          params: { q: trimmedQuery },
          signal: controller.signal,
        });
        if (isActive) {
          setResults(res.data);
        }
      } catch (err: any) {
        const isCanceled = err?.name === "CanceledError" || err?.code === "ERR_CANCELED";
        const isTimeout = err?.code === "ECONNABORTED";

        if (isCanceled || isTimeout) {
          return;
        }

        if (isActive) {
          setResults([]);
        }
        console.error("Suggestion error:", err?.message ?? err);
      }
    }, 400);

    return () => {
      isActive = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  return results;
}
