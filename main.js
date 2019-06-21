import Vue from './src/vue-tool'
import store from './src/vuex'
import router from 'router'
import App from './src/App.vue'

// eslint-disable-next-line no-unused-vars
let Vm = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
