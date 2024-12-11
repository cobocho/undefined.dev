import { Metadata } from 'next'

import { getAllPosts, getPost } from '@/apis/posts'
import { Giscus } from '@/components/post/Giscus'
import { PostContent } from '@/components/post/PostContent'
import { PostContentThumbnail } from '@/components/post/PostContentThumbnail'
import { PostHeader } from '@/components/post/PostHeader'
import { PostTOC } from '@/components/post/PostTOC/PostTOC'

interface PostPageProps {
  params: {
    category: string
    slug: string
  }
}

export const generateMetadata = ({
  params: { slug, category },
}: PostPageProps): Metadata => {
  const post = getPost(category, slug)

  return {
    title: post.title,
    openGraph: {
      title: `${post.title}`,
      description: post.description,
      images: [post.thumbnail.src],
    },
    twitter: {
      title: `${post.title}`,
      description: post.description,
      images: [post.thumbnail.src],
    },
  }
}

export function generateStaticParams() {
  const allPosts = getAllPosts()

  return allPosts.map(({ slug, category }) => {
    return { slug, category }
  })
}

const PostPage = ({ params: { category, slug } }: PostPageProps) => {
  const post = getPost(category, slug)

  return (
    <div className="flex flex-col gap-20">
      <PostHeader post={post} />
      <PostContentThumbnail post={post} />
      <div>
        <PostContent post={post} />
        <Giscus />
        <div className="fixed right-[calc((100dvw_-_800px)_/_2)] top-[10rem] hidden translate-x-[calc(100%_+_20px)] desktop:block">
          <PostTOC />
        </div>
      </div>
    </div>
  )
}

export default PostPage
