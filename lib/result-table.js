const Table = require('cli-table');


exports.getTable = function (fileRow, lineRow) {
    // fileRow 和 lineRow key是一样的

    const table = new Table({
        head: ['', '文件数', '行数'],
        colWidths: [10, 20, 20],
    });
    const keys = fileRow.keys();

    for (const key of keys) {
        const temp = {};
        if (0 !== fileRow.get(key)) {
            temp[key] = [fileRow.get(key), lineRow.get(key)];
            table.push(temp);
        }
    }

    return table.toString();
};

exports.getSortedTable = function (fileSort,lineSort) {
    const table = new Table({
        head: ['文件夹', '文件数', '行数', '文件数'],
        colWidths: [20, 20, 20, 20],
    });

    fileSort.forEach((value, index) => {
        const temp = {};
        temp[value[0]] = [value[1], lineSort[index][1], lineSort[index][0]];
        table.push(temp);
    });

    return table.toString();
};


