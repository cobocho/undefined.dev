'use client'

import { motion } from 'framer-motion'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Post } from '@/interfaces/post'
import { generatePostLayoutId } from '@/utils/motion'

import { PostTags } from '../PostTags/PostTags'

import { PostItemThumbnail } from './PostItemThumbnail'

interface PostItemProps {
  post: Post
}

export const PostItem = ({ post }: PostItemProps) => {
  const router = useRouter()

  return (
    <Link
      className="group flex h-[160px] w-full cursor-pointer gap-4 mobile:h-fit mobile:flex-col"
      href={`/post/${post.category}/${post.slug}`}
    >
      <PostItemThumbnail post={post} />
      <div className="flex w-full flex-1 flex-col justify-between py-6 mobile:py-2">
        <div className="mb-4 flex flex-col gap-2 border-b-[1px] border-border pb-4">
          <motion.button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              router.push(`/category/${post.category}/1`)
            }}
            layoutId={generatePostLayoutId('category', post)}
            className="w-fit text-sm font-bold opacity-60 transition-opacity hover:opacity-100"
          >
            {post.category}
          </motion.button>
          <motion.h2
            className="text-xl font-bold transition-colors group-hover:text-outline/60"
            layoutId={generatePostLayoutId('title', post)}
          >
            {post.title}
          </motion.h2>
          <motion.p
            layoutId={generatePostLayoutId('description', post)}
            className="font-regular italic text-outline opacity-80"
          >
            {post.description}
          </motion.p>
        </div>
        <PostTags tags={post.tags} />
      </div>
    </Link>
  )
}
