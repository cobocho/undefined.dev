'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

import { Post } from '@/interfaces/post'
import { generatePostLayoutId } from '@/utils/motion'

interface PostItemThumbnailProps {
  post: Post
}

const MotionImage = motion.create(Image)

export const PostItemThumbnail = ({ post }: PostItemThumbnailProps) => {
  const dateObj = new Date(post.date)
  const month = dateObj.toLocaleString('en-US', { month: 'long' })
  const day = String(dateObj.getDate()).padStart(2, '0')
  const year = dateObj.getFullYear()

  return (
    <motion.div
      className="relative block aspect-[4/3] h-full overflow-hidden rounded-2xl mobile:h-[200px]"
      layoutId={generatePostLayoutId('thumbnail', post)}
    >
      <MotionImage
        fill
        sizes="100%"
        alt={post.title}
        src={post.thumbnail}
        className="object-cover transition-transform duration-500 group-hover:scale-125"
      />
      <div className="absolute left-0 top-0 flex h-full w-full -translate-x-full flex-col justify-center gap-2 bg-outline/80 px-[20%] transition-transform duration-500 group-hover:translate-x-0">
        <div className="flex flex-col items-center">
          <p className="translate-y-4 text-4xl font-semibold italic text-white opacity-0 transition-all delay-700 duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {month}
          </p>
          <p className="font-regular translate-y-4 text-3xl text-white opacity-0 transition-all delay-500 duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {day}
          </p>
        </div>
        <div className="h-[1px] w-full origin-left scale-x-0 bg-white transition-transform delay-200 duration-500 group-hover:scale-x-100" />
        <p className="translate-y-4 text-center font-bold text-white opacity-0 transition-all delay-500 duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {year}
        </p>
      </div>
    </motion.div>
  )
}
