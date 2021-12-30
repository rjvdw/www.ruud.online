'use strict'

const metaDefault = require('./meta.json')
const openGraphDefaults = require('./open_graph.json')
const twitterDefaults = require('./twitter.json')

module.exports = {
  seo: data => {
    let meta = {}

    for (const [name, content] of Object.entries(metaDefault)) {
      meta[name] = { name, content }
    }
    for (const [ogProperty, content] of Object.entries(openGraphDefaults)) {
      let property = `og:${ ogProperty }`
      meta[property] = { property, content }
    }
    for (const [twName, content] of Object.entries(twitterDefaults)) {
      let name = `twitter:${ twName }`
      meta[name] = { name, content }
    }

    if (data.title) {
      meta['twitter:title'] = { name: 'twitter:title', content: data.title }
      meta['og:title'] = { property: 'og:title', content: data.title }
    }

    if (data.description) {
      meta['description'] = { name: 'description', content: data.description }
      meta['twitter:description'] = { name: 'twitter:description', content: data.description }
      meta['og:description'] = { property: 'og:description', content: data.description }
    }

    if (data.image) {
      meta['twitter:image'] = { name: 'twitter:image', content: data.image }
      meta['og:image'] = { property: 'og:image', content: data.image }
    }

    if (data.meta) {
      for (const [name, content] of Object.entries(data.meta)) {
        meta[name] = { name, content }
      }
    }

    if (data.open_graph) {
      for (const [ogProperty, content] of Object.entries(data.open_graph)) {
        let property = `og:${ ogProperty }`
        meta[property] = { property, content }
      }
    }

    if (data.twitter) {
      for (const [twName, content] of Object.entries(data.twitter)) {
        let name = `twitter:${ twName }`
        meta[name] = { name, content }
      }
    }

    meta = Object.values(meta)

    // for consistent output
    meta.sort((a, b) => (a.name || a.property).localeCompare(b.name || b.property))

    return { meta }
  }
}
