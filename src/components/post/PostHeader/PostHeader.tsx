'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { Post } from '@/interfaces/post'
import { generatePostLayoutId } from '@/utils/motion'
import { AppearBottom } from '@/components/motion/AppearBottom'
import { formatter } from '@/utils/date'
import { Snippet } from '@/interfaces/snippet'

interface PostHeaderProps {
  post: Post | Snippet
  isSnippet?: boolean
}

export const PostHeader = ({ post, isSnippet = false }: PostHeaderProps) => {
  const { year, month, day } = formatter(post.date)

  return (
    <AppearBottom className="flex w-full flex-col items-center gap-4 border-b-[1px] border-gray-300 pb-10">
      <div className="flex items-center gap-4">
        <Link
          href={`${isSnippet ? '/snippet' : ''}/category/${post.category}/1`}
        >
          <motion.p
            layoutId={generatePostLayoutId('category', post)}
            className="text-lg font-bold italic text-outline/50 transition-colors hover:text-outline"
          >
            {post.category}
          </motion.p>
        </Link>
      </div>
      <motion.h1
        className="mx-[5%] break-keep text-center text-5xl font-medium leading-[120%] mobile:text-4xl"
        layoutId={generatePostLayoutId('title', post)}
      >
        {post.title}
      </motion.h1>
      <div className="rounded-full bg-outline px-4 py-1 text-sm font-bold text-white">
        {`${month} ${day}, ${year}`}
      </div>
      {post.description && (
        <motion.p
          className="break-keep text-center text-xl leading-[120%] text-gray-400"
          layoutId={generatePostLayoutId('description', post)}
        >
          {post.description}
        </motion.p>
      )}
    </AppearBottom>
  )
}
