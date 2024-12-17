import { getAllPosts } from '@/apis/posts'
import { HOST } from '@/constants/domain'
import { Post } from '@/interfaces/post'

function generatePostSitemap(post: Post) {
  const images = Object.values(post.images).map((image) => {
    return `<image:image><image:loc>${HOST}${image.src}</image:loc></image:image>`
  })

  return `<url>
    <loc>${HOST}/post/${post.category}/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <priority>${0.9}</priority>
    ${images.join('\n')}
  </url>`
}

export const dynamic = 'force-static'

export function GET() {
  const posts = getAllPosts()

  const xml = /* XML */ `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${posts.map((post) => generatePostSitemap(post)).join('\n')}
    </urlset>
  `

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
