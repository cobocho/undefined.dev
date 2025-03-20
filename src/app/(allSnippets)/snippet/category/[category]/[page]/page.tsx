import { Metadata } from 'next'

import { Pagination } from '@/components/ui/Pagination'
import { getCategories } from '@/apis/category'
import { getSnippets } from '@/apis/snippets'
import { SnippetList } from '@/components/snippet/SnippetList'
import { HOST } from '@/constants/domain'

interface CategoryPostsProps {
  params: {
    category: string
    page: string
  }
}

export const generateMetadata = ({ params }: CategoryPostsProps): Metadata => {
  const title = params.category
  const description = `${params.category} Posts`
  const images = [HOST + '/images/default-thumbnail.png']

  return {
    title,
    openGraph: {
      title,
      description,
      images,
    },
    twitter: {
      title,
      description,
      images,
    },
  }
}

export function generateStaticParams() {
  const categories = getCategories(true)

  const params = Array.from(categories, (category) => {
    const pages = category.posts
      ? Array.from(
          { length: Math.ceil(category.posts.length / 10) },
          (_, i) => i + 1,
        )
      : []

    return pages.map((page) => ({
      category: category.name,
      page: String(page),
    }))
  })

  return params.flat()
}

export default function CategoryPosts({ params }: CategoryPostsProps) {
  const { snippets, snippetQuantity } = getSnippets({
    page: Number(params.page),
    category: params.category,
  })

  return (
    <div>
      <SnippetList snippets={snippets} />
      <div className="mt-20 flex items-center justify-center">
        <Pagination postQuantity={snippetQuantity} />
      </div>
    </div>
  )
}
