'use client'

import { motion } from 'framer-motion'
import React from 'react'

import { cn } from '@/utils/cn'

import useTOC from './useTOC'

export const PostTOC = () => {
  const { currentHeader, headingEls } = useTOC()

  const [, ...headingElements] = headingEls

  return (
    <nav className="w-toc">
      <motion.ul
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2"
      >
        {headingElements.map((head, idx) => (
          <motion.li
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: {
                opacity: 1,
                x: Number(head.nodeName.split('')[1]) * 15 - 15,
                transition: {
                  delay: idx * 0.05,
                },
              },
            }}
            key={head.id}
            className={cn(
              `text-gray-500 ${head.nodeName}-header transform-all duration-200`,
              currentHeader === head.id && 'font-bold italic text-black',
            )}
          >
            <a href={`#${head.id}`}>{head.textContent}</a>
          </motion.li>
        ))}
      </motion.ul>
    </nav>
  )
}
