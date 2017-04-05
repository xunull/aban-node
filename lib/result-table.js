const Table = require('./cli-table');


exports.getTable = function (fileRow, lineRow) {
    // fileRow 和 lineRow key是一样的

    const table = new Table({
        head: ['', '文件数', '行数'],
        colWidths: [10, 20, 20],
    });
    const keys = fileRow.keys();
    
    // var aaa= {};
    // aaa['你好'] = ['你好2', '你好3'];
    // table.push(aaa);

    for (const key of keys) {
        const temp = {};
        if (0 !== fileRow.get(key)) {
            temp[key] = [fileRow.get(key), lineRow.get(key)];
            table.push(temp);
        }
    }

    return table.toString();
};

exports.getSortedTableAndIgnoreZero = function (fileSort, lineSort) {
    const table = new Table({
        head: ['文件夹', '文件数', '行数', '文件数'],
        colWidths: [20, 20, 20, 20],
    });

    fileSort.forEach((value, index) => {
        const temp = {};
        if (value[1] === 0) {
            /**
             * 如果目标文件数是0，那么就不需要显示了
             * 相应的 行数的数组中对应下标的也是0
             * 因为文件数不为零的那些都有行数，为零的都没有行数，因此不需要显示了
             */
        } else {
            temp[value[0]] = [value[1], lineSort[index][1], lineSort[index][0]];
            table.push(temp);
        }
    });
    return table.toString();
};

exports.getSortedTable = function (fileSort, lineSort) {
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


