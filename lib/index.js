const FileAnalysis = require('./file_analysis');
const util = require('./util');
const resultTable = require('./result-table');

function someExtResult(dirname, extnames) {
    return (new FileAnalysis(dirname, { extnames })).analysis();
}

function defaultResult(dirname) {
    return (new FileAnalysis(dirname)).analysis();
}

function consoleDirSorted(result, extname) {
    process.stdout.write(resultTable.getSortedTable(
        result.fileSorted.get(extname),
        result.lineSorted.get(extname),
    ));
}

function consoleDirSortedIgnoreZero(result, extname) {
    process.stdout.write(resultTable.getSortedTableAndIgnoreZero(
        result.fileSorted.get(extname),
        result.lineSorted.get(extname),
    ));
}

/**
 * 统计给定的文件扩展名
 */
function consoleTableResultSomeExt(dirname, extnames, cliArgs) {
    process.stdout.write(util.readBanner());
    process.stdout.write('\n');
    const result = someExtResult(dirname, extnames);
    process.stdout.write(resultTable.getTable(result));
    process.stdout.write('\n');

    /**
     * 只统计一种类型的时候会对子目录进行排序
     */
    if (extnames.length === 1) {
        if (cliArgs.ignore === 'zero') {
            consoleDirSortedIgnoreZero(result, extnames[0]);
        } else {
            consoleDirSorted(result, extnames[0]);
        }
    }

    process.stdout.write('\n');
}

function consoleTableResultSomeExtIgnoreZero(dirname, extnames) {
    process.stdout.write(util.readBanner());
    process.stdout.write('\n');
    const result = someExtResult(dirname, extnames);
    process.stdout.write(resultTable.getTable(result.fileCountMap, result.lineCountMap));
    process.stdout.write('\n');

    /**
     * 只统计一种类型的时候会对子目录进行排序
     */
    if (extnames.length === 1) {
        consoleDirSortedIgnoreZero(result, extnames[0]);
    }

    process.stdout.write('\n');
}

/**
 * 使用默认的配置查询
 * 有个问题，如果没有包含目标文件的文件夹，不应该显示，为0的其实并不用显示了
 */
function consoleDefault(dirname) {
    process.stdout.write(util.readBanner());
    process.stdout.write('\n');
    const result = defaultResult(dirname);
    process.stdout.write(resultTable.getTable(result));
    process.stdout.write('\n');
}

module.exports = {
    someExtResult,
    defaultResult,
    consoleTableResultSomeExt,
    consoleTableResultSomeExtIgnoreZero,
    consoleDefault,
};
