var fs =require("fs"),
	https = require("https"),
	urlUtile = require("url"),
	eventEmitter = require("events");

var options = urlUtile.parse("https://www.baidu.com");
options.headers = {
	"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36"
}

var req = https.request(options, function(res) {
	var data = "";

	res.on("data", function(chunk) {
		data += chunk;
	});

	res.on("end", function() {
		var buffer = new Buffer(data, "uft8");
		fs.open("F:\\test.html", "w+", function(err, fd) {
			if(err) {
				throw err;
			}
			fs.write(fd, buffer, 0, buffer.length, function(err, written, buffer) {
				fs.fstat(fd, function(err, stats) {
					console.log(stats);
				});
			});
		});
	});
});

console.log(req);

req.end();