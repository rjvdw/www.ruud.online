'use strict'

const { INPUT_DIR, OUTPUT_DIR } = require('./util/constants')
const htmlPostProcessor = require('./util/htmlPostProcessor')
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

  eleventyConfig.addTransform('html-post-processing', htmlPostProcessor)

  return ({
    dir: {
      input: INPUT_DIR,
      output: OUTPUT_DIR,
    },
  })
}
