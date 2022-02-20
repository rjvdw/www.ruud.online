'use strict'

const fs = require('fs/promises')

async function loadPage(path) {
  const page = await fs.readFile(path, { encoding: 'utf8' })

  return page
}
exports.loadPage = loadPage
