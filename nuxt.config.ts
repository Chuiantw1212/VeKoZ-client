// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@element-plus/nuxt',
    '@nuxtjs/color-mode'
  ],

  devtools: {
    enabled: true,
  },

  app: {
    // head
    head: {
      title: 'Venonia 微課室 - 串聯活動與空間',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'ElementPlus + Nuxt3',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    }
  },

  runtimeConfig: {
    // The private keys which are only available within server-side
    apiSecret: 'There is no secret in fron end.',
    // Keys within public, will be also exposed to the client-side
    public: {
      siteUrl: 'http://localhost:3000',
      apiBase: 'http://localhost:8080'
    }
  },

  // css
  css: [
    '~/assets/scss/venonia.scss',
    '~/assets/scss/element.scss'
  ],

  // vueuse
  vueuse: {
    ssrHandlers: true,
  },

  // colorMode
  colorMode: {
    classSuffix: '',
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  compatibilityDate: '2024-08-14',

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/hi'],
    },
  },

  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
  },
})
