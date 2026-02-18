export interface SearchResult {
  id: number;
  title: string;
  description: string;
  category: string;
  slug: string;
  date: string;
  minRead: number;
  tags: string[];
  snippet: string;
  matchedFields: Array<"title" | "tags" | "body">;
}

export interface SearchResponse {
  query: string;
  total: number;
  results: SearchResult[];
}
