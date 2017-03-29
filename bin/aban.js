#!/usr/bin/env node
const program = require('commander');
const analysis = require('../lib');

function range(val) {
    return val.split('..').map(Number);
}

function collect(val, memo) {
    memo.push(val);
    return memo;
}

function increaseVerbosity(v, total) {
    return total + 1;
}

function list(val) {
    return val.split(',');
}

program
    .version(require('../package').version)
    .usage('[path]')
    .option('-e,--extname <extname>', 'file extname', list)
    .option('-s,--sort <sort>', 'sort result')
    .parse(process.argv);

// console.dir(program)

let targetPath = null;

if (0 === program.args.length) {
    // 没有传入项目路径参数,默认分析当前路径
    targetPath = process.cwd();
} else {
    // 分析给定的目录
    targetPath = program.args[0];
}

// console.log(program.args);
// console.log(program.extname);

// 统计指定格式并且排序
// 不过如果只统计一种语言的话,一般都是想看文件的分布
if (program.extname) {
    analysis.consoleTableResultSomeExt(targetPath, ...program.extname);
} else {
    analysis.consoleDefault(targetPath);
}
