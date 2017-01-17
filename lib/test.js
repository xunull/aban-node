var Table = require('cli-table');
var table = new Table();
 
table.push(
    { 'Some key': 'Some value' }
  , { 'Another key': 'Another value' }
);
 
console.log(table.toString());



var table = new Table({ head: ["", "Top Header 1", "Top Header 2"] });
 
table.push(
    { 'Left Header 1': ['Value Row 1 Col 1', 'Value Row 1 Col 2'] }
  , { 'Left Header 2': ['Value Row 2 Col 1', 'Value Row 2 Col 2'] }
);
 
console.log(table.toString());



var table = new Table({
  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
});
 
table.push(
    ['foo', 'bar', 'baz']
  , ['frob', 'bar', 'quuz']
);
 
console.log(table.toString());