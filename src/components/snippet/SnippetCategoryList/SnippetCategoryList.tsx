'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { Category } from '@/interfaces/post'

interface SnippetCategoryListProps {
  categories: Category[]
}

const MotionLink = motion.create(Link)

export const SnippetCategoryList = ({
  categories,
}: SnippetCategoryListProps) => {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-3 gap-4"
    >
      {categories.map((category) => (
        <MotionLink
          key={category.name}
          href={`/snippet/category/${category.name}/1`}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{
            translateY: -5,
            translateX: 5,
            fontWeight: 'medium',
          }}
          className="font-regular rounded-lg bg-gray-400/20 px-4 py-3 backdrop-blur-md transition duration-300 hover:shadow-xl"
        >
          / {category.name}
        </MotionLink>
      ))}
    </motion.div>
  )
}
