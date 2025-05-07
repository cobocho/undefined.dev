/* eslint-disable no-useless-escape */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
  useState,
} from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/utils/cn'
import { Icon } from '@/components/ui/Icon'
import { AppearTop } from '@/components/motion/AppearTop'

const MenuContext = createContext<{
  isOpen: boolean
  toggleIsOpen: () => void
}>({
  isOpen: false,
  toggleIsOpen: () => {},
})

export const GlobalMenuProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleIsOpen = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <MenuContext.Provider
      value={{
        isOpen,
        toggleIsOpen,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

const useGlobalMenu = () => {
  const { isOpen, toggleIsOpen } = useContext(MenuContext)

  return { isOpen, toggleIsOpen }
}

interface GlobalMenuItemProps extends PropsWithChildren {
  href: string
  isPanelItem?: boolean
  matcher?: RegExp | RegExp[]
}

const GlobalMenuItem = ({
  children,
  href,
  isPanelItem = false,
  matcher,
}: GlobalMenuItemProps) => {
  const pathname = usePathname()

  const { toggleIsOpen } = useGlobalMenu()

  const onClickMenuItem = () => {
    setTimeout(toggleIsOpen, 200)
  }

  const isMatched = matcher
    ? Array.isArray(matcher)
      ? matcher.some((pattern) => pattern.test(pathname))
      : matcher.test(pathname)
    : false

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="relative px-6 py-1 mobile:text-center"
    >
      {isMatched && (
        <motion.div
          layoutId={isPanelItem ? 'active-menu-panel' : 'active-menu'}
          className="absolute left-0 top-0 h-full w-full rounded-full bg-white"
        />
      )}
      <Link
        href={href}
        className={cn(
          'font-regular group relative w-full text-center text-white transition-all delay-[50] mobile:text-2xl',
          isMatched && 'font-bold italic text-black',
        )}
        onClick={onClickMenuItem}
      >
        {children}
        <div
          className={cn(
            'h-[1px] w-full scale-x-0 bg-white transition-transform group-hover:scale-x-150 mobile:group-hover:scale-x-0',
          )}
        />
      </Link>
    </motion.div>
  )
}

interface GlobalMenuProps {
  isPanel?: boolean
}

const homePattern = /^\/$/

const postPatterns = [
  /^\/\d+$/, // /1, /2, etc.
  /^\/category\/[\w\-\.\~]+\/\d+$/, // /category/tech-123/1, /category/life_abc/1, etc.
  /^\/post\/[\w\-\.\~]+\/[\w\-\.\~]+$/, // /post/tech-123/refactoring_abc, etc.
]

const tagsPattern = /^\/tags(\/[\w\-\.\~_!@#\$%\^&\*\(\)\+=]+\/\d+)?$/

const snippetPattern = /^\/snippet(\/[\w\-\.\~_!@#\$%\^&\*\(\)\+=]+)?$/

const profilePattern = /^\/profile$/

export const GlobalMenu = ({ isPanel = false }: GlobalMenuProps) => {
  return (
    <AppearTop>
      <motion.nav
        variants={{
          hidden: { y: 20 },
          visible: {
            y: 0,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="visible"
        className="flex gap-10 rounded-full border-[1px] border-[#dfdfdf] bg-outline p-1 mobile:flex-col mobile:gap-6 mobile:rounded-3xl mobile:p-4"
      >
        <GlobalMenuItem isPanelItem={isPanel} href="/" matcher={homePattern}>
          Home
        </GlobalMenuItem>
        <GlobalMenuItem isPanelItem={isPanel} href="/1" matcher={postPatterns}>
          Posts
        </GlobalMenuItem>
        <GlobalMenuItem
          isPanelItem={isPanel}
          href="/snippet/category"
          matcher={snippetPattern}
        >
          Snippet
        </GlobalMenuItem>
        <GlobalMenuItem
          isPanelItem={isPanel}
          href="/tags"
          matcher={tagsPattern}
        >
          Tags
        </GlobalMenuItem>
        <GlobalMenuItem
          isPanelItem={isPanel}
          href="/profile"
          matcher={profilePattern}
        >
          Profile
        </GlobalMenuItem>
      </motion.nav>
    </AppearTop>
  )
}

export const GlobalMenuPanel = () => {
  const [isOpen, toggleIsOpen] = useReducer((prev) => !prev, false)

  return (
    <MenuContext.Provider
      value={{
        isOpen,
        toggleIsOpen,
      }}
    >
      <div className="fixed z-50 desktop:hidden tablet:hidden">
        <div
          className={cn(
            'fixed right-0 top-0 h-dvh w-dvw translate-x-full bg-outline p-6 pt-20 transition-transform duration-700',
            isOpen && 'translate-x-0',
          )}
        >
          <GlobalMenu isPanel />
        </div>
        <button
          className="fixed right-[22px] top-[22px] flex h-10 w-10 items-center justify-center rounded-full bg-outline text-white"
          onClick={toggleIsOpen}
        >
          {isOpen ? (
            <Icon name="close" className="fill-white" width={24} height={24} />
          ) : (
            <Icon name="menu" className="fill-white" width={24} height={24} />
          )}
        </button>
      </div>
    </MenuContext.Provider>
  )
}
