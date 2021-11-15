import de from './locale/de'
import en from './locale/en'
const localeConfig = {
  locales: ['de', 'en'],
  defaultLocale: 'de'
}

export default {
  // render: {
    // crossorigin: 'anonymous'
  // },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no' },
      { name: "msapplication-TileColor", content: "#282784" },
      { name: "msapplication-TileImage", content: "/static/favicon/mstile-144x144.png" },
      { name: "theme-color", content: "#ffffff" },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/static/favicon/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/static/favicon/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/static/favicon/favicon-16x16.png' },
      { rel: 'manifest', href: '/static/favicon/site.webmanifest' },
      { rel: 'mask-icon', href: '/static/favicon/safari-pinned-tab.svg', color: '#282784' },
      { rel: 'stylesheet', href: 'https://use.typekit.net/pfq5rmw.css' }
    ]
  },
  /*
   ** Customize the progress-bar
   ** https://nuxtjs.org/docs/2.x/features/loading
   */
  loading: { 
    // color: '#282784',
    color: '#353843',
    height: "3px"
  },
  /*
   ** Global SCSS
   */
  css: [
    '~/style/style',
    '~/style/element-ui/theme/index.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/i18n',
    '~/plugins/components',
    '~/plugins/layouts',
    { src: '~/plugins/vue-plyr.js', mode: 'client'},
    '~/plugins/element-ui'
    // { src: '~/plugins/d3.js', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module'
    [ '@nuxtjs/eslint-module', {
      "fix": true,
    } ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/mercs600/nuxt-typo3-skin
    // 'nuxt-typo3-skin',
    // Doc: https://github.com/TYPO3-Initiatives/nuxt-typo3
    'nuxt-typo3',
    '@nuxtjs/pwa',
    'nuxt-i18n'
  ],
  /*
   ** TYPO3 module configuration
   ** https://github.com/TYPO3-Initiatives/nuxt-typo3
   */
  typo3: {
    baseURL: process.env.NUXT_HOST,
    api: {
      // baseURL: 'https://response-platform.ddev.site/api'
      baseURL: 'http://response-platform.ddev.site/api' // ssl not working in dev mode ...
      // baseURL: 'http://api.response-platform.ddev.site/' // ssl not working in dev mode ...
    },
    i18n: localeConfig,
  },
  /**
   *  i18n internationalization config
   */
  i18n: {
    localeConfig,
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'de',
      messages: {
        de,
        en
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // transpile: ['d3'],
    extend(config, ctx) {}
  }
}
