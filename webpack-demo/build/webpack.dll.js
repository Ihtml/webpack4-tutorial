const path = require('path');
const webpack = require('webpack')

module.exports = {
    mode: 'production',
    entry: {
        vendors: ['react', 'react-dom', 'redux']
    },
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, '../dll'),
        library: '[name]'  // 打包的内容通过全局变量暴露出来
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]', // 对打包生成的内容进行分析
            path: path.resolve(__dirname, '../dll/[name].manifest.json') //保存第三方模块的映射关系
        })
    ]
}
