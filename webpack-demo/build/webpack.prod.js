const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
        plugins: [
            new MiniCssExtractPlugin({})
        ]
    }
}

module.exports = merge(commonConfig, prodConfig)