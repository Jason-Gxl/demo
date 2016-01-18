(function() {
	var	url = require("url"),
		fileControl = require("./fileControl.js");
	var req = null;

	function route(request, post) {
		req = request;
		var pathname = url.parse(request.url).pathname.substring(1);
		var paths = pathname.split("\/");
		switch(paths[0]) {
			case "file":
			switch(paths[1]) {
				case "getData":
				fileControl.readFile(post);
				break;
			}
			break;
		}
	}

	exports.route = route;
})();