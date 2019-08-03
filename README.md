# webpack4-tutorial
## 一、webpack究竟是什么？

webpack是**模块打包工具**，最初只能打包js文件，现在可以打包任何形式的模块文件，比如css,可以使用`const style = require('./index.css')`或者`import style from './index.css'`



##  二、webpack的正确安装方式

webpack是居于node.js开发的模块打包工具，本质是由node实现的，所以要使用webpack得先安装node。尽量安装新版本的node.js,会很大程度提高webpack打包速度。高版本的webpack会利用node中的新特性来提高它的打包速度。

安装好node.js后，新建webpack-demo文件夹，然后运行`npm init`，一路回车，就会生成一个package.json文件，在里面添加一条"private":true,代表是私人仓库,同时把“main”:“index.js"去掉，因为不会被外部引用。

```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "IFE",
  "license": "ISC"
}
```

然后就可以安装webpack了，有两种方式安装：

1，全局模式（不推荐）：`npm install webpack webpack-cli -g`,命令行运行`webpack -v`如果能打印出版本号，说明全局安装好了。但如果有多个项目的情况下，都使用全局安装的webpack，可能会出现版本冲突，导致某些项目起不来。卸载`npm uninstall webpack webpack-cli -g`

2，项目内安装（推荐）：在项目根目录里运行`npm install webpack webpack-cli -D` ,-D和-save-dev是等价的,表示是开发时候依赖的东西。也可以在webpack后加@版本号，表示要安装哪个具体版本。安装好了后运行`webpack -v`会报错：-bash: webpack: command not found，因为输入webpack命令的时候，webpack会尝试到全局的模块目录中去找webpack，但全局并没有安装，就会报错。node提供了`npx`命令，`npx webpack -v`就可以运行了，因为**npx**会在当前项目的node_modules里找webpack。

两种方式都需要安装webpack-cli，它使得我们可以在命令行里使用webpack命令。

## 三、webpack的配置文件

如果想在项目中编写自己的webpack配置文件，需要在根目录下新建webpack.config.js文件。通过module.exports导出配置，提供一个入口文件作为`entry`和打包输出文件`output`,下面的代码将打包后的内容输出到dist目录下，index.js文件内。

```js
const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

也可以使用`npx webpack —config otherconfig.js`指定用一个配置文件。 

在package.json文件里的script里添加一个命令：`“bundle": "webpack"`,现在运行`npm run bundle`就会执行webpack打包。