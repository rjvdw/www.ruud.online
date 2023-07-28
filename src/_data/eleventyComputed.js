'use strict'

const metaDefault = require('./meta.json')
const openGraphDefaults = require('./open_graph.json')

module.exports = {
	seo: (data) => {
		let meta = {}

		for (const [name, content] of Object.entries(metaDefault)) {
			if (typeof content === 'string') {
				meta[name] = { name, content }
			} else {
				meta[name] = { name, ...content }
			}
		}
		for (const [ogProperty, content] of Object.entries(openGraphDefaults)) {
			const property = `og:${ogProperty}`
			meta[property] = { property, content }
		}

		if (data.title) {
			meta['og:title'] = { property: 'og:title', content: data.title }
		}

		if (data.description) {
			meta['description'] = { name: 'description', content: data.description }
			meta['og:description'] = {
				property: 'og:description',
				content: data.description,
			}
		}

		if (data.image) {
			meta['og:image'] = { property: 'og:image', content: data.image }
		}

		if (data.meta) {
			for (const [name, content] of Object.entries(data.meta)) {
				if (typeof content === 'string') {
					meta[name] = { name, content }
				} else {
					meta[name] = { name, ...content }
				}
			}
		}

		if (data.open_graph) {
			for (const [ogProperty, content] of Object.entries(data.open_graph)) {
				const property = `og:${ogProperty}`
				meta[property] = { property, content }
			}
		}

		meta = Object.values(meta)

		// for consistent output
		meta.sort((a, b) =>
			(a.name || a.property).localeCompare(b.name || b.property),
		)

		return { meta }
	},
}
