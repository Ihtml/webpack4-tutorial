// var Header = require('./header.js');
// var Sidebar = require('./sidebar.js');
// var Content = require('./content.js');

import Header from './header'
import Sidebar from './sidebar'
import Content from './content'
import './index.scss'

new Header();
new Sidebar();
new Content();

if (module.hot) {
    module.hot.accept('./content', () => {
        // 如果只是改了content模块的内容，就只让content重新执行
        // ... 删除原Content模块
        // new Content();
    })
}