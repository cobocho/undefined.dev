import { Metadata } from 'next'

import { getCategories } from '@/apis/category'
import { getAllPosts, getPosts } from '@/apis/posts'
import { CategoryList } from '@/components/post/CategoryList'
import { PostList } from '@/components/post/PostList'
import { Pagination } from '@/components/ui/Pagination'
import { HOST } from '@/constants/domain'

interface AllPostsProps {
  params: {
    page: string
  }
}

export const generateMetadata = (): Metadata => {
  const title = 'Posts'
  const description = 'All posts'
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
  const allPosts = getAllPosts()

  const pages = allPosts
    ? Array.from({ length: Math.ceil(allPosts.length / 10) }, (_, i) => i + 1)
    : []

  return pages.map((page) => {
    return {
      page: String(page),
    }
  })
}

export default function AllPosts({ params }: AllPostsProps) {
  const { posts, postQuantity } = getPosts({ page: Number(params.page) })
  const categories = getCategories()

  return (
    <div>
      <CategoryList categories={categories} />
      <PostList posts={posts} />
      <div className="mt-20 flex items-center justify-center">
        <Pagination postQuantity={postQuantity} />
      </div>
    </div>
  )
}
