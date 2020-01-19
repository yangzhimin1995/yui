# yui - Element UI 部分组件的HTML使用

#### 使用说明

下载release文件夹中的 yui-min.css 、yui-min.js 以及 Iconfont-min.css 三个已经过压缩的文件。
或者下载release文件夹中的yui.rar，解压缩后也可得到这三个文件。

如果你想要大幅度自定义源代码，可以下载使用yui文件夹中的 
yui.css 、yui.js 以及 Iconfont.css 三个未压缩文件。

将文件放在你的个人项目中，在你的项目文件（一般是html文件）中正确地引用这三个文件即可看到yui效果。 
组件的示例代码请访问 [yui](http://yangzhimin.xyz/ "yui")。


#### 引用语句

&lt;link rel="stylesheet" type="text/css" href="/yourPath/yui/yui.css"&gt;

&lt;link rel="stylesheet" type="text/css" href="/yourPath/yui/iconfont.css"&gt;

&lt;script type="text/javascript" src="/yourPath/yui/yui.js"&gt;&lt;/script&gt;


#### 注意JS文件

yui文件夹中的yui.js不兼容IE内核浏览器，需要自己使用babel进行转化。

release文件夹中的yui-min.js经过babel转化后压缩，兼容IE内核浏览器。
