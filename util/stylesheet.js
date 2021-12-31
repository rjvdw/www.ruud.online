'use strict'

const fs = require('fs')
const path = require('path')
const sass = require('sass')

const attrs = require('./splatToHtmlAttrs')
const { INPUT_DIR, OUTPUT_DIR } = require('./constants')

const CSS_IN_DIR = path.join(__dirname, '..', INPUT_DIR)
const CSS_OUT_DIR = path.join(__dirname, '..', OUTPUT_DIR)

module.exports = (text, options) => {
  const { source, critical, async: loadAsync, syntax, filename: _filename, ...rest } = options
  if (source) {
    if (critical) {
      return renderCritical(source, rest)
    } else {
      return renderImport(source, loadAsync, rest)
    }
  } else {
    return renderInline(text, syntax || 'sass', rest)
  }
}

const sassOptions = {
  loadPaths: [CSS_IN_DIR],
  style: process.env.CONTEXT === 'production' ? 'compressed' : 'expanded',
}

const compile = file => sass.compile(file, {
  ...sassOptions,
}).css

const compileString = (data, syntax) => sass.compileString(data, {
  ...sassOptions,
  syntax: syntax === 'sass' ? 'indented' : syntax,
}).css

function renderImport(file, loadAsync, rest) {
  const inPath = path.join(CSS_IN_DIR, file)
  let outFile = file.replace(/\.s[ca]ss$/, '.css')
  const outPath = path.join(CSS_OUT_DIR, outFile)

  ensureOutDirExists(outPath)
  fs.writeFileSync(outPath, compile(inPath))

  if (loadAsync) {
    return `
      <link data-async-stylesheet="true" rel="preload" as="style" href="/${ outFile }"${ attrs(rest) }>
      <noscript><link rel="stylesheet" href="/${ outFile }"${ attrs(rest) }></noscript>
    `
  } else {
    return `<link rel="stylesheet" href="/${ outFile }"${ attrs(rest) }>`
  }
}

function renderCritical(file, rest) {
  const inPath = path.join(CSS_IN_DIR, file)
  return `<style${ attrs(rest) }>${ compile(inPath) }</style>`
}

function renderInline(data, syntax, rest) {
  return `<style${ attrs(rest) }>${ compileString(data, syntax) }</style>`
}

function ensureOutDirExists(outPath) {
  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
  } catch (err) {
    if (err.code === 'EEXIST') {
      // already exists -- noop
    } else {
      throw err
    }
  }
}
