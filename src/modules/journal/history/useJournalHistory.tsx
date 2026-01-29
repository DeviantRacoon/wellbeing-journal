import { api } from "@/commons/libs/request";
import { useCallback, useEffect, useState } from "react";
import type { IJournal } from "../journal.d";

export default function useJournalHistory() {
  const [entries, setEntries] = useState<IJournal[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<IJournal | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEntries = useCallback(
    async ({ reset = false }: { reset?: boolean } = {}) => {
      // Prevent fetching if already loading or no more items (unless resetting)
      if (isLoading && !reset) return;
      if (!hasMore && !reset) return;

      setIsLoading(true);

      try {
        // If resetting, start from page 1. Otherwise use current page state.
        const currentPage = reset ? 1 : page;
        const limit = 20;

        console.log(`Fetching dailies: page=${currentPage}, reset=${reset}`);

        const response = await api.get("dailies", {
          orderBy: "desc",
          page: currentPage,
          limit,
          _t: Date.now(), // Prevent caching
        });

        // API response structure: { ok: boolean, data: IJournal[], total: number, message: string }
        const newEntries = response.data || [];
        const total = response.total || 0;

        setEntries((prev) => {
          if (reset) return newEntries;

          // Avoid duplicates if any
          const existingIds = new Set(prev.map((e) => e.id));
          const uniqueNewEntries = newEntries.filter(
            (e: IJournal) => !existingIds.has(e.id),
          );

          return [...prev, ...uniqueNewEntries];
        });

        const currentCount = reset
          ? newEntries.length
          : entries.length + newEntries.length;

        setHasMore(currentCount < total);

        // Update page for NEXT fetch
        setPage((prev) => (reset ? 2 : prev + 1));
      } catch (error) {
        console.error("Failed to fetch entries:", error);
      } finally {
        setIsLoading(false);
      }
    },
    // Dependencies:
    // - page: needed for next fetch
    // - entries.length: needed for hasMore calculation if not using functional state?
    //   Actually, we used `entries.length` in the body. Ideally we should use functional update or ref.
    //   But for now, adding it to dependency is safe enough as long as we handle race conditions logic.
    [page, hasMore, isLoading, entries.length],
  );

  // Initial load & Event Listeners
  useEffect(() => {
    fetchEntries({ reset: true });

    const handleUpdate = () => {
      console.log("Journal update received, refreshing...");
      fetchEntries({ reset: true });
    };

    const handleFocus = () => {
      // Optional: Check if enough time has passed to avoid spamming
      console.log("Window focused, checking for updates...");
      fetchEntries({ reset: true });
    };

    window.addEventListener("journal-update", handleUpdate);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("journal-update", handleUpdate);
      window.removeEventListener("focus", handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    entries,
    selectedEntry,
    setSelectedEntry,
    fetchEntries,
    isLoading,
    hasMore,
  };
}
