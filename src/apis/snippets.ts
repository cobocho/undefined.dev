/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs'
import { join } from 'path'

import { StaticImageData } from 'next/image'
import matter from 'gray-matter'

import { Snippet } from '@/interfaces/snippet'

import { slicePage, sortByDate } from './utils'
import { SNIPPET_DIRECTORY } from './common'
import { getCategories } from './category'

export const getSnippetImages = (folder: string, slug: string) => {
  try {
    const hasImages = fs.existsSync(
      join(SNIPPET_DIRECTORY, folder, slug, 'images'),
    )

    if (!hasImages) {
      return {}
    }

    const imagesFileNames = fs.readdirSync(
      join(SNIPPET_DIRECTORY, folder, slug, 'images'),
    )

    const images: { [key: string]: StaticImageData } = {}

    imagesFileNames.forEach((file) => {
      images[file] = require(
        `/_snippets/${folder}/${slug}/images/${file}`,
      ).default
    })

    return images
  } catch {
    return {}
  }
}
export const getSnippet = (category: string, slug: string): Snippet => {
  const postFile = fs.readFileSync(
    join(SNIPPET_DIRECTORY, category, slug, 'post.md'),
    'utf-8',
  )

  const images = getSnippetImages(category, slug)

  const { data, content } = matter(postFile)

  const snippet = {
    title: data.title,
    description: data.description,
    date: data.date,
    category,
    slug,
    content,
    images,
  }

  return snippet
}

export const getAllSnippets = () => {
  const categories = getCategories(true)

  const allSnippets = categories.flatMap((category) => {
    const snippets = fs.readdirSync(join(SNIPPET_DIRECTORY, category.name))
    return snippets.map((post) => getSnippet(category.name, post))
  })

  return allSnippets
}

interface SnippetSearchOption {
  category?: string
  page: number
}

export const getSnippets = (option: SnippetSearchOption = { page: 1 }) => {
  const { category, page } = option

  const allSnippets = getAllSnippets()

  if (category) {
    const filteredSnippets = allSnippets.filter(
      (snippet) => snippet.category === category,
    )

    const results = slicePage(
      sortByDate(filteredSnippets).map((snippet, idx) => ({
        ...snippet,
        idx: filteredSnippets.length - idx,
      })),
      page,
    )

    return {
      snippets: results,
      snippetQuantity: filteredSnippets.length,
    }
  }

  return {
    snippets: slicePage(sortByDate(allSnippets), page),
    snippetQuantity: allSnippets.length,
  }
}
