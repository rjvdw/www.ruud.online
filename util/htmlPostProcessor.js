'use strict'

const crypto = require('crypto')
const cheerio = require('cheerio')
const htmlMinifier = require('html-minifier')

exports.linkProtection = (content, outputPath) => {
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

  return $.html()
}

exports.minify = (content, outputPath) => {
  if (!outputPath || !outputPath.endsWith('.html')) {
    return content
  }

  return htmlMinifier.minify(content, {
    collapseWhitespace: true,
  })
}

exports.csp = (content, outputPath) => {
  if (!outputPath || !outputPath.endsWith('.html')) {
    return content
  }

  const $ = cheerio.load(content)

  // compute csp hashes
  $('script:where(:not([type]), [type="text/javascript"]):not([src]), style')
    .each((_i, elem) => {
      const $elem = $(elem)
      const hash = `sha256-${ crypto.createHash('sha256').update($elem.html()).digest('base64') }`
      console.log('[csp hash][%s] %s', elem.tagName, hash)
    })

  return content
}
