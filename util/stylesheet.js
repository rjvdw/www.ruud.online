'use strict'

const fs = require('fs')
const path = require('path')
const sass = require('sass')

const { INPUT_DIR, OUTPUT_DIR } = require('./constants')

const CSS_IN_DIR = path.join(__dirname, '..', INPUT_DIR)
const CSS_OUT_DIR = path.join(__dirname, '..', OUTPUT_DIR)

function stylesheet(file) {
  const inPath = path.join(CSS_IN_DIR, file)
  let outFile = file.replace(/\.s[ca]ss$/, '.css')
  const outPath = path.join(CSS_OUT_DIR, outFile)

  const compiled = sass.compile(inPath, {
    loadPaths: [CSS_IN_DIR],
  })
  ensureOutDirExists(outPath)
  fs.writeFileSync(outPath, compiled.css)

  return `<link rel="stylesheet" href="/${ outFile }">`
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

module.exports = stylesheet
