

const fs = require('fs');
const path = require('path');
const readLine = require('readline');
const yaml = require('js-yaml');
const os = require('os');

// 读取配置文件
var config = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname,'config.yaml')));

// 进行统计的扩展名
var extnames = config.extnames;
// 不统计的扩展名
var excludeExtnames = config.excludeExtnames;
// 不统计的文件件
var excludeDirs = config.excludeDirs;
// 不统计的文件名
var excludeFiles = config.excludeFiles;

module.exports = analysis;

/**
 * 分析一个文件夹下 文件的数量，文件的行数
 */
function analysis(dirname) {
    // 总的文件夹的数量
    let dirCount = 0;
    // 总的文件的数量
    let fileCount = 0;

    // 记录文件系统结构的数组
    // 对于排除的目录和文件没有记录
    let fileTreeResult = [];

    /**
     * map key为文件扩展名,value 为文件的总数量
     * @type {Map}
     */
    let extnameFileCountMap = new Map();
    /**
     * map key为文件扩展名，value 为所有文件的总行数
     * @type {Map}
     */
    let extnameLineCountMap = new Map();
    // 初始化map
    extnames.forEach((value) => {
        extnameLineCountMap.set(value, 0);
        extnameFileCountMap.set(value,0);
    });

    /**
    * 记录某种文件格式的行数
    * @param  {[type]} filename [description]
    * @return {[type]}          [description]
    */
    function recordAFileNum(filename) {
        let extname = path.extname(filename);
        let fileLineNum = obtainEndLine(filename);
        // console.log(`${filename}`, 'line number is', `${fileLineNum}`);
        extnameLineCountMap.set(extname, extnameLineCountMap.get(extname) + fileLineNum);
        extnameFileCountMap.set(extname,extnameFileCountMap.get(extname)+1);
    }

    function obtain(dirname, fileTree) {
        try {
            let files = fs.readdirSync(dirname);
            for (let file of files) {

                let filePath = path.join(dirname, file);
                let stats = fs.statSync(filePath);

                if (stats.isFile()) {

                    if (checkExtname(file)) {
                        fileTree.push(file);
                        fileCount++;
                        recordAFileNum(filePath);

                    }

                } else if (stats.isDirectory()) {

                    if (file.startsWith('.')) {
                        // 以.开头的暂时全部排除
                    } else if (excludeDirs.includes(file)) {
                        // 黑名单中的排除

                        // TODO 在黑名单中放行白名单

                    } else {
                        dirCount++;

                        let childTree = [];
                        let child=new Object;
                        child[file]=childTree;
                        fileTree.push(child);

                        obtain(filePath, childTree);
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }

    }

    obtain(dirname, fileTreeResult);

    return {dirCount, fileCount,extnameFileCountMap, extnameLineCountMap, fileTreeResult}

}

/**
 * 判断文件的扩展名是否在白名单中
 * @param  {[type]} filename [description]
 * @return {[type]}          [description]
 */
function checkExtname(filename) {
    var extname = path.extname(filename);
    return (extname !== '' && extnames.includes(extname));
}

/**
 * 获取一个文件的换行符的数量,也就是行数
 * @param  {[type]} filename [description]
 * @return {[type]}          [description]
 */
function obtainEndLine(filename) {
    let data = fs.readFileSync(filename,'utf8');
    var startIndex = 0;

    let result = 0;

    let count = 0;
    for (;;) {
        result = data.indexOf(os.EOL, startIndex)
        if (result > 0) {
            count++;
            startIndex = result + 1;
        } else {
            break;
        }
    }
    return count;
}
