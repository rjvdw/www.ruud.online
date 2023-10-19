export type MetaData = {
  title?: string
  description?: string
  image?: string
  meta?: Record<string, string>
  openGraph?: Record<string, string>
}

export type LinkedData = {
  linkedData?: object
}

export type PageProps = MetaData & LinkedData
