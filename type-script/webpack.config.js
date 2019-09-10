const path = require('path')

module.exports = {
    entry: {
        main: './src/index.tsx',
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                exclude: /node_modules/,
                use: "ts-loader"
            }
        ]
    },
    plugins: [
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}