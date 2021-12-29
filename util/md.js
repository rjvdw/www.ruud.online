'use strict'

const markdownIt = require('markdown-it')
const markdownItLinkAttributes = require('markdown-it-link-attributes')

const markdown = markdownIt()
markdown.use(markdownItLinkAttributes, {
  matcher(href, _config) {
    return href.startsWith('http:') || href.startsWith('https:')
  },
  attrs: {
    target: '_blank',
    rel: 'noopener noreferrer',
  },
})

module.exports = markdown
