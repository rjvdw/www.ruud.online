'use strict'

const path = require('node:path')
const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite')
const { INPUT_DIR, OUTPUT_DIR, STATIC_DIR } = require('./util/constants')
const {
  linkProtection,
  minify,
  csp,
  linkRel,
} = require('./util/htmlPostProcessor')
const markdown = require('./util/md')

module.exports = (eleventyConfig) => {
  eleventyConfig.setLibrary('md', markdown)

  eleventyConfig.addPlugin(EleventyVitePlugin)

  eleventyConfig.addPassthroughCopy({ [STATIC_DIR]: '.' })
  eleventyConfig.addPassthroughCopy({
    [path.join(INPUT_DIR, 'css')]: 'css',
  })
  eleventyConfig.addPassthroughCopy({
    [path.join(INPUT_DIR, 'js')]: 'js',
  })

  eleventyConfig.setFrontMatterParsingOptions({
    delimiters: '//---',
  })

  eleventyConfig.setPugOptions({
    filters: {
      md(text, _options) {
        return markdown.render(text)
      },
    },
  })

  eleventyConfig.addTransform('link-rel', linkRel)
  eleventyConfig.addTransform('link-protection', linkProtection)
  eleventyConfig.addTransform('minify', minify)
  eleventyConfig.addTransform('csp', csp)

  return {
    dir: {
      input: INPUT_DIR,
      output: OUTPUT_DIR,
    },
  }
}
