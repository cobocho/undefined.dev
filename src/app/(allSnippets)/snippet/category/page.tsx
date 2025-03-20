import { Metadata } from 'next'

import { getCategories } from '@/apis/category'
import { SnippetCategoryList } from '@/components/snippet/SnippetCategoryList'
import { Title } from '@/components/ui/Title'
import { HOST } from '@/constants/domain'

export const generateMetadata = (): Metadata => {
  const title = 'Snippets'
  const description = 'All Snippets'
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

export default function AllCategories() {
  const categories = getCategories(true)

  return (
    <div>
      <Title>Snippets</Title>
      <SnippetCategoryList categories={categories} />
    </div>
  )
}
