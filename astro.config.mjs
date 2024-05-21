import { defineConfig } from 'astro/config'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { customAttrs } from './astro/rehype-plugins/customAttrs.mjs'
import { externalLinks } from './astro/rehype-plugins/externalLinks.mjs'

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      customAttrs,
      externalLinks,
      [rehypeKatex, { output: 'mathml' }],
    ],
  },
})
