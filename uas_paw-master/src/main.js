import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.prototype.$baseURL = 'http://127.0.0.1:8000';
Vue.prototype.$api = 'http://127.0.0.1:8000/api';

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
