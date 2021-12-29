'use strict'

const marked = require('marked')

function md(text) {
  return marked.parse(text)
}

module.exports = md
