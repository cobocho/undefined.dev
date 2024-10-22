'use client'

import { motion } from 'framer-motion'
import React from 'react'
import Link from 'next/link'

import { generatePostLayoutId } from '@/utils/motion'
import { Snippet } from '@/interfaces/snippet'
import { formatter } from '@/utils/date'

interface SnippetItemProps {
  snippet: Snippet
}

export const SnippetItem = ({ snippet }: SnippetItemProps) => {
  const { month, day, year } = formatter(snippet.date)

  return (
    <Link
      className="group flex w-full cursor-pointer items-center gap-4 py-2 mobile:h-fit mobile:flex-col"
      href={`/snippet/post/${snippet.category}/${snippet.slug}`}
    >
      <strong className="text-bold text-4xl italic">{snippet.idx}</strong>
      <div className="flex w-full flex-1 flex-col justify-between mobile:py-2">
        <div className="flex justify-between border-b-[1px] border-border pb-1">
          <motion.h2
            className="text-xl font-bold transition-colors group-hover:text-outline/60"
            layoutId={generatePostLayoutId('title', snippet)}
          >
            {snippet.title}
          </motion.h2>
          <p className="text-text/60 text-sm">{`${month} ${day}, ${year}`}</p>
        </div>
      </div>
    </Link>
  )
}
