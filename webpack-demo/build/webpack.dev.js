const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const devConfig = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: './dist',
        open: true,
        port: 8080,
        hot: true,
        hotOnly: true  //即使不支持HMR也不重新刷新浏览器
    },   
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        // 只打包那些被使用的模块
        usedExports: true
    },
}

module.exports = merge(commonConfig, devConfig)