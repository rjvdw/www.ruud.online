import { joinAttributes } from './util/joinAttributes.mjs'

/**
 * Add attributes to external links such as rel="noreferrer noopener" and target="_blank".
 */
export function externalLinks() {
  const isExternalLink = (node) => {
    const href = node.properties.href
    return href && (href.startsWith('http:') || href.startsWith('https:'))
  }

  const process = (tree) => {
    if (tree.tagName === 'a' && isExternalLink(tree)) {
      if (!('target' in tree.properties)) {
        tree.properties.target = '_blank'
      }

      tree.properties.rel = joinAttributes(
        tree.properties.rel,
        'noreferrer noopener',
      )
    }

    if (tree.children) {
      for (const child of tree.children) {
        process(child)
      }
    }
  }

  return (tree) => {
    process(tree)
  }
}
