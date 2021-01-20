
const path = require("path");

// NOTE: not sure how these interact with cherry/site.py !!!
// https://cli.vuejs.org/config/#global-cli-config

module.exports = {

    // By default, Vue CLI assumes your app will be deployed at the root
    // of a domain, e.g. https://www.my-app.com/. If your app is
    // deployed at a sub-path, you will need to specify that sub-path
    // using this option. For example, if your app is deployed at
    // https://www.foobar.com/my-app/, set publicPath to '/my-app/'.

    publicPath: "https://go.ilikecarrots.com/vue_go/",

    // The directory where the production build files will be
    // generated in when running vue-cli-service build. Note the
    // target directory will be removed before building (this
    // behavior can be disabled by passing --no-clean when
    // building).

  outputDir: "/home/wendell/apps/angela/vue_go/",

    // wed 1:11pm:
    "transpileDependencies": [
        "vuetify"
      ]
}

