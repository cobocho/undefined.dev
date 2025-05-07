import Link from 'next/link'

import { getPosts } from '@/apis/posts'
import { AppearBottom } from '@/components/motion/AppearBottom'
import { PostList } from '@/components/post/PostList'
import { Carousel } from '@/components/ui/Carousel'
import { Pagination } from '@/components/ui/Pagination'
import { CategoryList } from '@/components/post/CategoryList'
import { getCategories } from '@/apis/category'

export default function Home() {
  const { posts, postQuantity } = getPosts({ page: 1 })
  const categories = getCategories()
  const newPosts = posts.splice(0, 5)

  return (
    <div>
      <AppearBottom className="flex h-fit w-full items-center justify-between pb-10 pt-20">
        <h1 className="text-5xl font-bold italic text-outline">New Posts</h1>
        <Link href="/1" className="font-regular group">
          More +
          <div className="h-[1px] w-full origin-left scale-x-0 bg-outline/50 transition-transform group-hover:scale-x-100" />
        </Link>
      </AppearBottom>
      <div className="relative mb-20 h-fit w-dvw -translate-x-[calc((100vw_-_900px)_/_2)] transform mobile:w-full mobile:translate-x-0">
        <Carousel posts={newPosts} />
      </div>
      <CategoryList categories={categories} />
      <PostList posts={posts} />
      <div className="mt-20 flex items-center justify-center">
        <Pagination postQuantity={postQuantity} />
      </div>
    </div>
  )
}
