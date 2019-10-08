// Vue-cli3对webpack做了封装，如果想自定义配置，只需在脚手架根目录下创建vue.config.js文件，导出一个配置对象，具体参见： https://cli.vuejs.org/zh/config/
// 以下的配置，最终会被转换成webpack的配置
// 转换成实际webpack配置的过程，参见：node_modules/@vue/cli-service/lib/Service.js
const path = require('path');

module.exports = {
    // 开启css-module
    css: {
        modules: true  
    },
    // 访问localhost:8080/demo.json的时候会到static目录下找
    devServer: {
        contentBase: [path.resolve(__dirname, 'static')],
    },
    // configureWebpack用于写原生的webpack配置
    configureWebpack: {
        
    }
}