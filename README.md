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

###  [1,loader](https://webpack.docschina.org/concepts/loaders) 

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

### [2,pluguns](https://webpack.docschina.org/plugins/)

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

#### [clean-webpack-plugin(第三方)](https://github.com/johnagan/clean-webpack-plugin)

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

最近升级了，直接`new CleanWebpackPlugin(),`就好，默认是remove的是output.path，不用设置任何参数！

### [3,Entry与Output的基础配置](https://webpack.docschina.org/configuration/output/)

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

### [4,SourceMap](https://webpack.docschina.org/configuration/devtool/)

希望开发时代码打包出错时，能告诉我们，到底是哪里的代码出了问题。**sourceMap**是一个映射关系，它知道打包出来的js代码对应的原代码的位置。

在module.export里添加：devtool: 'source-map',会在dist目录里生成一个map文件。

这种映射比较耗费性能，因为会精确到第几行第几个字符，而**cheap-inline-source-map**只会告诉第几行出了问题，性能更好。inline代表不会生成map文件，而是以字符串的形式放到打包生成的文件中。而**cheap-module-source-map**还会管第三方模块和loader的代码。而**cheap-module-eval-source-map**,通过eval这种形式，后面跟sourceURL来指向来源的代码表明映射关系，执行效率最高，性能最好。在开发模式下是最佳实践。如果是生产环境，可以使用**cheap-module-source-map**,提示效果更全面。

### [5,WebpackDevServer](https://webpack.docschina.org/configuration/dev-server/)

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

   

### [6,Hot Module Replacement热模块更新](https://webpack.docschina.org/guides/hot-module-replacement/)

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

### [7,Babel处理ES6语法](https://babeljs.io/setup#installation)

希望在项目中使用ES6语法，而又要兼顾浏览器的兼容性，可以使用babel把ES6的语法转化成ES5的语法。

安装babel: `npm install --save-dev babel-loader @babel/core @babel/preset-env @babel/polyfill` 

**babel/core**是babel的核心库，能够让babel识别js代码的内容，转化成AST抽象语法树，再编译转化成新的语法。

**@babel/preset-env**包含了所有ES6转ES5的规则。

