import axios from 'axios'
import baseURL from 'config/api.config'

let instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {}
})

// 请求拦截器
instance.interceptors.request.use((config) => {
    return config
}, (error) => {
    return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use((response) => {
    return response
}, (error) => {
    return Promise.reject(error)
})

export default instance
