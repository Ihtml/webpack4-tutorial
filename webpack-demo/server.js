const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config.js')
// 编译器，每执行一次都会重新打包代码
const complier = webpack(config)

const app = express()
app.use(webpackDevMiddleware(complier, {
    publicPath: config.output.publicPath
}))

app.listen(3000, () => {
    console.log('server is running')
})