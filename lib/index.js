const FileAnalysis = require('./file_analysis');
const util = require('./util');
const resultTable = require('./result-table');

/**
 * 统计给定的文件扩展名
 */
function consoleTableResultSomeExt(dirname, ...extnames) {
    process.stdout.write(util.readBanner());
    process.stdout.write('\n');

    const result = (new FileAnalysis(dirname, { extnames })).analysis();
    process.stdout.write(resultTable.getTable(result.fileCountMap, result.lineCountMap));

    // console.dir(result, {
    //     colors: true,
    //     depth: 8,
    // });

    process.stdout.write('\n');
}

/**
 * 使用默认的配置查询
 */
function consoleDefault(dirname) {
    process.stdout.write(util.readBanner());
    process.stdout.write('\n');
    const result = (new FileAnalysis(dirname)).analysis();

    // console.log('this', dirname);

    process.stdout.write(resultTable.getTable(result.fileCountMap, result.lineCountMap));
    process.stdout.write('\n');


    // console.dir(result.fileTreeResult, {
    //     // colors: true,
    //     depth: 8,
    // });
}

module.exports = {
    consoleTableResultSomeExt,
    consoleDefault,
};
