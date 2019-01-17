:warning: This module is experimental, try it and let us know how it performs

# @nuxtjs/html-minifier
[![npm (scoped with tag)](https://img.shields.io/npm/v/@nuxtjs/html-minifier/latest.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/html-minifier)
[![npm](https://img.shields.io/npm/dt/@nuxtjs/html-minifier.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/html-minifier)
[![CircleCI](https://img.shields.io/circleci/project/github/nuxt-community/html-minifier-module.svg?style=flat-square)](https://circleci.com/gh/nuxt-community/html-minifier-module)

Minify the html for each request served by nuxt server (`nuxt start`)

> :information_source: `nuxt generate` already has built-in support for minifying html

> :fire: Using this module could be a performance hit :fire: 
> it is recommended to only use it when you have a caching proxy in front of your Nuxt server (at least until we have benchmarks to determine the real world impact)

## Usage

`yarn add @nuxtjs/html-minifier` OR `npm i @nuxtjs/html-minifier`

Add `@nuxtjs/html-minifier` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    ['@nuxtjs/html-minifier', { log: 'once', logHtml: true }]
 ]
}
```

## Options

### `keepTrying`

- Default: `true`

If `false` then every url which generated an error wont be minified in future requests

### `log`
- Default: `always`

- `always`: always log html-minifier errors
- `once`: only log html-minifier errors once for each url
- `false`: never log html-minifier errors


### `logHtml`
- Default: `false`

> Be wary to enable this in production, your disk could fill up quickly!

If `true` then the html which failed to minimize is also logged

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community.
