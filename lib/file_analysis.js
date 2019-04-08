
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const util = require('./util');
// 读取配置文件
const config = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, 'config.yaml')));


// 不统计的扩展名
const excludeExtnames = config.excludeExtnames;
// 不统计的文件夹名字
const excludeDirs = config.excludeDirs;
// 不统计的文件名
const excludeFiles = config.excludeFiles;

const defaultOption = {
    extnames: config.extnames, // 进行统计的扩展名
};

/**
 * 分析一个文件夹下 文件的数量，文件的行数
 */
class FileAnalysis {
    constructor(dirname, option) {
        this.option = option || defaultOption;
        this.extnames = this.option.extnames;
        this.targetDir = dirname;
        this.init();
    }

    /**
     * 统计开始前各个统计数字的初始化
     */
    init() {
        /**
         * key为文件扩展名,value 为文件的总数量
         * @type {Map}
         */
        const fileCountMap = new Map();

        /**
         * key为文件扩展名，value 为所有文件的总行数
         * @type {Map}
         */
        const lineCountMap = new Map();

        const fileSorted = new Map();
        const lineSorted = new Map();

        // 初始化统计map
        // 初始化每种统计语言
        this.extnames.forEach((value) => {
            lineCountMap.set(value, 0);
            fileCountMap.set(value, 0);
            fileSorted.set(value, []);
            lineSorted.set(value, []);
        });

        this.result = {
            // 总的文件夹的数量
            dirCount: 0,
            // 总的文件的数量
            fileCount: 0,
            // 总的代码行数
            lineCount: 0,
            // 记录文件系统结构的数组
            // 对于排除的目录和文件没有记录
            fileTreeResult: [],
            // 以完整的路径存储的,类似于绝对路径
            // 但在这里是以目标目录开始的
            dirFullPathTree: [],
            fileCountMap,
            lineCountMap,
            fileSorted,
            lineSorted,
            subAnalysisMap: new Map(),
            sort: {
                line: {
                    key: [],
                    value: [],
                },
                file: {
                    key: [],
                    value: [],
                },
            },
        };
    }

    /**
    * 记录某种文件格式的行数
    * @param  {[type]} filename [description]
    * @return {[type]}          [description]
    */
    recordFileLine(filename) {
        const extname = path.extname(filename);
        const fileLineNum = util.obtainEndLine(filename);

        this.result.lineCount += fileLineNum;
        this.result.lineCountMap.set(
            extname,
            this.result.lineCountMap.get(extname) + fileLineNum,
        );
        this.result.fileCountMap.set(
            extname,
            this.result.fileCountMap.get(extname) + 1,
        );
    }

    obtain(dirname, fileTree) {
        try {
            const files = fs.readdirSync(dirname);

            files.forEach((file) => {
                const filePath = path.join(dirname, file);
                const stats = fs.statSync(filePath);

                if (stats.isFile()) {
                    // 对于文件就统计代码行数
                    if (!excludeFiles.includes(file)) {
                        if (this.checkExtname(file)) {
                            fileTree.push(file);
                            this.result.fileCount += 1;
                            this.recordFileLine(filePath);
                        }
                    }

                } else if (stats.isDirectory()) {
                    this.result.dirFullPathTree.push(util.removePrefixPath(filePath, this.targetDir));
                    if (file.startsWith('.')) {
                        // 以.开头的暂时全部排除
                    } else if (excludeDirs.includes(file)) {
                        // 黑名单中的排除

                        // TODO 在黑名单中放行白名单

                    } else {
                        this.result.dirCount += 1;

                        const childTree = [];
                        const child = {};
                        child[file] = childTree;
                        fileTree.push(child);

                        // this.obtain(filePath, childTree);

                        const subAnalysis = new FileAnalysis(filePath, this.option);
                        const subResult = subAnalysis.analysis();
                        const childrenDirName = file;
                        this.result.subAnalysisMap.set(childrenDirName, subResult);
                        this.handleSubResult(childrenDirName, subResult);
                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    handleSubResult(childrenDirName, subResult) {
        this.result.dirCount += subResult.dirCount;
        this.result.fileCount += subResult.fileCount;
        this.result.lineCount += subResult.lineCount;

        // 统计每种语言的数量
        this.result.fileCountMap.forEach((value, key) => {
            this.result.fileCountMap.set(key, value + subResult.fileCountMap.get(key));
            this.result.fileSorted.get(key)
                .push([childrenDirName, subResult.fileCountMap.get(key)]);
        });
        this.result.lineCountMap.forEach((value, key) => {
            this.result.lineCountMap.set(key, value + subResult.lineCountMap.get(key));
            this.result.lineSorted.get(key)
                .push([childrenDirName, subResult.lineCountMap.get(key)]);
        });
    }

    /**
     * 对统计后的结果进行排序
     */
    sort() {
        this.result.lineCountMap.forEach((value, key) => {
            util.sortInsert(this.result.sort.line, value, key);
        });

        /**
         * 以下的排序是倒序
         * one > two return 1 是正序
         */
        this.result.fileSorted.forEach(value => {
            value = value.sort((one, two) => {
                if (one[1] > two[1]) {
                    return -1;
                } else {
                    return 1;
                }
                return 0;
            });
        });

        this.result.lineSorted.forEach(value => {
            value = value.sort((one, two) => {
                if (one[1] > two[1]) {
                    return -1;
                } else {
                    return 1;
                }
                return 0;
            });
        });
    }

    /**
     * 外部主要使用的方法
     */
    analysis() {
        this.obtain(this.targetDir, this.result.fileTreeResult);
        this.sort();
        return this.result;
    }

    /**
     * 判断文件的扩展名是否在白名单中
     * @param  {[type]} filename [description]
     * @return {[type]}          [description]
     */
    checkExtname(filename) {
        const extname = path.extname(filename);
        return (extname !== '' && this.extnames.includes(extname));
    }
}

module.exports = FileAnalysis;
