import { PropsWithChildren } from 'react'
import Link from 'next/link'

import { AppearLeft } from '@/components/motion/AppearLeft'

import { GlobalMenu } from '../GlobalMenu'
import { GlobalMenuPanel } from '../GlobalMenu/GlobalMenu'

interface OutLineMenuProps extends PropsWithChildren {}

export const OutLineMenu = ({ children }: OutLineMenuProps) => {
  return (
    <div className="relative h-dvh w-dvw bg-outline">
      <div className="absolute left-6 top-6 z-10 translate-x-[-1px] translate-y-[-1px] rounded-br-3xl bg-outline mobile:left-4 mobile:top-4 mobile:rounded-br-2xl">
        <div
          className="absolute left-full h-6 w-6 translate-x-[-1px] translate-y-[-1px] bg-outline mobile:-right-6 mobile:h-6 mobile:w-6"
          style={{
            mask: 'radial-gradient(24px at 100% 100%, #0000 98%, #000)',
          }}
        />
        <div
          className="absolute top-full h-6 w-6 translate-x-[-1px] translate-y-[-1px] bg-outline mobile:h-6 mobile:w-6"
          style={{
            mask: 'radial-gradient(24px at 100% 100%, #0000 98%, #000)',
          }}
        />
        <div className="flex">
          <Link href="/">
            <AppearLeft className="flex select-none items-end gap-1 p-2 pb-4 pr-4 text-5xl font-[800] italic text-white mobile:p-1 mobile:pb-2 mobile:pr-2 mobile:pt-0 mobile:text-xl">
              undefined<p className="font-regular text-lg not-italic">.dev</p>
            </AppearLeft>
          </Link>
          <div className="absolute left-full ml-10 flex h-full items-center justify-center mobile:ml-2 mobile:hidden">
            <GlobalMenu />
          </div>
        </div>
      </div>
      <div className="absolute h-full w-full overflow-hidden p-6 mobile:p-4">
        <div className="mobile:rounded-x3 h-full w-full overflow-hidden rounded-3xl bg-white pr-2 mobile:pr-1">
          <div
            id="content-wrapper"
            className="h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar]:w-1"
          >
            {children}
          </div>
        </div>
      </div>
      <GlobalMenuPanel />
    </div>
  )
}
