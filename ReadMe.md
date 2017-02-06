# Md.js

## 用法简述

### 解析markdown文档

假设有这样一个字符串想要插入`id=article`标签中

```
str = "#Introduction"
```

#### 方案一：取得dom对象直接插入到html

```
el = document.getElementById("article");
// toElNode 会返回一个通过createElementNode 创建的elemnet对象
var elnode = new Md().parse(str).toElement();
el.appendChild(elnode);
```

#### 方案二：取得字符串，利用其他工具插入html

在栗子使用[Vue](https://cn.vuejs.org/)

```
/** toHTML会返回拼接的字符串
 * 本例中返回字符串 "<h1>Introduction</h1>"
 *／
var md = new Md();

new Vue({
    el: "#article",
    data: {
            cnt: md.parse(str).toHtml();
        }
    });
```

### 自定义模板

`toHtml(template)`和`toElement(template)`接受一个字符串模板作为参数作为参数。

#### 格式

```
md.parse(str).toHTML({
        h1: "<{tagName} {attr}>{children}</{tagName}>",
        h2: "<{tagName} class='{attr.class}'>{children}</{tagName}>"
    });
```

这段代码意思是将h1,h2标签按照此字符串模板进行翻译。

#### 字符串模板语法

默认字符串模板为:

```
{
    h2: "<{tagName} {attr}><a name='{id}'>{children}</a></{tagName}>",
    default: "<{tagName} {attr}>{children}</{tagName}>"
};
```

   变量    | 意义
:------: | :------------------------------------------------
   id    | 改node节点的唯一编号，可用于做锚点，如："[]()"
tagName  | 标签名
  attr   | 该node节点的全部属性对应的html字符串，如："calss='a b' width='10'"
attr.xx  | 该node节点的某个属性，如：attr.class 代表字符串 "a b"
children | 子标签内容，这里认为标签下的文本也是一个子标签

### 获取部分解析结果

可以使用getNodes获取部分解析结果，可以用于生成目录、索引。

```
var md = new Md(), str = "# H1标题\n" + "## H2标题1" + "## H2标题2";

// 获取所有H2标签
var nodes = md.parse(str).getNodes("h2");

// htmlStr = "<li>H2标题1</li><li>H2标题2</li>"
var htmlStr = nodes.toHTML({
    h2: "<li>{children}</li>"
});

// var el = nodes.toElement();
```

## 兼容性

浏览器          | 是否兼容(√：兼容；x：不兼容；-：尚未测试)
:----------- | :---------------------:
Chrome (v55) |            √
Safari (v10) |            √
FireFox      |            -
IE           |            -
Edge         |            -

## Feature

* getNode(tagName) 参数允许接受正则
* 字符串模板名字可以设置成可匹配的内容 例如 h* 匹配 h1-h6

## 结构概述

```
┃
┣ demo -- Demo
┣ History.md -- 历史更新记录
┃
┣ dist -- 当前版本发行版
┃    ┣ md.js -- 核心文件/种子文件 不包含语法解析
┃    ┣ dialects -- 包含语法解析的完整版
┃    ┃    ┗ office.js -- 默认完整版
┃    ┣ md-broswer.js -- md.js 的浏览器版本
┃    ┗ md-broswer.js -- dialects/office.js 的浏览器版本
┃
┣ src -- 项目源文件
┃
┗ test -- 测试文件
```
