const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const prodConfig = {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    modules: {
        rules: [{
            test: /\.scss$/,
            use: [
                'MiniCssExtractPlugin.loader',
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
        }, {
            test: /\.css$/,
            use:[
                'MiniCssExtractPlugin.loader',
                'css-loader',
                'postcss-loader'
            ]
        }],
        optimization: {
            minimizer: [
              new TerserJSPlugin({}), // 压缩js
              new OptimizeCSSAssetsPlugin({})
            ]
          },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css', // 直接引入的css文件
                chunkFilename: '[name].chunk.css' // 间接引入的css文件
            })
        ]
    }
}

module.exports = merge(commonConfig, prodConfig)