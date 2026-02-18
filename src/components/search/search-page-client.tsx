"use client";

import dayjs from "dayjs";
import { debounce } from "es-toolkit/function";
import { Search, SearchX } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import { SearchResponse, SearchResult } from "../../interfaces/search";
import { cn } from "../../lib/utils";

const DEBOUNCE_WAIT = 300;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const MotionLink = motion.create(Link);

function highlightText(text: string, query: string, className?: string) {
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => escapeRegExp(token));

  if (tokens.length === 0) {
    return text;
  }

  const regex = new RegExp(`(${tokens.join("|")})`, "gi");
  const segments = text.split(regex);
  let offset = 0;

  return segments.map((segment, index) => {
    const key = `${offset}-${segment}`;
    offset += segment.length;

    if (index % 2 === 0) {
      return <Fragment key={key}>{segment}</Fragment>;
    }

    return (
      <mark
        key={key}
        className={cn(
          "rounded-sm bg-amber-200/80 px-0.5 text-inherit dark:bg-amber-500/30",
          className,
        )}
      >
        {segment}
      </mark>
    );
  });
}

export function SearchPageClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const latestRequestIdRef = useRef(0);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (nextQuery: string) => {
        abortControllerRef.current?.abort();
        const nextAbortController = new AbortController();
        abortControllerRef.current = nextAbortController;
        const requestId = latestRequestIdRef.current + 1;
        latestRequestIdRef.current = requestId;

        try {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(nextQuery)}`,
            {
              signal: nextAbortController.signal,
            },
          );

          if (!response.ok) {
            throw new Error("검색 요청에 실패했습니다.");
          }

          const payload = (await response.json()) as SearchResponse;

          if (latestRequestIdRef.current !== requestId) {
            return;
          }

          setResults(payload.results);
          setTotal(payload.total);
          setError(null);
        } catch (caughtError) {
          if (nextAbortController.signal.aborted) {
            return;
          }

          const errorMessage =
            caughtError instanceof Error
              ? caughtError.message
              : "검색 중 오류가 발생했습니다.";

          setError(errorMessage);
          setResults([]);
          setTotal(0);
        } finally {
          if (latestRequestIdRef.current === requestId) {
            setIsLoading(false);
          }
        }
      }, DEBOUNCE_WAIT),
    [],
  );

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      debouncedSearch.cancel();
      abortControllerRef.current?.abort();
      setIsLoading(false);
      setError(null);
      setResults([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    debouncedSearch(trimmedQuery);
  }, [query, debouncedSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      abortControllerRef.current?.abort();
    };
  }, [debouncedSearch]);

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">검색</h1>
      <div className="mb-6">
        <label htmlFor="search-input" className="sr-only">
          검색어
        </label>
        <div className="focus-within:border-primary focus-within:ring-primary/20 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 transition-all duration-200 focus-within:ring-4 dark:border-neutral-700 dark:bg-neutral-900">
          <Search className="size-5 text-neutral-400" />
          <input
            id="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="placeholder:text-muted-foreground w-full border-none bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <output
        className="mb-4 block text-sm text-neutral-500 dark:text-neutral-400"
        aria-live="polite"
      >
        {query.trim() && `${total}개의 검색 결과`}
      </output>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      {!isLoading && query.trim() && results.length === 0 && !error && (
        <div className="text-muted-foreground flex items-center gap-2 py-8 text-sm">
          <SearchX className="size-4" />
          검색 결과가 없습니다.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {results.map((result, index) => (
          <MotionLink
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            key={result.id}
            href={`/post/${result.category}/${result.slug}`}
            className="group rounded-xl border border-neutral-100 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <div className="mb-1 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="capitalize">{result.category}</span>
              <span>·</span>
              <span>{dayjs(result.date).format("YYYY년 MM월 DD일")}</span>
              <span>·</span>
              <span>{result.minRead} min read</span>
            </div>

            <h2 className="mb-2 text-lg font-semibold text-neutral-800 group-hover:text-neutral-950 dark:text-neutral-200 dark:group-hover:text-neutral-50">
              {highlightText(result.title, query)}
            </h2>

            <p className="mb-3 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
              {highlightText(result.snippet, query)}
            </p>

            <div className="mb-2 flex flex-wrap gap-2">
              {result.tags.map((tag) => (
                <span
                  key={`${result.id}-${tag}`}
                  className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                >
                  #{highlightText(tag, query)}
                </span>
              ))}
            </div>
          </MotionLink>
        ))}
      </div>
    </div>
  );
}
