module Jekyll
  # noinspection RubyStringKeysInHashInspection
  class SeoTag < Liquid::Tag
    include Liquid::StandardFilters

    def initialize(tag_name, text, tokens)
      super

      @meta_tag_template = template <<-TMPL
        <meta name="{{ meta.name | escape }}" content="{{ meta.content | escape }}">
      TMPL

      @twitter_tag_template = template <<-TMPL
        <meta name="twitter:{{ meta.name | escape }}" content="{{ meta.content | escape }}">
      TMPL

      @og_tag_template = template <<-TMPL
        <meta property="og:{{ meta.name | escape }}" content="{{ meta.content | escape }}">
      TMPL

      @ld_tag_template = template <<-TMPL
        <script type="application/ld+json">{{ ld_schema | jsonify }}</script>
      TMPL
    end

    def render(context)
      [
        meta(context),
        twitter(context),
        og(context),
        ld(context),
      ].flatten.join("\n")
    end

    private

    def template(contents)
      Liquid::Template.parse contents.strip
    end

    def meta(context)
      base = {
        'description' => context['page.description'],
      }
      site = context['site.data.meta'] || {}
      page = context['page.meta'] || {}

      merge(base, site, page)
        .map {|meta| @meta_tag_template.render('meta' => meta)}
    end

    def twitter(context)
      base = {
        'description' => context['page.description'],
        'title' => context['page.title'],
      }
      site = context['site.data.twitter'] || {}
      page = context['page.twitter'] || {}

      merge(base, site, page)
        .map {|meta| @twitter_tag_template.render('meta' => meta)}
    end

    def og(context)
      base = {
        'description' => context['page.description'],
        'title' => context['page.title'],
      }
      site = context['site.data.open_graph'] || {}
      page = context['page.open_graph'] || {}

      merge(base, site, page)
        .map {|meta| @og_tag_template.render('meta' => meta)}
    end

    def ld(context)
      @ld_tag_template.render('ld_schema' => context['site.data.ld_schema'])
    end

    def merge(*hashes, name_key: 'name', content_key: 'content')
      hashes.reduce(&:merge)
        .delete_if {|name, content| content.nil?}
        .map {|name, content| {name_key => name, content_key => content}}
        .sort_by {|meta| meta[name_key]}
    end
  end
end

Liquid::Template.register_tag 'seo', Jekyll::SeoTag
