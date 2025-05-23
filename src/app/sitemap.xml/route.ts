import { HOST } from '@/constants/domain'

export const revalidate = 3600

export function GET() {
  const xml = /* XML */ `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>${HOST}/sitemap-post.xml</loc>
      </sitemap>
    </sitemapindex>
  `

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
