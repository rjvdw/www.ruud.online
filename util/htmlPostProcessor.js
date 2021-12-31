'use strict'

const crypto = require('crypto')
const cheerio = require('cheerio')
const htmlMinifier = require('html-minifier')
const fs = require('fs')
const path = require('path')
const { STATIC_DIR } = require('./constants')

const ALGO = 'sha256'

exports.linkProtection = function linkProtection(content) {
  if (!this.outputPath || !this.outputPath.endsWith('.html')) {
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

exports.minify = function minify(content) {
  if (!this.outputPath || !this.outputPath.endsWith('.html')) {
    return content
  }

  return htmlMinifier.minify(content, {
    collapseWhitespace: true,
  })
}

exports.csp = function csp(content) {
  if (!this.outputPath || !this.outputPath.endsWith('.html')) {
    return content
  }

  const cspHashes = {
    style: new Set(),
    script: new Set(),
  }
  const $ = cheerio.load(content)

  // compute csp hashes
  $('script:where(:not([type]), [type="text/javascript"]):not([src]), style')
    .each((_i, elem) => {
      const $elem = $(elem)
      const hash = `${ ALGO }-${ crypto.createHash(ALGO).update($elem.html()).digest('base64') }`
      console.debug('[csp hash][%s] %s', elem.tagName, hash)
      cspHashes[elem.tagName].add(hash)
    })

  const headers = new Set(fs
    .readFileSync(path.join(STATIC_DIR, '_headers'), { encoding: 'utf-8' })
    .split('\n')
    .filter(line => line.indexOf('Content-Security-Policy') !== -1)
    .map(line => line.replace(/^\s*Content-Security-Policy:\s*/, ''))
    .flatMap(line => line.split(/\s*;\s*/g))
    .flatMap(src => src.split(' '))
    .filter(entry => entry.startsWith(`'${ ALGO }-`))
    .map(hash => hash.substring(1, hash.length - 1)))

  // console.debug(`Hashes in the CSP: ${ Array.from(headers) }`)

  for (const hash of cspHashes.style) {
    if (!headers.has(hash)) {
      console.error(`[csp hash][style] ${ this.outputPath } has a stylesheet with hash ${ hash }, which does not appear in the CSP header.`)
    }
  }

  for (const hash of cspHashes.script) {
    if (!headers.has(hash)) {
      console.error(`[csp hash][script] ${ this.outputPath } has a script with hash ${ hash }, which does not appear in the CSP header.`)
    }
  }

  return content
}
