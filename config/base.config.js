let path = require('path')
/**
 * @namespace
 * @description 可配置项
 * @property {Object} html 首页html模板配置
 * @property {Object} output 打包输出
 */
let config = {
    html: {
        filename: 'index.html',
        template: './index.html',
        title: 'vue项目基础模板',
        favicon: '',
        inject: 'body',
        meta: {
            'author_email': 'zengyufaYangchuyan@outlook.com'
        },
        // 是否开启html压缩
        minify: false
    },
    output: {
        // 打包后根目录
        path: 'dist',
        // 是否需要把js css放在指定命名的文件夹
        jsPath: 'js',
        cssPath: 'css'
    },
    server: {
        inline: true,
        progress: true,
        compress: true,
        hot: true,
        open: true,
        overlay: true,
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'dist'),
        index: 'index.html',
        host: '127.0.0.1',
        port: 8081,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    }
}

module.exports = config
