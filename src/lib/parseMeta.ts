import defaultMeta from '../data/meta.json'
import defaultOpenGraph from '../data/open-graph.json'
import type { MetaData } from './types'

type MetaTag = {
  name: string
  content: string
}

type OpenGraphTag = {
  property: string
  content: string
}

type MetaTags = (MetaTag | OpenGraphTag)[]

export function parseMeta(data?: MetaData): MetaTags {
  const dict: Record<string, MetaTag | OpenGraphTag> = {}

  for (const [name, content] of Object.entries(defaultMeta)) {
    dict[name] = { name, content }
  }

  for (const [property, content] of Object.entries(defaultOpenGraph)) {
    dict[property] = { property, content }
  }

  if (data?.title) {
    dict['og:title'] = { property: 'og:title', content: data.title }
  }

  if (data?.description) {
    dict.description = { name: 'description', content: data.description }
    dict['og:description'] = {
      property: 'og:description',
      content: data.description,
    }
  }

  if (data?.image) {
    dict['og:image'] = { property: 'og:image', content: data.image }
  }

  if (data?.meta) {
    for (const [name, content] of Object.entries(data.meta)) {
      dict[name] = { name, content }
    }
  }

  if (data?.openGraph) {
    for (const [property, content] of Object.entries(data.openGraph)) {
      dict[property] = { property, content }
    }
  }

  const list: MetaTags = Object.values(dict)

  // normalize order for consistent output
  list.sort((a, b) => getKey(a).localeCompare(getKey(b)))

  return list
}

function getKey(tag: MetaTag | OpenGraphTag): string {
  if ('name' in tag) return tag.name
  return tag.property
}
