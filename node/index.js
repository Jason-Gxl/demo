(function() {
	var server = require("./server.js"),
		router = require("./router.js");

	server.start(router);
})();