#!/usr/bin/env node
var file_analysis = require('../lib/file_analysis');
var util = require('../lib/util');
var program = require('commander');


program
    .version(require('../package').version)
    .usage('[path]')
    .parse(process.argv)

var targetPath=null;

if(0=== program.args.length) {
	// 没有传入项目路径参数,默认分析当前路径
	targetPath= process.cwd();
} else {
	// 分析给定的目录
	targetPath= program.args[0];
}

console.log(util.readBanner());

let result = file_analysis(targetPath);

console.dir(result,{
	colors:true,
	depth:8
})
