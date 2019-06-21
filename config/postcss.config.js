let config = {
    plugins: [
        require('postcss-import')(),
        require('stylelint')(),
        require('autoprefixer')()
    ]
}

module.exports = config
