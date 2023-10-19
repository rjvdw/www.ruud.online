import { defineConfig } from 'astro/config'
import { customAttrs } from './astro/rehype-plugins/customAttrs.mjs'
import { externalLinks } from './astro/rehype-plugins/externalLinks.mjs'

// https://astro.build/config
export default defineConfig({
  markdown: {
    rehypePlugins: [customAttrs, externalLinks],
  },
})
