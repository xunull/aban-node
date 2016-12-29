var Table = require('cli-table')


exports.getTable = function (fileRow, lineRow) {
    // fileRow 和 lineRow key是一样的

    let table = new Table({
        head: ['', '文件数', '行数'],
        colWidths: [10, 20, 20]
    })
    let keys = fileRow.keys()

    for (let key of keys) {
        let temp = {}
        if (0 !== fileRow.get(key)) {
            temp[key] = [fileRow.get(key), lineRow.get(key)]
            table.push(temp)
        }

    }

    return table.toString()

}
