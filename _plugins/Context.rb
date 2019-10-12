module Jekyll
  class ContextGenerator < Generator
    def generate(site)
      site.config['context'] = ENV['CONTEXT'] || 'development'
    end
  end
end
