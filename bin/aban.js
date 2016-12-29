#!/usr/bin/env node
var file_analysis = require('../lib/file_analysis')
var util = require('../lib/util')
var resultTable=require('../lib/result-table')
var program = require('commander')
var analysis = require('../lib')


program
    .version(require('../package').version)
    .usage('[path]')
    .option('-e,--extname <extname>','file extname')
    .option('-s,--sort <sort>','sort result')
    .parse(process.argv)

// console.dir(program)

var targetPath=null

if(0=== program.args.length) {
	// 没有传入项目路径参数,默认分析当前路径
	targetPath= process.cwd()
} else {
	// 分析给定的目录
	targetPath= program.args[0]
}

// 统计指定格式并且排序
// 不过如果只统计一种语言的话,一般都是想看文件的分布
if(program.extname) {
    analysis.consoleTableResultSomeExt(targetPath,program.extname)
} else {
    analysis.consoleBasic(targetPath)
}
