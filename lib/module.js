import consola from 'consola'

const defaultOptions = {
  keepTrying: true,
  log: 'always',
  logHtml: false
}

export default function htmlMinificationModule(moduleOptions) {
  // only add hook when server is ready we could
  this.nuxt.hook('render:done', async () => {
    const htmlMinifier = await import('html-minifier')
    const figures = await import('figures')

    this.options.cli.badgeMessages.push(`${figures.radioOn} HTML minification enabled`)

    const options = Object.assign({}, defaultOptions, moduleOptions)
    if (options.log && !['always', 'once'].includes(options.log)) {
      options.log = defaultOptions.log
    }

    const minifierErrors = []
    this.nuxt.hook('render:route', (url, result, context) => {
      if (options.keepTrying || !minifierErrors.includes(url)) {
        try {
          const html = htmlMinifier.minify(result.html, this.options.build.html.minify)
          result.html = html
        } catch (err) { /* istanbul ignore next */
          if (this.options.dev || options.log === 'always' || (options.log === 'once' && !minifierErrors.includes(url))) {
            consola.error(`HTML minification failed for ${url}.` + (options.logHtml ? ` Failed HTML:\n ${result.html}` : ''))
          }

          // keep track of url's with minifier errors when needed
          if (!options.keepTrying || options.log === 'once') {
            minifierErrors.push(url)
          }
        }
      }
    })
  })
}
