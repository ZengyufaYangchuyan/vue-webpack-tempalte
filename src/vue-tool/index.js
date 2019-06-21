/**
 * @description 此文件用于装载Vue使用到的工具
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import http from '../http'
import axios from 'axios'

let useArr = [
    {
        text: 'vue路由',
        data: VueRouter
    },
    {
        text: '数据中心',
        data: Vuex
    }
]

useArr.forEach(item => {
    Vue.use(item.data)
})

Vue.prototype.$interface = http
Vue.prototype.$axios = axios

export default Vue
