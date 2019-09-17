const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
    entry: {
        main: './src/index.js',
        // sub: './src/index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // include: path.resolve(__dirname, '../src'), 只转化src目录下的js文件
                loader: "babel-loader",
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
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name]_[hash:5].[ext]',
                        outputPath: 'images/',
                        limit: 2048
                    }
                }
            },

            {
                test: '/\.(eot|ttf|svg)$/',
                use: {
                    loader: 'file-loader'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            _: 'lodash',
            _join: ['lodash', 'join'] // 使用_join即为 _.join
        }),
    ],
    optimization: {
        runtimeChunk: {
            name: 'runtime'  // 把manifest的代码抽离出来进runtime文件里去。
        },
        // 只打包那些被使用的模块,摇树优化
        usedExports: true,
        // 代码分割，公共代码单独打包文件
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    filename: 'vendors',
                },
                default: false
              }
        }
    },
    output: {
        // publicPath: 'http://cdn.com.cn',
        publicPath: '/',
        path: path.resolve(__dirname, '../dist')
    }
}