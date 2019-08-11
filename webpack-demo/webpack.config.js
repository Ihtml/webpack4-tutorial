const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js',
        sub: './src/index.js'
    },
    module: {
        rules: [{
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
            test: '/\.(eot|ttf|svg)$/',
            use: {
                loader: 'file-loader'
            }
        }
    ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: 'src/index.html'
    }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        })
    ],
    output: {
        publicPath: 'http://cdn.com.cn',
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}