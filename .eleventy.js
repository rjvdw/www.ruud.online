'use strict'

const cheerio = require('cheerio')
const htmlmin = require("html-minifier")

const { INPUT_DIR, OUTPUT_DIR } = require('./util/constants')
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
    globals: ['md', 'stylesheet'],
  })

  eleventyConfig.addTransform('html-post-processing', (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith('.html')) {
      return content
    }

    const $ = cheerio.load(content)

    // add link protection to all external links
    $('a[href^="http:"], a[href^="https:"]')
      .attr('target', '_blank')
      .each((_i, elem) => {
        const a = $(elem)
        const rel = (a.attr('rel') || '').split(' ')

        if (rel.indexOf('noopener') === -1)
          rel.push('noopener')

        if (rel.indexOf('noreferrer') === -1)
          rel.push('noreferrer')

        a.attr('rel', rel.join(' '))
      })

    return htmlmin.minify($.html(), {
      collapseWhitespace: true,
    })
  })

  return ({
    dir: {
      input: INPUT_DIR,
      output: OUTPUT_DIR,
    },
  })
}
