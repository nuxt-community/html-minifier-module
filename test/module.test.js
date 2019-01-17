const consola = require('consola')
jest.mock('consola')
global.consola = consola

const { Nuxt, Builder } = require('nuxt-edge')
const getPort = require('get-port')
const rp = require('request-promise-native')

jest.setTimeout(120000)

jest.mock('consola')

const config = require('./fixture/nuxt.config')

let port
const url = path => `http://localhost:${port}${path}`

describe('html-minifier-module', () => {
  let nuxt

  beforeAll(async () => {
    port = await getPort()

    nuxt = new Nuxt(config)
    await new Builder(nuxt).build()
    await nuxt.server.listen(port, 'localhost')
  })

  afterAll(async () => {
    await nuxt.close()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('always with logHtml', () => {
    test('html is minified', async () => {
      const html = await rp(url('/'))
      expect(html).not.toContain('hidden="true"')
    })

    test('returns html with error', async () => {
      const html = await rp(url('/error'))
      expect(html).toContain('<br<')
    })

    test('logs error and prints failed html', async () => {
      const html = await rp(url('/error'))
      expect(html).toContain('<br<')

      expect(consola.error).toHaveBeenCalledTimes(1)
      expect(consola.error).toHaveBeenCalledWith(expect.stringMatching('HTML minification failed for /error.'))
      expect(consola.error).toHaveBeenCalledWith(expect.stringMatching('<br<'))
    })

    test('logs error (2nd request)', async () => {
      const html = await rp(url('/error'))
      expect(html).toContain('<br<')

      expect(consola.error).toHaveBeenCalledTimes(1)
      expect(consola.error).toHaveBeenCalledWith(expect.stringMatching('HTML minification failed for /error.'))
      expect(consola.error).toHaveBeenCalledWith(expect.stringMatching('<br<'))
    })
  })

  describe('once', () => {
    beforeAll(async () => {
      await nuxt.close()

      config.modules[0][1] = { log: 'once' }
      nuxt = new Nuxt(config)
      await nuxt.server.listen(port, 'localhost')
    })

    test('html is minified', async () => {
      const html = await rp(url('/'))
      expect(html).not.toContain('hidden="true"')
    })

    test('logs error and doesnt prints html', async () => {
      const html = await rp(url('/error'))
      expect(html).toContain('<br<')

      expect(consola.error).toHaveBeenCalledTimes(1)
      expect(consola.error).toHaveBeenCalledWith(expect.stringMatching('HTML minification failed for /error.'))
      expect(consola.error).not.toHaveBeenCalledWith(expect.stringMatching('<br<'))
    })

    test('doesnt log error (2nd request)', async () => {
      const html = await rp(url('/error'))
      expect(html).toContain('<br<')

      expect(consola.error).not.toHaveBeenCalled()
    })
  })

  describe('false', () => {
    beforeAll(async () => {
      await nuxt.close()

      config.modules[0][1] = { log: false }
      nuxt = new Nuxt(config)
      await nuxt.server.listen(port, 'localhost')
    })

    test('html is minified', async () => {
      const html = await rp(url('/'))
      expect(html).not.toContain('hidden="true"')
    })

    test('doesnt log error with consola', async () => {
      const html = await rp(url('/error'))
      expect(html).toContain('<br<')

      expect(consola.error).not.toHaveBeenCalled()
    })

    test('doesnt log error (2nd request)', async () => {
      const html = await rp(url('/error'))
      expect(html).toContain('<br<')

      expect(consola.error).not.toHaveBeenCalled()
    })
  })

  describe('dont retry minifying after failure', () => {
    beforeAll(async () => {
      await nuxt.close()

      config.modules[0][1] = { keepTrying: false, log: 'always' }
      nuxt = new Nuxt(config)
      await nuxt.server.listen(port, 'localhost')
    })

    test('html is minified', async () => {
      const html = await rp(url('/'))
      expect(html).not.toContain('hidden="true"')
    })

    test('logs error with consola', async () => {
      const html = await rp(url('/error'))
      expect(html).toContain('<br<')

      expect(consola.error).toHaveBeenCalledTimes(1)
      expect(consola.error).toHaveBeenCalledWith(expect.stringMatching('HTML minification failed for /error.'))
    })

    test('doesnt log error (2nd request)', async () => {
      const html = await rp(url('/error'))
      expect(html).toContain('<br<')

      expect(consola.error).not.toHaveBeenCalled()
    })
  })
})
