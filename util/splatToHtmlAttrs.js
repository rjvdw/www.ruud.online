'use strict'

module.exports = (splat) => {
	if (!splat) return ''

	const attrs = []
	for (const [value, key] of Object.entries(splat)) {
		attrs.push(`${key}="${value}"`)
	}
	if (attrs.length) {
		attrs.sort()
		return ' ' + attrs.join(' ')
	} else {
		return ''
	}
}
