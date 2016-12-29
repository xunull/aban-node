
const fs = require('fs')
const path = require('path')
const readLine = require('readline')
const yaml = require('js-yaml')
const os = require('os')

const util = require('./util')
// 读取配置文件
var config = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname,'config.yaml')))


// 不统计的扩展名
var excludeExtnames = config.excludeExtnames
// 不统计的文件件
var excludeDirs = config.excludeDirs
// 不统计的文件名
var excludeFiles = config.excludeFiles

var defaultOption = {
    extnames:config.extnames // 进行统计的扩展名
}

module.exports = FileAnalysis

/**
 * 分析一个文件夹下 文件的数量，文件的行数
 */
function FileAnalysis(dirname,option) {

    this.option = Object.assign({},defaultOption,option)
    this.extnames = this.option.extnames
    this.targetDir = dirname

    // console.log(option)

    this.init()
}


FileAnalysis.prototype.init = function() {
    // 总的文件夹的数量
    let dirCount = 0
    // 总的文件的数量
    let fileCount = 0

    // 记录文件系统结构的数组
    // 对于排除的目录和文件没有记录
    let fileTreeResult = []

    /**
     * map key为文件扩展名,value 为文件的总数量
     * @type {Map}
     */
    let fileCountMap = new Map()

    /**
     * map key为文件扩展名，value 为所有文件的总行数
     * @type {Map}
     */
    let lineCountMap = new Map()

    // 初始化map
    this.extnames.forEach((value) => {
        lineCountMap.set(value, 0)
        fileCountMap.set(value, 0)
    })

    this.resultObj = {
        dirCount,
        fileCount,
        fileTreeResult,
        fileCountMap,
        lineCountMap
    }

}

/**
* 记录某种文件格式的行数
* @param  {[type]} filename [description]
* @return {[type]}          [description]
*/
FileAnalysis.prototype.recordFileLine = function(filename){
    let extname = path.extname(filename)
    let fileLineNum = util.obtainEndLine(filename)
    // console.log(`${filename}`, 'line number is', `${fileLineNum}`);
    this.resultObj.lineCountMap.
        set(extname, this.resultObj.lineCountMap.get(extname) + fileLineNum)

    this.resultObj.fileCountMap.
        set(extname,this.resultObj.fileCountMap.get(extname)+1)
}

FileAnalysis.prototype.obtain = function(dirname,fileTree) {
    try {
        let files = fs.readdirSync(dirname)
        for (let file of files) {

            let filePath = path.join(dirname, file)
            let stats = fs.statSync(filePath)

            if (stats.isFile()) {

                if (this.checkExtname(file)) {
                    fileTree.push(file)
                    this.resultObj.fileCount++
                    this.recordFileLine(filePath)

                }

            } else if (stats.isDirectory()) {

                if (file.startsWith('.')) {
                    // 以.开头的暂时全部排除
                } else if (excludeDirs.includes(file)) {
                    // 黑名单中的排除

                    // TODO 在黑名单中放行白名单

                } else {
                    this.resultObj.dirCount++

                    let childTree = []
                    let child=new Object
                    child[file]=childTree
                    fileTree.push(child)

                    this.obtain(filePath, childTree)
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}

FileAnalysis.prototype.analysis = function() {

    this.obtain(this.targetDir, this.resultObj.fileTreeResult)

    return this.resultObj
}

/**
 * 判断文件的扩展名是否在白名单中
 * @param  {[type]} filename [description]
 * @return {[type]}          [description]
 */
FileAnalysis.prototype.checkExtname=function(filename) {
    var extname = path.extname(filename)
    return (extname !== '' && this.extnames.includes(extname))
}
