import Vue from "../../node_modules/vue/dist/vue.esm.js";

var app1 = new Vue({
	el: "#app_1",
	data: {
		message: "Hello Vue!"
	}
});

var app2 = new Vue({
	el: "#app_2",
	data: {
		message: new Date().toLocaleString()
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
		items: ["Jason", "Tom", "Jacky"]
	}
});

var app5 = new Vue({
	el: "#app_5",
	data: {
		message: "123456789"
	},
	methods: {
		reverse: function() {
			this.message = this.message.split("").reverse().join("");
		}
	}
});

var app6 = new Vue({
	el: "#app_6",
	data: {
		message: "Hello Vue"
	}
});

var app7 = new Vue({
	el: "#app_7",
	data: {
		items: [
			{number: 1, text: "牛奶"},
			{number: 2, text: "苹果"}
		]
	},
	created: function() {
		console.log(this);
	}
});

var app8 = new Vue({
	el: "#app_8",
	data: {
		message: "abcd"
	},
	computed: {
		reverseMessage: function() {
			return this.message.split("").reverse().join("");
		}
	}
});

var app9 = new Vue({
	el: "#app_9",
	data: {
		firstName: "gu",
		lastName: "junsheng"
	},
	computed: {
		fullName: function() {
			return this.firstName + " " + this.lastName;
		}
	}
});


var app10 = new Vue({
	el: "#app_10",
	data: {
		message: ""
	},
	computed: {
		regMessage: function() {
			return (this.message.match(/http:\/\/.+\d/mg) || "")+"";
		}
	}
});

var app11 = new Vue({
	el: "#app_11",
	data: {
		items: [
			{id: 1, title: "语文"},
			{id: 2, title: "数学"},
			{id: 3, title: "英语"}
		]
	}
});

var app12 = new Vue({
	el: "#app_12",
	data: {
		counter: 0
	}
});

var app13 = new Vue({
	el: "#app_13",
	data: {
		message: "Hello Vue"
	},
	methods: {
		show: function() {
			alert(this.message);
		}
	}
});

var app14 = new Vue({
	el: "#app_14",
	methods: {
		say: function(message) {
			alert(message);
		}
	}
});

var app15 = new Vue({
	el: "#app_15"
});