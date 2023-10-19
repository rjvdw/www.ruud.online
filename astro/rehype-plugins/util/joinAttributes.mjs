/**
 * Join two sets of attributes.
 *
 * @param {string} v1 The first set of attributes to join.
 * @param {string} v2 The second set of attributes to join.
 * @param {string} separator The separator between values.
 * @returns {string} The joined set of attributes.
 */
export function joinAttributes(v1, v2, separator = ' ') {
  const attrs = new Set()

  for (const value of [v1, v2].filter(Boolean)) {
    for (const item of value.split(separator).filter(Boolean)) {
      attrs.add(item)
    }
  }

  return Array.from(attrs).join(separator)
}
