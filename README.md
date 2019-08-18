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

打包后命令行会有如下显示

![](https://raw.githubusercontent.com/Ihtml/images/master/img/20190804204944.jpg)

Hash对应本次打包唯一的hash值，Version为这次打包webpack的版本，Time是整体打包耗时，Built打包的时间，Asset打包出来的文件，Size是文件大小，Chunks放每个js的ID，Chunk Names放js对应的名字。

`entry: './src/index.js'`是`entry: {main: './src/index.js'}`的简写

下面警告提示我们没有指定打包的模式，默认按production模式打包，打包后的js都会压缩在一行内，在module.exports里增加一行`mode: 'development'`后，就不会报警告，而且代码不会被压缩。



## 四、webpack的核心概念

###  [loader](https://webpack.docschina.org/concepts/loaders) 

webpack默认只知道打包js模块，对于非js结尾的样式文件、图片等就不知道怎么打包了，需要另外在配置文件里配置。

在`module.exports`的对象里新增`module`属性的对象，该对象里需要rules属性数组,里面配置打包规则。

```js
    module: {
        rules: [{
            test: /\.(png|jpg|jpeg)$/, 
            use: ['url-loader?limit=2048']
        }]
    }
```

规则的写法:`test`为一个正则表达式，检测是否是匹配的模块，`use`为使用的**loader**名，loader需要安装才能使用，上面👆配置的含义是：将所有以png、jpg、jpeg结尾小于2kb的图片模块，使用url-loader,打包成base64形式的字符串，然后直接放到bundle.js里，就不用再发HTTP请求节省了时间。

**webpack 使用 [loader](https://webpack.docschina.org/concepts/loaders) 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。**

####  打包图片

在使用loader的时候，可以额外配置一些参数，放在**options**配置项里。

下面👇的配置使打包出的图片名字和后缀跟打包前一样，并加上hash值，打包到images/目录下,如果小于2kb的打包成base64字符串

```js
    module: {
        rules: [{
            test: /\.(png|jpg|jpeg)$/, 
            use: {
            		loader: 'url-loader',
            		options: {
                  	// placeholer 占位符
            				name: '[name]_[hash:5].[ext]',
                  	outputPath: 'images/',
                  	limit: 2048
            		}
            }
        }]
    }
```

#### 打包样式

打包样式文件的时候一般用到不止一个loader，use里就不使用对象了，而是数组。

```
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
```

**css-loader**将 CSS 转化成 CommonJS 模块,会帮我们分析出几个css文件的关系，最终合并成一段css.

**style-loader**将 JS 字符串生成为 style 节点,在得到css-loader生成的内容后，挂载到页面的head部分.

如果要使用**Less、Scss、Stylus**编写样式,需要再添加对应的loader。比如'sass-loader',将 Sass 编译成 CSS，默认使用 Node Sass.   安装` npm install sass-loader node-sass --save-dev`

```
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }
```

webpack的配置里，loader的执行是由先后顺序的：**从下到上，从右到左**

如果使用css3的新特性，**为了兼容性需要加前缀**，比如`-webkit-transform: translate(10px, 10px)`

[postcss-loader](https://webpack.docschina.org/loaders/postcss-loader/)可以实现这个功能,安装`npm i -D postcss-loader`还需要安装插件`npm install autoprefixer -D`

需要我们创建一个postcss.config.js文件，在这个文件里做配置。

```
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```

css-loader配置

```
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2
                    }
                },
                'sass-loader',
                'postcss-loader'
            ]
        }
```

**importLoaders**的作用是：如果打包一个index.scss文件里，@import引用了其他other.scss文件，那other.scss在打包的时候可能不会走postcss-loader和sass-loader了，而是直接走css-loader了。importLoaders可以让import进来的样式文件，也走下面的两个配置。

**css module**

如果一个文件内直接通过`import './index.scss'`这种方式引入css文件，会影响到其他文件，相当于样式是全局的。很容易出现样式冲突。css模块化可以让引入的css只在这个模块内有效。

只需要在css-loader里再加一项配置：modules：true

```
								{
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        modules: true
                    }
                },
```

而引入css的方式也变成：**import style from './index.scss'**, 给元素添加类名也变成**style.classname**

**打包字体**

当使用iconfont的时候，需要打包几个字体文件(eot,svg,ttf,woff)

```
        {
            test: '/\.(eot|ttf|svg)$/',
            use: {
                loader: 'file-loader'
            }
        }
```

### [pluguns](https://webpack.docschina.org/plugins/)

**plugin可以在webpack运行到某个时刻的时候，帮助做一些事情**。

#### html-webpack-plugin

会在打包结束后，自动生成一个html文件，并把打包生成的js自动引入到这个HTML文件中。

```bash
npm install --save-dev html-webpack-plugin
```

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'src/index.html'
  })]
};
```

将会产生一个包含以下内容的文件 `dist/index.html`：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>webpack App</title>
  </head>
  <body>
    <script src="index_bundle.js"></script>
  </body>
</html>
```

