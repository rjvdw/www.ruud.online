'use strict'

const { INPUT_DIR, OUTPUT_DIR } = require('./util/constants')
const {linkProtection, minify, csp} = require('./util/htmlPostProcessor')
const markdown = require('./util/md')
const stylesheet = require('./util/stylesheet')

module.exports = (eleventyConfig) => {
  eleventyConfig.setLibrary('md', markdown)

  eleventyConfig.addPassthroughCopy({ 'public': '.' })
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' })

  eleventyConfig.setPugOptions({
    filters: {
      md(text, _options) {
        return markdown.render(text)
      },
      stylesheet(text, options) {
        return stylesheet(text, options)
      },
    },
  })

  eleventyConfig.addTransform('link-protection', linkProtection)
  eleventyConfig.addTransform('minify', minify)
  eleventyConfig.addTransform('csp', csp)

  return ({
    dir: {
      input: INPUT_DIR,
      output: OUTPUT_DIR,
    },
  })
}
