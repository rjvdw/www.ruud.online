# www.ruud.online

[![Netlify Status](https://api.netlify.com/api/v1/badges/efffb815-e941-4911-8ae2-bb478020ed33/deploy-status)](https://app.netlify.com/sites/www-ruud-online/deploys)

This website is generated with [11ty].

## Local development

In order to run the server locally, run the following commands:

```bash
yarn
yarn start
```

## SASS processing

When the site is built with `CSS_MODE="production"`, all critical CSS will be inlined, and async CSS will be loaded asynchronously.
If this environment variable is absent or has a different value, all CSS will be loaded normally.
When the CSS is loaded normally, BrowserSync can perform auto reloading.

[11ty]: https://www.11ty.dev/
