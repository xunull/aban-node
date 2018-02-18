const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * 输出banner图
 */
exports.readBanner = function readBanner() {
    const content = fs.readFileSync(path.resolve(__dirname, 'banner.txt'), 'utf8');
    return content;
};

/**
 * 获取一个文件的换行符的数量,也就是行数
 * @param  {[type]} filename [description]
 * @return {[type]}          [description]
 */
exports.obtainEndLine = function obtainEndLine(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    let startIndex = 0;
    let result = 0;
    let count = 0;
    for (; ;) {
        result = data.indexOf(os.EOL, startIndex);
        if (result > 0) {
            count += 1;
            startIndex = result + 1;
        } else {
            break;
        }
    }
    return count;
};

/**
 * 从绝对路径上移除掉 某个前缀的目录
 * @return {[type]} [description]
 */
exports.removePrefixPath = function removePrefixPath(fullPath, prefixPath) {
    // 在目录间都有 斜线分割,所以加1
    // return fullPath.slice(prefixPath.length + 1);
    return fullPath.slice(prefixPath.length);
};

/**
 * arr中保存的key的值，根据value的大小来决定插入顺序
 * @param {*} arr
 * @param {*} key
 * @param {*} value
 */
exports.sortInsert = function sortInsert(sort, value, key) {
    for (let i = 0; i < sort.value.length; i += 1) {
        if (value >= sort.value[i]) {
            sort.value.splice(i, 0, value);
            sort.key.splice(i, 0, key);
            return sort;
        } else if (i === sort.value.length - 1) {
            sort.value.push(value);
            sort.key.push(key);
            return sort;
        }
    }
    if (sort.value.length === 0) {
        sort.value.push(value);
        sort.key.push(key);
    }
    return sort;
};
