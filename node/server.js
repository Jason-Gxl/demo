(function() {
(function() {
	var http = require("http"),
		querystring = require("querystring");
	var req = null, res = null;

	function getParams(router) {
		var post = "";
		req.on("data", function(chunk) {
			post += chunk;
		});

		req.on("end", function() {
			post = querystring.parse(post);
			router['route'].call(this, req, post);
		});
	}

	function start(router) {
		http.createServer(function(request, response) {
			response.setHeader("Access-Control-Allow-Origin", "*");
			response.setHeader("Access-Control-Allow-Methods", "get, post");
			req = request; res = response;
			getParams(router);
		}).listen(8888);
	}

	function end(data) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(data);
	}

	exports.start = start;
	exports.end = end;
})();