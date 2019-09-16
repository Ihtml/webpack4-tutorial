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
        hotOnly: true,  //即使不支持HMR也不重新刷新浏览器
        historyApiFallback: true, //解决单页应用路由问题
        proxy: {
            '/api': {
                target: 'https://www.test.com',
                secure: false, // 实现对https的请求转发
                pathRewrite: {
                    'A.json': 'demo.json' // 请求的A.json被替换成demo.json
                },
                changeOrigin: true, // 突破网站反爬虫做的origin的限制
            } // 以api开头的请求会被代理到test.com服务器上
        }
    },  
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        modules: true
                    }
                },
                'sass-loader',
                'postcss-loader'
            ]
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ["babel-loader", "eslint-loader"],
            options: {
                "presets": [["@babel/preset-env", {
                    targets: {
                        edge: "17",
                        firefox: "60",
                        chrome: "67",
                        safari: "11.1",
                    },
                    useBuiltIns: 'usage'
                }]]
            }
        },]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        filename: '[name].js', // 入口文件名
        chunkFilename: '[name].chunk.js', // 间接引用的模块
    }
}

module.exports = merge(commonConfig, devConfig)