**@babel/polyfill**把一些低版本浏览器不兼容的对象(Promise)和函数(map)转换成[polyfill](https://babeljs.io/docs/en/babel-polyfill)，通过全局变量的形式注入。

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

2，[transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime)

**plugin-transform-runtime**可以把polyfill以闭包的形式注入，不污染全局环境。

`npm install --save-dev @babel/plugin-transform-runtime @babel/runtime @babel/runtime-corejs2` 

在options里添加插件

```
"plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 2,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
```

3，使用.babelrc配置文件，把options里的内容提取到一个单独的文件内

```
{
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
```

4， [babel-plugin-dynamic-import-webpack](https://github.com/airbnb/babel-plugin-dynamic-import-webpack)异步加载的代码做代码分割

安装`npm install --save-dev babel-plugin-dynamic-import-webpack`，

在babelrc文件下添加

```
"plugins": ["dynamic-import-webpack"]
```



### [8，对React打包](https://babeljs.io/docs/en/babel-preset-react)

react的jsx语法需要编译打包成js才能被浏览器识别

`npm install --save-dev @babel/preset-react`

在.babelrc里配置

```
{
    "presets": [
        ["@babel/preset-env", {
            targets: {
                edge: "17",
                firefox: "60",
                chrome: "67",
                safari: "11.1",
            },
            useBuiltIns: 'usage'
        }],
        "@babel/preset-react"
    ]
}
```

presets的执行顺序是从下到上，从右往左。先把react的jsx语法装换，然后再把转换过后的ES6 的代码转换成ES5的代码。

到目前为止webpack.config.js的内容为

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry: {
        main: './src/index.js'
    },
    devServer: {
        contentBase: './dist',
        open: true,
        hot: true
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
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        // publicPath: 'http://cdn.com.cn',
        publicPath: '/',
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

## 五、webpack高级概念

### 1,Tree Shaking

希望使用什么才引入什么，Tree Shaking只会打包一个模块中要使用的内容，不会引入的东西剔除掉。**Tree Shaking只支持ES module的引入**。因为ES module底层是静态引入的方式而common.js是动态引入的方式。

在module.exports里添加配置：

```
    optimization: {
        // 只打包那些被使用的模块
        usedExports: true
    },
```

在package.json里添加：`"sideEffects": false,`,如果有模块虽然不导出内容，但仍需要,比如babel/poly-fill以及css文件, 可以这样设置`"sideEffects": ["@babel/poly-fill", "*.css"],`

注意**Tree Shaking只在production模式下才会生效**，development的模式下做打包时，即使用了Tree Shaking，也不会生效只有提示。production模式下也不用添加以上module.exports里的配置。

### 2,Develoment和Producttion模式的区分打包

Develoment-开发模式下：devserver可以帮我们起一个服务器，集成了HMR特性，修改了代码会实时展示在devserver对应的网页上。

Producttion-线上环境：代码压缩，sourceMap可以简洁

可以写两个配置文件，webpack.dev.js用来写开发环境的配置，webpack.prod.js用来写线上环境的配置

在package.json里添加命令：

```
"dev": "webpack-dev-server --config webpack.dev.js",
"build": "webpack-dev-server --config webpack.prod.js",
```

开发阶段使用：`npm run dev`本地开发，要线上时使用：`npm run build`打包线上版本。

因为开发环境和线上环境的配置有很多相同的部分，可以提取出来成webpack.common.js

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
    entry: {
        main: './src/index.js',
        sub: './src/index.js'
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
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        })
    ],
    output: {
        // publicPath: 'http://cdn.com.cn',
        publicPath: '/',
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

拆分后需要代码进行合并再输出，需要引入第三方模块**webpack-merge**,安装：`npm install webpack-merge -D`

使用：webpack.dev.js

```js
const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const devConfig = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: './dist',
        open: true,
        port: 8080,
        hot: true,
        hotOnly: true  //即使不支持HMR也不重新刷新浏览器
    },   
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        // 只打包那些被使用的模块
        usedExports: true
    },
}
```

webpack.prod.js

```js
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const prodConfig = {
    mode: 'production',
    devtool: 'cheap-module-source-map',
}

module.exports = merge(commonConfig, prodConfig)
```



### 3，Code Splitting代码分割

写义务代码的时候常常会引入各种第三方库，如果把它们全部打包到bundle.js里，文件会很大，加载时间会很长，而且每次修改业务代码后，要重新打包，用户要重新加载bundle.js。

可以把一些框架或库以及公用的、一般不会修改的代码，单独打包成js文件，业务逻辑代码另外打包，这样用户首次加载后，公用代码会有缓存，如果我们修改了业务代码，就只加载业务代码，请求更快。

webpack4提供了代码分割的插件，只需要添加以下配置，会自动把公用的类库生成一个文件，再把业务逻辑拆分成一个文件。

```
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
```

对于**异步加载**的代码也可以做代码分割，使用 [@babel/plugin-syntax-dynamic-import](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import)插件，无需做其他配置，自动分割到新的而文件中。

安装`npm install --save-dev @babel/plugin-syntax-dynamic-import`

在.babelrc文件里添加配置

```
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

使用：以下配置会将异步加载的jquery库打包生成vendors~jquery.js文件

```
function getJquery() {
    return import(/* webpackChunkName:"jquery" */ 'jquery').then(({ default: $}) => {
        // 引入的jQuery库会被放到$变量里
        console.log($)
    })
}
```

[SplitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin/)配置参数

```
optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: false,
        default: false
      }
    }
  }
```

当splitChunks: {}不配置的时候，会使用下面的默认配置：

```
splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          filename: 'vendors',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
```

chunks: 'async'-----表示只对异步代码做分割，如果想对同步代码也做分割, 设置**chunks: 'all'**，vendors里的test配置，会查找引入的库是否在node_modules里，如果是，就会打包到vendors组，打包成以vendors.js形式的文件。

minSize-----表示引入的模块大于多少字节时才会做代码分割，否则不做分割。

maxSize----表示如果引入的模块大于这个大小，会尝试将模块二次拆分成这个大小。

minChunks——表示一个模块至少被引用了几次后才做代码分割。

maxAsyncRequests----表示同时加载的模块数最多是几个，如果大于这个数只会打包前几个,超过后不会再做代码分割。

maxInitialRequests----表示入口文件引入的其他js文件或者库，如果做代码分割最多分割几个。

automaticNameDelimiter----表示打包生成的文件名中间的连接符

cacheGroups——表示把符合组的模块打包到一个文件中去，比如上面👆的配置会把node_modules中的模块打包到一个名为vendors.js的文件中去。

priority----表示优先级，如果有模块符合多个组，会被打包到priority的值高的组中。

reuseExistingChunk----表示一个模块如果已经被打包过了，再打包就忽略这个模块。

### 4，Lazy Loading懒加载





