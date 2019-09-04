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
    ],
    optimization: {
        // 只打包那些被使用的模块,摇树优化
        usedExports: true,
        // 代码分割，公共代码单独打包文件
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: false,
                default: false
              }
        }
    },
    output: {
        // publicPath: 'http://cdn.com.cn',
        publicPath: '/',
        filename: '[name].js', // 入口文件名
        chunkFilename: '[name].chunk.js', // 间接引用的模块
        path: path.resolve(__dirname, '../dist')
    }
}