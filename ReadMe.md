# Md.js

> author IthilQuessir  
> email  itimecracker@gmail.com

## 用法简述

	/**
	 * str为待转换的字符串
	 * nodeTree为一个Element对象，可直接添加入dom中
	 * element 为添加的目标节点
	 */
	var nodeTree = new Md(str);
	element.appendChild(nodeTree);

## 结构概述

```
┃
┣ demo		-- 使用事例
┣ release	-- 当前版本发行版
┣ src		-- 项目源文件
┃	┣ dialects	-- 语法模块源文件
┃	┣ md		-- 主文件
┃	┗ output	-- 导出relase需要的构建文件
┃
┗ test		-- 测试文件
```

> copyright © www.ithilquessir.com
