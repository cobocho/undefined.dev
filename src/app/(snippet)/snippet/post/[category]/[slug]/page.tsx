import { Metadata } from 'next'

import { Giscus } from '@/components/post/Giscus'
import { PostContent } from '@/components/post/PostContent'
import { PostHeader } from '@/components/post/PostHeader'
import { PostTOC } from '@/components/post/PostTOC/PostTOC'
import { getAllSnippets, getSnippet } from '@/apis/snippets'
import { HOST } from '@/constants/domain'

interface SnippetPageProps {
  params: {
    category: string
    slug: string
  }
}

export const generateMetadata = ({
  params: { slug, category },
}: SnippetPageProps): Metadata => {
  const snippet = getSnippet(category, slug)

  return {
    title: snippet.title,
    openGraph: {
      title: `${snippet.title}`,
      description: snippet.title,
      images: [HOST + '/images/default-thumbnail.png'],
    },
    twitter: {
      title: `${snippet.title}`,
      description: snippet.title,
      images: [HOST + '/images/default-thumbnail.png'],
    },
  }
}

export function generateStaticParams() {
  const allSnippets = getAllSnippets()

  return allSnippets.map(({ slug, category }) => {
    return { slug, category }
  })
}

const SnippetPage = ({ params: { category, slug } }: SnippetPageProps) => {
  const snippet = getSnippet(category, slug)

  return (
    <div className="flex flex-col gap-20">
      <PostHeader post={snippet} isSnippet />
      <div>
        <PostContent post={snippet} />
        <Giscus />
        <div className="fixed right-[calc((100dvw_-_900px)_/_2)] top-[10rem] hidden translate-x-[calc(100%_+_20px)] desktop:block">
          <PostTOC />
        </div>
      </div>
    </div>
  )
}

export default SnippetPage
