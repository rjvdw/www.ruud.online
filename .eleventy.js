'use strict'

const { INPUT_DIR, OUTPUT_DIR } = require('./util/constants')
const markdown = require('./util/md')
const stylesheet = require('./util/stylesheet')

global.md = text => markdown.render(text)
global.stylesheet = stylesheet

module.exports = (eleventyConfig) => {
  eleventyConfig.setLibrary('md', markdown)

  eleventyConfig.addPassthroughCopy({
    public: '.',
  })

  eleventyConfig.setPugOptions({
    filters: {
      md(text, _options) {
        return md(text)
      }
    },
    globals: ['md', 'stylesheet'],
  })

  return ({
    dir: {
      input: INPUT_DIR,
      output: OUTPUT_DIR,
    },
  })
}
