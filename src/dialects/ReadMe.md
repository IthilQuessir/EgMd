# 语法模块配置指南

## 简介

可以在该目录下新增自己的语法配置文件，命名为`*.json`。 编译后的语法模块将存为`./release/dialects/*.json`(独立语法模块)和`./release/full_version/Md-*.json`(可直接引用的完整文件)。

## 规范

### 注：配置文件使用json格式

```
[
    {
        "name": "office1",      -- 解析器名称
                                -- 可以在options中设置名称来选择使用哪个解析器
                                -- 多个解析器名称不能相同，否则会覆盖

        "syntax": [             -- 语法扩展
                                -- 顺序代表优先级
                                -- 此为最简配置，删除其中之一可能出现意想不到的问题
            "block",
            "inline",

            -- More block syntax
            "combin-block",
            "paragraph",

            -- More inline syntax
            "inline-plain-text"
        ]
    },
    {
        "name": "office2",      -- 第二个解析器
        "syntax": [
            "block",
            "inline",

            "combin-block",
            "atx-header",
            "setext-header",
            "horiz-line",
            "paragraph",

            "escaped",
            "inline-plain-text"
        ]
    }
]
```

### 编译

在根目录中输入命令

```
gulp dialects
```
