// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import "babel-polyfill"
import 'element-ui/lib/theme-chalk/index.css';
import $ from 'jquery';
import axios from 'axios';




axios.defaults.withCredentials = true;

Vue.prototype.$http= axios;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$axios = axios;

require('./assets/css/main.css')

Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
