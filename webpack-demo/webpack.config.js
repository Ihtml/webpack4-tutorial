const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    module: {
        rules: [{
            test: /\.(png|jpg|jpeg)$/, 
            use: ['url-loader?limit=8192']
        }]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'bundle')
    }
}