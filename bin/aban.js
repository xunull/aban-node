#!/usr/bin/env node
const program = require('commander');
const analysis = require('../lib');


function list(val) {
    return val.split(',');
}

program
    .version(require('../package').version)
    .usage('[path]')
    .option('-e,--extname <a,b,c...>', 'file extname', list)
    .option('-s,--sort <sort>', 'sort result')
    .option('--ignore <some>', 'ignore some result')
    .parse(process.argv);

let targetPath = null;

if (program.args.length === 0) {
    // 没有传入项目路径参数,默认分析当前路径
    targetPath = process.cwd();
} else {
    // 分析给定的目录
    // program.args 是从真正有用的参数开始的，不包括node的路径和脚本的路径
    // 并且第一个参数不会是那些-e,-s 这种的参数
    [targetPath] = program.args;
}

// console.log(program.args);
// console.log(program.extname);

// 统计指定格式并且排序
// 不过如果只统计一种语言的话,一般都是想看文件的分布
// 提供多个文件扩展名的时候，之间不能有空格，有空格会报错
if (program.extname) {
    analysis.consoleTableResultSomeExt(targetPath, program.extname, program);
} else {
    analysis.consoleDefault(targetPath);
}
