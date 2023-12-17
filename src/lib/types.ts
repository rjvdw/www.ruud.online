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

export type PageSettings = {
  bodyClass?: string
}

export type PageProps = MetaData & LinkedData & PageSettings
