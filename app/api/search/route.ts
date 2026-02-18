import { NextResponse } from "next/server";

import { searchPosts } from "@/apis/search";
import { SearchResponse } from "@/interfaces/search";

const MIN_QUERY_LENGTH = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function getLimit(limitQuery: string | null) {
  if (!limitQuery) {
    return DEFAULT_LIMIT;
  }

  const numericLimit = Number(limitQuery);

  if (Number.isNaN(numericLimit)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(MAX_LIMIT, Math.max(1, Math.floor(numericLimit)));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const limit = getLimit(searchParams.get("limit"));

  if (query.length < MIN_QUERY_LENGTH) {
    const emptyResponse: SearchResponse = {
      query,
      total: 0,
      results: [],
    };

    return NextResponse.json(emptyResponse);
  }

  const results = searchPosts(query, limit);
  const response: SearchResponse = {
    query,
    total: results.length,
    results,
  };

  return NextResponse.json(response);
}
