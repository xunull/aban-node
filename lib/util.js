var fs = require('fs');
var path = require('path')

exports.readBanner = function() {
	var content = fs.readFileSync(path.resolve(__dirname,'banner.txt'),'utf8');
	return content;
}
