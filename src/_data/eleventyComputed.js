'use strict'

module.exports = {
  seo: data => {
    const meta = []

    if (data.meta) {
      for (const [name, content] of Object.entries(data.meta)) {
        meta.push({ name, content })
      }
    }

    if (data.open_graph) {
      for (const [property, content] of Object.entries(data.open_graph)) {
        meta.push({ property: `og:${ property }`, content })
      }
    }

    if (data.twitter) {
      for (const [name, content] of Object.entries(data.twitter)) {
        meta.push({ name: `twitter:${ name }`, content })
      }
    }

    if (data.title) {
      meta.push({ name: 'twitter:title', content: data.title })
      meta.push({ property: 'og:title', content: data.title })
    }

    if (data.description) {
      meta.push({ name: 'description', content: data.description })
      meta.push({ name: 'twitter:description', content: data.description })
      meta.push({ property: 'og:description', content: data.description })
    }

    if (data.image) {
      meta.push({ name: 'image', content: data.image })
      meta.push({ name: 'twitter:image', content: data.image })
      meta.push({ property: 'og:image', content: data.image })
    }

    // for consistent output
    meta.sort((a, b) => (a.name || a.property).localeCompare(b.name || b.property))

    return { meta }
  }
}
