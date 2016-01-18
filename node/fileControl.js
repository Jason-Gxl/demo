(function() {
	var fs = require("fs"),
		server = require("./server.js");

	function readFile(post) {
		fs.readFile(post.url, function(err, data) {
			if(err) console.log(err);
			server.end(data);
		});
	}

	exports.readFile = readFile;
})();