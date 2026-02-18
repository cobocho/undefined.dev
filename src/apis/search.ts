import FlexSearch, { type Document } from "flexsearch";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

import { POST_DIRECTORY } from "../constants/path";
import { SearchResult } from "../interfaces/search";

type SearchField = "title" | "tags" | "body";

interface SearchDocument {
  [key: string]: string | number | boolean | null | string[];
  id: number;
  title: string;
  description: string;
  category: string;
  slug: string;
  date: string;
  minRead: number;
  tags: string[];
  body: string;
}

interface SearchBucket {
  field?: SearchField;
  result: Array<{
    id: number;
    doc: SearchDocument | null;
  }>;
}

interface SearchIndexStore {
  index: Document<SearchDocument>;
}

declare global {
  var __searchIndexStore: SearchIndexStore | undefined;
}

const SEARCH_FIELD_WEIGHTS: Record<SearchField, number> = {
  title: 3,
  tags: 2,
  body: 1,
};

const wordsPerMinute = 200;
const snippetRadius = 70;

function getSearchableBody(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~\-|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getMinRead(content: string) {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

function getSearchDocuments() {
  const categories = fs.readdirSync(POST_DIRECTORY);
  let id = 0;

  return categories.flatMap((category) => {
    const categoryDirectory = join(POST_DIRECTORY, category);
    const slugs = fs
      .readdirSync(categoryDirectory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    return slugs.map((slug) => {
      const fileContent = fs.readFileSync(
        join(POST_DIRECTORY, category, slug, "post.md"),
        "utf-8",
      );
      const { data, content } = matter(fileContent);
      const searchableBody = getSearchableBody(content);

      id += 1;

      return {
        id,
        title: data.title ?? "",
        description: data.description ?? "",
        category,
        slug,
        date: data.date ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        minRead: getMinRead(content),
        body: searchableBody,
      } satisfies SearchDocument;
    });
  });
}

function createSearchIndexStore(): SearchIndexStore {
  const index = new FlexSearch.Document<SearchDocument>({
    tokenize: "forward",
    encoder: FlexSearch.Charset.CJK,
    cache: 256,
    fastupdate: true,
    document: {
      id: "id",
      index: [
        { field: "title", tokenize: "forward", resolution: 9 },
        { field: "tags", tokenize: "forward", resolution: 7 },
        { field: "body", tokenize: "forward", resolution: 5 },
      ],
      store: [
        "id",
        "title",
        "description",
        "category",
        "slug",
        "date",
        "minRead",
        "tags",
        "body",
      ],
      tag: "tags",
    },
  });

  const documents = getSearchDocuments();
  documents.forEach((document) => {
    index.add(document);
  });

  return { index };
}

function getSearchIndexStore() {
  if (!globalThis.__searchIndexStore) {
    globalThis.__searchIndexStore = createSearchIndexStore();
  }

  return globalThis.__searchIndexStore;
}

function getSnippet(body: string, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery || !body) {
    return body.slice(0, snippetRadius * 2).trim();
  }

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const normalizedBody = body.toLowerCase();

  let firstMatchIndex = Number.POSITIVE_INFINITY;
  let firstMatchLength = 0;

  queryTokens.forEach((token) => {
    const tokenIndex = normalizedBody.indexOf(token);

    if (tokenIndex !== -1 && tokenIndex < firstMatchIndex) {
      firstMatchIndex = tokenIndex;
      firstMatchLength = token.length;
    }
  });

  if (!Number.isFinite(firstMatchIndex)) {
    return body.slice(0, snippetRadius * 2).trim();
  }

  const start = Math.max(0, firstMatchIndex - snippetRadius);
  const end = Math.min(
    body.length,
    firstMatchIndex + firstMatchLength + snippetRadius,
  );
  const prefix = start > 0 ? "..." : "";
  const suffix = end < body.length ? "..." : "";

  return `${prefix}${body.slice(start, end).trim()}${suffix}`;
}

function hasTokenMatch(document: SearchDocument, query: string) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return false;
  }

  const title = document.title.toLowerCase();
  const tags = document.tags.join(" ").toLowerCase();
  const body = document.body.toLowerCase();

  return tokens.some(
    (token) =>
      title.includes(token) || tags.includes(token) || body.includes(token),
  );
}

export function searchPosts(query: string, limit: number): SearchResult[] {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const { index } = getSearchIndexStore();
  const buckets = index.search(trimmedQuery, {
    enrich: true,
    suggest: false,
    limit,
    field: ["title", "tags", "body"],
  }) as SearchBucket[];

  const mergedById = new Map<
    number,
    {
      score: number;
      doc: SearchDocument;
      matchedFields: Set<SearchField>;
    }
  >();

  buckets.forEach((bucket) => {
    const field = (bucket.field ?? "body") as SearchField;

    bucket.result.forEach((item, rank) => {
      if (!item.doc) {
        return;
      }

      const weightedScore =
        SEARCH_FIELD_WEIGHTS[field] * 100 + Math.max(0, 100 - rank);
      const existing = mergedById.get(item.id);

      if (existing) {
        existing.score = Math.max(existing.score, weightedScore);
        existing.matchedFields.add(field);
        return;
      }

      mergedById.set(item.id, {
        score: weightedScore,
        doc: item.doc,
        matchedFields: new Set<SearchField>([field]),
      });
    });
  });

  return Array.from(mergedById.values())
    .sort((a, b) => {
      if (b.score === a.score) {
        return new Date(b.doc.date).getTime() - new Date(a.doc.date).getTime();
      }

      return b.score - a.score;
    })
    .filter(({ doc }) => hasTokenMatch(doc, trimmedQuery))
    .slice(0, limit)
    .map(({ doc, matchedFields }) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      slug: doc.slug,
      date: doc.date,
      minRead: doc.minRead,
      tags: doc.tags,
      snippet: getSnippet(doc.body, trimmedQuery),
      matchedFields: Array.from(matchedFields).sort(
        (a, b) => SEARCH_FIELD_WEIGHTS[b] - SEARCH_FIELD_WEIGHTS[a],
      ),
    }));
}
