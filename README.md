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

