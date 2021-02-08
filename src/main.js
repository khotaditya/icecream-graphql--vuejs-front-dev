import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App.vue'
import '@/assets/css/main.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import router from './router'
import { createProvider } from './vue-apollo'
import Vuelidate from 'vuelidate'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt, faCookieBite, faShoppingCart, faHeart, faIceCream } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
library.add(faSignOutAlt, faCookieBite, faShoppingCart, faHeart, faIceCream);
Vue.component('font-awesome-icon', FontAwesomeIcon);
//Form validation
Vue.use(Vuelidate)

new Vue({
  router,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
