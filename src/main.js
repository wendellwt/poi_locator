
import Vue from 'vue'
import App from './App.vue'

// ---------------- openayers

import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css' // needs css-loader

// all input/output coordinates, GeoJSON features in EPSG:4326 projection
Vue.use(VueLayers, {
  dataProjection: 'EPSG:4326',
})

// ---------------- vuetify

// from https://levelup.gitconnected.com/add-vuetify-to-your-vue-js-app-4e4e3616cb9c

import vuetify from './plugins/vuetify'

// to clean up this file, see some suggestions here:
// https://stackoverflow.com/questions/57291304/vue-vuetify-is-not-properly-initialized

// ---------------- materialdesign icons

import 'vue-material-design-icons/styles.css';

// ---------------- main

new Vue({
  vuetify,
  //el: '#app',

//  mounted() {
//        this.$vuetify.init();
//  },

  render: h => h(App),
}).$mount("#app")

