'use strict'

const fs = require('fs')
const path = require('path')
const sass = require('sass')

const { INPUT_DIR, OUTPUT_DIR } = require('./constants')

const CSS_IN_DIR = path.join(__dirname, '..', INPUT_DIR)
const CSS_OUT_DIR = path.join(__dirname, '..', OUTPUT_DIR)

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

exports.renderImport = (file) => {
  const inPath = path.join(CSS_IN_DIR, file)
  let outFile = file.replace(/\.s[ca]ss$/, '.css')
  const outPath = path.join(CSS_OUT_DIR, outFile)

  ensureOutDirExists(outPath)
  fs.writeFileSync(outPath, compile(inPath))

  return `<link rel="stylesheet" href="/${ outFile }">`
}

exports.renderCritical = (file) => {
  const inPath = path.join(CSS_IN_DIR, file)
  return `<style>${ compile(inPath) }</style>`
}

exports.renderInline = (data, syntax) => `<style>${ compileString(data, syntax) }</style>`

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
