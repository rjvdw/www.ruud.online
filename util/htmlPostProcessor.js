'use strict'

const cheerio = require('cheerio')
const htmlMinifier = require('html-minifier')

module.exports = (content, outputPath) => {
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

  return htmlMinifier.minify($.html(), {
    collapseWhitespace: true,
  })
}
