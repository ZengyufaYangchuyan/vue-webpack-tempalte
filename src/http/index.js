import axios from '../axios'

/**
 * @function
 * @description 这是一个测试用例接口
 */
let testRequest = (data) => {
    return axios({
        url: '/testApi',
        method: 'POST',
        data
    })
}

export default {
    testRequest
}
