import React from 'react'
import { Metadata } from 'next'

import { Title } from '@/components/ui/Title'
import { getPosts } from '@/apis/posts'
import { PostList } from '@/components/post/PostList'
import { Pagination } from '@/components/ui/Pagination'
import { getAllTags } from '@/apis/tag'
import { HOST } from '@/constants/domain'

interface TagPageProps {
  params: {
    tag: string
    page: string
  }
}

export const generateMetadata = ({ params }: TagPageProps): Metadata => {
  const title = params.tag
  const description = `${params.tag} Posts`
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
  const tags = getAllTags()

  const params = Array.from(tags, (tag) => {
    const pages = tag.count
      ? Array.from({ length: Math.ceil(tag.count / 10) }, (_, i) => i + 1)
      : []

    return pages.map((page) => ({
      tag: tag.name,
      page: String(page),
    }))
  })

  return params.flat()
}

const TagPage = ({ params: { tag, page } }: TagPageProps) => {
  const decodedTag = decodeURIComponent(tag)
  const { posts, postQuantity } = getPosts({
    tag: decodedTag,
    page: parseInt(page),
  })

  return (
    <div>
      <Title>{decodedTag}</Title>
      <PostList posts={posts} />
      <div className="mt-20 flex items-center justify-center">
        <Pagination postQuantity={postQuantity} />
      </div>
    </div>
  )
}

export default TagPage
