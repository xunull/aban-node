# aban-node
代码统计工具

## install
`npm i -g aban`

## usage

在目标目录下执行 `aban`

或者指定一个绝对路径，如 `aban /home/some_user/some_project`

默认统计的文件为

- .java
- .js
- .html
- .css
- .json
- .yaml
- .c
- .py
- .go
- .cpp
- .lua
- .pl
- .php
- .vue

因为主要是为了统计自己编写的代码，因此排除了一些常见的文件夹，如

- node_modules
- bower_components
- dist 
- public

使用 **-e** 选项可以指定统计的类型
如 `aban somepath -e .js,.css`
多种类型的文件扩展名间用逗号分隔
