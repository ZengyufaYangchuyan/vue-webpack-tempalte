/**
 * @description 基础依赖包
 */
let path = require('path')
let os = require('os')

/**
 * @constant
 * @description 用户配置
 */
let userConfig = require('./config/base.config')
let outputPath = userConfig.output.path ? userConfig.output.path : 'dist'
let cssPath = userConfig.output.cssPath ? userConfig.output.cssPath + '/' : ''
let jsPath = userConfig.output.jsPath ? userConfig.output.jsPath + '/' : ''
let assetPath = userConfig.output.assetPath ? userConfig.output.assetPath + '/' : ''

/**
 * @description 依赖插件
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressPlugin = require('compression-webpack-plugin')

/**
 * @constant
 * @description 当前环境
 */
let environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'none'
let isDev = environment === 'development'

/**
 * @namespace
 * @description 基础配置
 */
let config = {
    // 相应模式的内置优化
    mode: environment,
    // 开发提示
    devtool: isDev ? 'source-map' : 'eval',
    // 应用程序的起点入口
    entry: {
        app: './main.js'
    },
    // 模块配置
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader?cacheDirectory=true'
                    },
                    {
                        loader: 'eslint-loader',
                        options: {
                            formatter: require('eslint-friendly-formatter'),
                            outputReport: {
                                filePath: 'eslintError.xml',
                                formatter: require('eslint/lib/formatters/checkstyle')
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: path.resolve(__dirname, outputPath + assetPath)
                        }
                    }
                ]
            }
        ]
    },
    // 输出文件
    output: {
        filename: `${jsPath}[name].[hash].bundle.js`,
        hotUpdateChunkFilename: '[id].[hash].hot-update.js',
        path: path.resolve(__dirname, outputPath),
        pathinfo: true
    },
    // 插件
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: [outputPath]
        }),
        new HtmlWebpackPlugin(userConfig.html),
        new MiniCssExtractPlugin({
            filename: isDev ? `${cssPath}[name].css` : `${cssPath}[name].[hash].css`,
            chunkFilename: isDev ? `${cssPath}[id].css` : `${cssPath}id].[hash].css`
        })
    ],
    optimization: {
        // 拆分JS文件
        splitChunks: {
            // 在做代码分割时，async:只对异步代码生效，all:同步异步代码都会分割
            chunks: 'all',
            // 一个入口文件可以并行加载的最大文件数量
            maxInitialRequests: 5,
            // 内层文件异步请求最大文件数量
            maxAsyncRequests: 5,
            // 分离后的最小块文件大小，单位为字节
            minSize: 30000,
            // 分离前，该块被引入的次数，满足这个次数就分离
            minChunks: 1,
            // 分离合并后模块名直接的连接符
            automaticNameDelimiter: '_',
            name: true,
            cacheGroups: {
                vue: {
                    test: /vue/,
                    priority: 2,
                    name: 'vue'
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 1
                },
                default: {
                    name: 'common',
                    priority: -20,
                    // 如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                exclude: /(node_modules|bower_components)/,
                parallel: os.cpus().length,
                sourceMap: true
            })
        ]
    },
    // 文件检索
    resolve: {
        alias: {
            pages: path.resolve(__dirname, 'src/pages/'),
            components: path.resolve(__dirname, 'src/components/'),
            router: path.resolve(__dirname, 'src/router/'),
            config: path.resolve(__dirname, 'config/')
        },
        extensions: ['.vue', '.js', '.html', '.css', '.less', '.sass', '.json']
    },
    // server
    devServer: {
        inline: userConfig.server.inline,
        progress: userConfig.server.progress,
        compress: userConfig.server.compress,
        hot: userConfig.server.hot,
        open: userConfig.server.open,
        overlay: userConfig.server.overlay,
        historyApiFallback: userConfig.server.historyApiFallback,
        contentBase: path.resolve(__dirname, outputPath),
        index: userConfig.server.index,
        host: userConfig.server.host,
        port: userConfig.server.port,
        proxy: userConfig.server.proxy
    }
};

/**
 * @function
 * @description 动态添加样式规则
 */
(function () {
    let arr = [
        {
            test: /\.(sc|sa|c)ss$/,
            use: ['sass-loader']
        },
        {
            test: /\.less$/,
            use: ['less-loader']
        },
        {
            test: /\.styl(us)?$/,
            use: ['stylus-loader']
        }
    ]
    arr.forEach(item => {
        let baseRule = {
            test: null,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev
                    }
                },
                {
                    loader: 'css-loader',
                    options: { importLoaders: null }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: './config/postcss.config.js'
                        }
                    }
                }
            ]
        }
        baseRule[`test`] = new RegExp(item.test)
        let loaderArr = item.use ? item.use : []
        baseRule.use[1].options.importLoaders = Number(loaderArr.length) + 1
        loaderArr.forEach(cItem => {
            baseRule.use.push(cItem)
        })
        config.module.rules.push(baseRule)
    })
})()

/**
 * @description 根据当前环境配置不同项
 */
if (!isDev) {
    let pluginsArr = [
        new CompressPlugin({
            test: /\.(js|css|html|svg)$/,
            filename: '[path].gz[query]',
            exclude: /(node_modules|bower_components)/,
            algorithm: 'gzip',
            cache: true,
            deleteOriginalAssets: false,
            minRatio: 0.5
        })
    ]
    pluginsArr.forEach(item => {
        config.plugins.push(item)
    })
} else {

}

module.exports = config
