'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { useRouter } from 'next/navigation'

import { Post } from '@/interfaces/post'
import { AppearBottom } from '@/components/motion/AppearBottom'
import { generatePostLayoutId } from '@/utils/motion'

interface CarouselProps {
  posts: Post[]
}

const MotionImage = motion.create(Image)

export const Carousel = ({ posts }: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
    },
    [
      Autoplay({
        playOnInit: true,
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  )
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  const router = useRouter()

  const onClickSlideItem = useCallback(
    (idx: number) => {
      if (idx === currentIndex) {
        const post = posts[idx]
        router.push(`/post/${post.category}/${post.slug}`)
        return
      }

      if (emblaApi) {
        emblaApi.scrollTo(idx)
      }
    },
    [currentIndex, emblaApi, posts, router],
  )

  return (
    <AppearBottom>
      <section className="embla relative scrollbar-hide">
        <div className="embla__viewport relative scrollbar-hide" ref={emblaRef}>
          <div className="embla__container scrollbar-hide">
            {posts.map((post, idx) => (
              <div className="embla__slide" key={post.title}>
                <AppearBottom className="h-[400px] w-full" delay={0.5}>
                  <motion.div
                    variants={{
                      rest: { scaleY: 0.8, scaleX: 0.85, opacity: 0.6 },
                      current: {
                        scaleY: 0.96,
                        scaleX: 0.96,
                        opacity: 1,
                        transition: {
                          stiffness: 0,
                        },
                      },
                    }}
                    onClick={() => onClickSlideItem(idx)}
                    initial="rest"
                    className="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl border-outline shadow-md mobile:shadow-sm"
                    animate={idx === currentIndex ? 'current' : 'rest'}
                  >
                    <MotionImage
                      fill
                      layoutId={generatePostLayoutId('thumbnail', post)}
                      src={post.thumbnail}
                      className="pointer-events-none select-none object-cover"
                      alt={post.title}
                    />
                    {idx === currentIndex && (
                      <div className="absolute left-0 top-0 h-full w-full flex-col bg-[#00000000] transition-colors group-hover:bg-[#000000cb]">
                        <div className="flex flex-col p-10 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex flex-col items-end gap-3">
                            <h2 className="text-balance text-end text-2xl font-semibold text-white">
                              {post.title}
                            </h2>
                            <p className="text-end text-white">
                              {post.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AppearBottom>
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute left-0 top-0 h-full w-[5%] bg-gradient-to-r from-white to-transparent mobile:hidden" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-[5%] bg-gradient-to-l from-white to-transparent mobile:hidden" />
      </section>
    </AppearBottom>
  )
}
