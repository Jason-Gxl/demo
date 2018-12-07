import Vue from "../../node_modules/vue/dist/vue.esm.js";

Vue.component("list-item", {
	props: ["item"],
	template: "<li>{{item.number}}.{{item.text}}</li>"
});

Vue.component("show-item", {
	props: ["title"],
	template: "<li><a href='javascript:void(0);' v-on:click='$emit(\"remove\")'>{{title}}</a></li>"
});

Vue.component("counter-button", {
	data: function() {
		return {
			count: 0
		};
	},
	template: "<a href='javascript:void(0);' @click='count++'>You click me {{count}} times.</a>"
});