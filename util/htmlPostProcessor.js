'use strict'

const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const cheerio = require('cheerio')
const htmlMinifier = require('html-minifier')
const { STATIC_DIR } = require('./constants')

const ALGO = 'sha256'

/**
 * Finds all links that have a marker '{rel=".*?"}', and removes this marker while adding the relation "me" to the link.
 */
exports.linkRel = function linkRel(content) {
  if (!this.outputPath || !this.outputPath.endsWith('.html')) {
    return content
  }

  const $ = cheerio.load(content)
  const marker = /\{rel="(.*?)"}/

  $('a')
    .filter((_i, elem) => marker.test($(elem).text()))
    .each((_i, elem) => {
      const a = $(elem)
      let match
      while ((match = a.text().match(marker)) !== null) {
        addAttrValues(a, 'rel', match[1])
        a.html(a.html().replace(marker, ''))
      }
    })

  return $.html()
}

/**
 * Adds attributes to external links to make them safe.
 *
 * * Adds target=_blank
 * * Adds noopener
 * * Adds noreferrer
 */
exports.linkProtection = function linkProtection(content) {
  if (!this.outputPath || !this.outputPath.endsWith('.html')) {
    return content
  }

  const $ = cheerio.load(content)

  $('a[href^="http:"], a[href^="https:"]')
    .attr('target', '_blank')
    .each((_i, elem) => {
      addAttrValues($(elem), 'rel', ['noopener', 'noreferrer'])
    })

  return $.html()
}

/**
 * Minifies the output HTML.
 */
exports.minify = function minify(content) {
  if (!this.outputPath || !this.outputPath.endsWith('.html')) {
    return content
  }

  return htmlMinifier.minify(content, {
    collapseWhitespace: true,
  })
}

/**
 * Computes all relevant information for the Content-Security-Policy.
 */
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
  $(
    'script:where(:not([type]), [type="text/javascript"]):not([src]), style',
  ).each((_i, elem) => {
    const $elem = $(elem)
    const hash = `${ALGO}-${crypto
      .createHash(ALGO)
      .update($elem.html())
      .digest('base64')}`
    console.debug('[csp hash][%s] %s', elem.tagName, hash)
    cspHashes[elem.tagName].add(hash)
  })

  const headers = new Set(
    fs
      .readFileSync(path.join(STATIC_DIR, '_headers'), { encoding: 'utf-8' })
      .split('\n')
      .filter((line) => line.indexOf('Content-Security-Policy') !== -1)
      .map((line) => line.replace(/^\s*Content-Security-Policy:\s*/, ''))
      .flatMap((line) => line.split(/\s*;\s*/g))
      .flatMap((src) => src.split(' '))
      .filter((entry) => entry.startsWith(`'${ALGO}-`))
      .map((hash) => hash.substring(1, hash.length - 1)),
  )

  // console.debug(`Hashes in the CSP: ${ Array.from(headers) }`)

  for (const hash of cspHashes.style) {
    if (!headers.has(hash)) {
      console.error(
        `[csp hash][style] ${this.outputPath} has a stylesheet with hash ${hash}, which does not appear in the CSP header.`,
      )
    }
  }

  for (const hash of cspHashes.script) {
    if (!headers.has(hash)) {
      console.error(
        `[csp hash][script] ${this.outputPath} has a script with hash ${hash}, which does not appear in the CSP header.`,
      )
    }
  }

  return content
}

/**
 * Adds additional values to an attribute, taking care to not add it more than once.
 *
 * @param {any}             el        The element to which the additional values should be added.
 * @param {string}          attr      The attribute which should receive the additional values.
 * @param {string|string[]} values    The additional values to add.
 * @param {string}          separator
 */
function addAttrValues(el, attr, values, separator = ' ') {
  const current = (el.attr(attr) || '').split(separator).filter(Boolean)

  const list = Array.isArray(values)
    ? values
    : values.split(separator).filter(Boolean)

  for (const value of list) {
    if (current.indexOf(value) === -1) {
      current.push(value)
    }
  }

  el.attr(attr, current.join(separator))
}
