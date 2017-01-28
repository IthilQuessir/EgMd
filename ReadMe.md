# Md.js

## 用法简述

假设有这样一个字符串想要插入`id=article`标签中

```
str = "#Introduction"
```

### 方案一：取得dom对象直接插入到html

```
el = document.getElementById("article");
// toElNode 会返回一个通过createElementNode 创建的elemnet对象
var elnode = new Md(str).toElement();
el.appendChild(elnode);
```

### 方案二：取得字符串，利用其他工具插入html

```
/** toHTML会返回拼接的字符串
 * 本例中返回字符串 "<h1>Introduction</h1>"
 *／
new Vue({
    el: "#article",
    data: {
            cnt: new Md(str).toHtml();
        }
    });
```

## 兼容性

 浏览器        | 是否兼容(√：兼容；x：不兼容；-：尚未测试)
 :----        | :---------------------:
 Chrome (v55) |            √
 Safari (v10) |            √
 FireFox      |            -
 IE           |            -
 Edge         |            -

## 结构概述

```
┃
┣ demo          -- Demo
┣ History.md    -- 历史更新记录
┃
┣ dist          -- 当前版本发行版
┃    ┣ md.js           -- 核心文件/种子文件 不包含语法解析
┃    ┣ dialects        -- 包含语法解析的完整版
┃    ┃    ┗ office.js        -- 默认完整版
┃    ┣ md-broswer.js   -- md.js 的浏览器版本
┃    ┗ md-broswer.js   -- dialects/office.js 的浏览器版本
┃
┣ src           -- 项目源文件
┃    ┗ dialects        -- 语法模块配置文件
┃
┗ test          -- 测试文件
```
