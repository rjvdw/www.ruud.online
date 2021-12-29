'use strict'

const { INPUT_DIR, OUTPUT_DIR } = require('./util/constants')
global.md = require('./util/md')
global.stylesheet = require('./util/stylesheet')

module.exports = (eleventyConfig) => {
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
