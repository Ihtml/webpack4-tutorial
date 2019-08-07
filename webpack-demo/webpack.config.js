const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
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
                'css-loader',
                'sass-loader',
                'postcss-loader'
            ]
        }
    ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'bundle')
    }
}