const FileAnalysis = require('./file_analysis')
const util = require('./util')
var resultTable=require('./result-table')

exports.consoleTableResultSomeExt = function(dirname,extname) {
    process.stdout.write(util.readBanner())
    process.stdout.write('\n')
    let result = (new FileAnalysis(dirname,{extnames:[extname]})).analysis()

    process.stdout.write(result)
    process.stdout.write('\n')
}

exports.consoleBasic = function(dirname) {
    process.stdout.write(util.readBanner())
    process.stdout.write('\n')
    let result = (new FileAnalysis(dirname)).analysis()

    // console.dir(result,{
    // 	colors:true,
    // 	depth:8
    // })

    process.stdout.write(resultTable.getTable(result.fileCountMap,result.lineCountMap))
    process.stdout.write('\n')

}