如果你有多个 webpack 入口点， 他们都会在生成的HTML文件中的 `script` 标签内。

如果你有任何CSS assets 在webpack的输出中（例如， 利用 [MiniCssExtractPlugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin/) 提取CSS）， 那么这些将被包含在HTML head中的`<link>`标签内。

可以给它**添加模板文件,**比如在src目录下创建了一个HTML模板文件,可以通过new HtmlWebpackPlugin({
    template: 'src/index.html'})来引用。

#### clean-webpack-plugin(第三方)

重新打包的时候，在打包之前，自动先把dist目录删除

`npm install clean-webpack-plugin -D`

以下为[3.0.0版本](https://stackoverflow.com/questions/56567930/typeerror-cleanwebpackplugin-is-not-a-constructor)的使用方式，

引用：`const {CleanWebpackPlugin} = require('clean-webpack-plugin');`

在plugins数组里添加

```
new CleanWebpackPlugin({
		cleanAfterEveryBuildPatterns: ['dist']
})
```



### [Entry与Output的基础配置](https://webpack.docschina.org/configuration/output/)

两个入口打包出两个文件,publicPath用于把打包出的js文件加上地址.

```
    entry: {
        main: './src/index.js',
        sub: './src/index.js'
    },
    output: {
    		publicPath: 'http://cdn.com.cn',
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
```

参考[管理输出](https://webpack.docschina.org/guides/output-management/)

### [SourceMap](https://webpack.docschina.org/configuration/devtool/)

希望开发时代码打包出错时，能告诉我们，到底是哪里的代码出了问题。**sourceMap**是一个映射关系，它知道打包出来的js代码对应的原代码的位置。

在module.export里添加：devtool: 'source-map',会在dist目录里生成一个map文件。

这种映射比较耗费性能，因为会精确到第几行第几个字符，而**cheap-inline-source-map**只会告诉第几行出了问题，性能更好。inline代表不会生成map文件，而是以字符串的形式放到打包生成的文件中。而**cheap-module-source-map**还会管第三方模块和loader的代码。而**cheap-module-eval-source-map**,通过eval这种形式，后面跟sourceURL来指向来源的代码表明映射关系，执行效率最高，性能最好。在开发模式下是最佳实践。如果是生产环境，可以使用**cheap-module-source-map**,提示效果更全面。

### [WebpackDevServer](https://webpack.docschina.org/configuration/dev-server/)

希望每次修改代码后能自动编译打包：

1. "bundle": "webpack —watch",在webpack后接'--watch',只要源代码发生变化，webpack就能监听到，并重新打包生成bundle.js文件，但需要手动刷新页面。

2. 使用**webpack-dev-server**

   安装`npm install webpack-dev-server -D`

   只需要添加以下配置,然后在scripts里添加配置`"start": "webpack-dev-server"`

   ```
   devServer: {
   	contentBase: './dist'，
   	open: true,
   	proxy: {
         '/api': 'http://localhost:3000'
    }
   }
   ```
   
   现在运行`npm run start`，会默认在localhost:8080端口上启动服务，并**自动打开浏览器并访问服务器的地址**。如果代码发生变化，也能自动重新编译打包，并重启服务和**自动刷新浏览器**。以为是http服务器，所以能发ajax请求。
   
   [Proxy](https://webpack.docschina.org/configuration/dev-server/#devserver-proxy)请求到 `/api/users` 现在会被代理到请求 `http://localhost:3000/api/users`。

3. 在node中直接使用webpack

   首先添加一条命令：`"server": "node server.js"`，再在根目录下创建一个server.js文件。下面介绍如何使用express启动node服务器。

   安装express`npm install express -D`,因为要监听webpack文件的变化并自动重新打包，需要借助一个webpack的中间件webpack-dev-middleware，安装`npm install webpack-dev-middleware -D`

   在output里添加`publicPath: '/'`

   编写server.js

   ```js
   const express = require('express')
   const webpack = require('webpack')
   const webpackDevMiddleware = require('webpack-dev-middleware')
   const config = require('./webpack.config.js')
   // 编译器，每执行一次都会重新打包代码
   const complier = webpack(config)
   
   const app = express()
   app.use(webpackDevMiddleware(complier, {
       publicPath: config.output.publicPath
   }))
   
   app.listen(3000, () => {
       console.log('server is running')
   })
   ```

   现在执行`npm run server`就会在3000端口起node服务，并打包。

   

### [Hot Module Replacement热模块更新](https://webpack.docschina.org/guides/hot-module-replacement/)

Webpack-dev-server会把打包的目录放到电脑内存里，这样打包更快。

希望改变样式代码后，不要重新刷新页面，只是替换样式代码，实现**热模块更新**。

首先，在dev-server的配置中，增加`hot: true`

```
    devServer: {
        contentBase: './dist',
        open: true,
        hot: true,
        hotOnly: true
    }
```

`hotOnly: true`的含义是：即使HMR不生效，也不刷新浏览器。

使用插件：

先引入webpack，`const webpack = require('webpack')`

再在plugins配置项里，添加`new webpack.HotModuleReplacementPlugin()`

**更改webpack配置后要重启项目**，热模块更新就生效了。如果只改了css文件，就不会替换js渲染出的内容，而只替换修改了的css的内容，因为css-loader底层帮我们实现了这个功能。

如果只改了js文件一个模块的内容，同样可以不影响其他模块。

```
if (module.hot) {
    module.hot.accept('./content', () => {
        // 如果只是改了content模块的内容，就只让content重新执行
        // 删除原有content模块，重新生成新的content模块
        // ...
    })
}
```

Vue-loader,react的babel-preset都内置了HMR这样功能的实现。

[模块热更新实现原理](https://webpack.docschina.org/concepts/hot-module-replacement/)

### [Babel处理ES6语法](https://babeljs.io/setup#installation)

希望在项目中使用ES6语法，而又要兼顾浏览器的兼容性，可以使用babel把ES6的语法转化成ES5的语法。

安装babel: `npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/polyfill` 

**babel/core**是babel的核心库，能够让babel识别js代码的内容，转化成AST抽象语法树，再编译转化成新的语法。

**@babel/preset-env**包含了所有ES6转ES5的规则。

**@babel/polyfill**把一些低版本浏览器不兼容的对象(Promise)和函数(map)转换成[polyfill](https://babeljs.io/docs/en/babel-polyfill)。

再在module里添加配置：

```
module: {
  rules: [
            {   
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel-loader",
                options: {
                    "presets": [["@babel/preset-env",{
                        useBuiltIns: 'usage'
                    }]]
                }
            },
  ]
}
```

**useBuiltIns: 'usage'**只会加载代码要使用的polyfill,精简体积。

[babel的其他配置:](https://babeljs.io/docs/en/usage)

1, 指定兼容到浏览器版本

```
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
```

