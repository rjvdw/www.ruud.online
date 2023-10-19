import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const { NODE_ENV } = process.env

  if (NODE_ENV === 'production') {
    return new Response('')
  } else {
    // prevent non-production site from being crawled
    return new Response('User-agent: *\nDisallow: /\n')
  }
}
