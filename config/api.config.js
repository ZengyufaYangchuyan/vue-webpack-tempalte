/**
 * @constant
 * @description 根据当前运行的域名，匹配对应请求的后端api
 */
const domain = document.domain

let baseURL = ''

switch (domain) {
case '127.0.0.1':
    // baseURL = 'http://www.baidu.com'
    baseURL = ''
    break
default:
    break
}

export default baseURL
