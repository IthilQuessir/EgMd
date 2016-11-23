# Md.js

> author Val.istar.Guo  
> email  val.istar.guo@gmail.com

## 用法简述

```
	/**
	 * str为待转换的字符串
	 * nodeTree为一个Element对象，可直接添加入dom中
	 * element 为添加的目标节点
	 */
	var nodeTree = new Md(str);
	element.appendChild(nodeTree);
```

## 兼容性

|  浏览器  |  是否兼容(√：兼容；x：不兼容；-：尚未测试)  |
|:-------:|:--------:|
|  Chrome | √        |
|  Safari | -        |
|  IE     | -        |
|  Edge   | -        |

## 结构概述

```
┃
┣ demo          -- Demo
┣ History.md    -- 历史更新记录
┃
┣ release       -- 当前版本发行版
┃	┣ Md-seed.js      -- 核心文件/种子文件
┃	┣ dialects        -- 语法模块
┃	┣ full_version    -- 可直接引入的完整版 Md-seed.js + dialect
┃	┗ min             -- 以上文件的压缩版本
┃
┣ src           -- 项目源文件
┃	┗ dialects        -- 语法模块配置文件
┃
┗ test          -- 测试文件
```

## Gulp

### gulp default

监视文件变化，当文件修改时自动编译。```./release```下的文件将被替换

### gulp seed

编译生成 Md-seed.js 替换 ```./release/Md-seed.js```

### gulp dialects

根据```./src/dialects/*.json```编译生成语法模块，替换```./release/dialects/```下的同名文件。

### gulp full

将```./release/Md-seed.js``` 与 ```./release/dialects/*.js``` 组合生成可直接引用的完整版本。


> copyright © Val.istar.Guo
