// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueResource from 'vue-resource'
import VueLocalStorage from 'vue-localstorage'

import App from './App'
import router from './router'
import moment from 'moment'

Vue.use(Vuetify)
Vue.use(VueResource)
Vue.use(VueLocalStorage)

Vue.config.productionTip = false

Vue.filter('formatDate', value => {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
})

window.bus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
