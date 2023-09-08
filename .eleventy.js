'use strict'

const path = require('node:path')
const { INPUT_DIR, OUTPUT_DIR, STATIC_DIR } = require('./util/constants')
const {
  linkProtection,
  minify,
  csp,
  linkRel,
} = require('./util/htmlPostProcessor')
const markdown = require('./util/md')
const {
  stylesheet,
  compileAllStylesheets,
  stylesheetWatcher,
} = require('./util/stylesheet')

// Compile all the stylesheets.
compileAllStylesheets().catch((err) => console.error(err))

module.exports = (eleventyConfig) => {
  eleventyConfig.setLibrary('md', markdown)

  eleventyConfig.addPassthroughCopy({ [STATIC_DIR]: '.' })
  eleventyConfig.addPassthroughCopy({ [path.join(INPUT_DIR, 'js')]: 'js' })

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

  eleventyConfig.addTransform('link-rel', linkRel)
  eleventyConfig.addTransform('link-protection', linkProtection)
  eleventyConfig.addTransform('minify', minify)
  eleventyConfig.addTransform('csp', csp)

  eleventyConfig.setBrowserSyncConfig({
    files: path.join(__dirname, OUTPUT_DIR, 'css', '**', '*.css'),
    callbacks: {
      ready() {
        // start watching for changes in the stylesheets
        stylesheetWatcher.start()
      },
    },
  })

  return {
    dir: {
      input: INPUT_DIR,
      output: OUTPUT_DIR,
    },
  }
}
