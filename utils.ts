import { Env } from '@/types'

// Note: `PagesFunction` is a type from Cloudflare Workers that runs on the server (Edge),
// it does not run in the browser where your React app (and api.ts) runs.
export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.env.VITE_API_URL === 'development') {
    return new Response('This is a local environment!')
  } else {
    return new Response('This is a live environment')
  }
}
