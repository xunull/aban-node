const fs = require('fs')
const path = require('path')
const os = require('os')

exports.readBanner = function() {
    let content = fs.readFileSync(path.resolve(__dirname,'banner.txt'),'utf8')
    return content
}

/**
 * 获取一个文件的换行符的数量,也就是行数
 * @param  {[type]} filename [description]
 * @return {[type]}          [description]
 */
exports.obtainEndLine = function(filename) {
    let data = fs.readFileSync(filename,'utf8')
    var startIndex = 0

    let result = 0

    let count = 0
    for (;;) {
        result = data.indexOf(os.EOL, startIndex)
        if (result > 0) {
            count++
            startIndex = result + 1
        } else {
            break
        }
    }
    return count
}

/**
 * 从绝对路径上移除掉 某个前缀的目录
 * @return {[type]} [description]
 */
exports.removePrefixPath = function(fullPath,prefixPath) {
    // 由于字符串都是目录,在目录间都有 斜线分割,所以加1
    return fullPath.slice(prefixPath.length+1)
}
