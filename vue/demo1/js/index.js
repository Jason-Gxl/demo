var app1 = new Vue({
	el: "#app_1",
	data: {
		message: "Hello World"
	}
});

var app2 = new Vue({
	el: "#app_2",
	data: {
		message: "页面加载于" + new Date().toLocaleString()
	}
});

var app3 = new Vue({
	el: "#app_3",
	data: {
		seen: true
	}
});

var app4 = new Vue({
	el: "#app_4",
	data: {
		todos: [{text: 1}, {text: 2}, {text: 3}]
	}
});

var app5 = new Vue({
	el: "#app_5",
	data: {
		message: "Hello World"
	},
	methods: {
		reverseMessage: function() {
			this.message = this.message.split("").reverse().join("");
		}
	}
});