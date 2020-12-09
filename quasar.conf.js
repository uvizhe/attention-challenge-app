// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
function conditionalDevVariables () {
  let varsDict = {}
  if (process.env.SESSION_DURATION) {
    varsDict.SESSION_DURATION = process.env.SESSION_DURATION
  }
  return varsDict
}
function versionFromWebpack () {
  return require('./package.json').version
}
function getVersion () {
  return process.env.VERSION_STRING || versionFromWebpack()
}

module.exports = function (ctx) {
  const version = getVersion()
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/cli-documentation/boot-files
    boot: [
      'axios',
      'apex',
      'i18n'
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.sass'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
      'mdi-v4',
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'en-us', // Quasar language pack

      // Possible values for "importStrategy":
      // * 'auto' - Auto-import needed Quasar components & directives
      //            (slightly higher compile time; next to minimum bundle size; most convenient)
      // * 'all'  - ...
      importStrategy: 'auto',

      components: [],
      directives: [],

      // Quasar plugins
      plugins: [
        'LocalStorage',
        'SessionStorage'
      ],

      config: {
        cordova: {
          backButtonExit: false
        }
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'hash', // available values: 'hash', 'history'

      // rtl: false, // https://quasar.dev/options/rtl-support
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // preloadChunks: false,
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
      },
      env: ctx.dev || process.env.DEV  // the latter is for specifying dev build with DEV=true
        ? {
          BACKEND: 'http://192.168.0.222:5000',
          VERSION: version,
          ...conditionalDevVariables()
        }
        : {
          BACKEND: 'https://achallenge.supersapiens.org',
          VERSION: version
        }
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
      version: version
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    }
  }
}
