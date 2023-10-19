import { joinAttributes } from './util/joinAttributes.mjs'

/**
 * Allow additional attributes in links by adding a prefix to the link text.
 *
 * This can be used to set attributes in links when used in Markdown.
 * For example:
 *
 * ```markdown
 * Some text with [{rel=me}a link]{http://www.social/me} to a profile page.
 * ```
 *
 * This link will get the `rel="me"` attribute.
 */
export function customAttrs() {
  const process = (tree) => {
    if (tree.children) {
      if (tree.tagName === 'a') {
        // find the first text node
        const text = tree.children.find((node) => node.type === 'text')

        if (text) {
          // find a prefix in the form "{rel=me}"
          const match = text.value.match(/^\{rel=me\}/)
          if (match) {
            // strip the prefix from the value
            text.value = text.value.substring(match[0].length)

            // add properties
            tree.properties.rel = joinAttributes(tree.properties.rel, 'me')
          }
        }
      }

      for (const child of tree.children) {
        process(child)
      }
    }
  }

  return (tree) => {
    process(tree)
  }
}
