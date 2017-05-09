var webpack = require("webpack");
module.exports = {
	entry: {
		index: "./demo.js",
	},
	output: {
		path: __dirname,
		filename: "[name].js"
	},
	module: {
		loaders: [
			{test:/\.css$/, loader:"style-loader!css-loader"}
		]
	},
	plugins: [
	new webpack.BannerPlugin("@Author Jason")
	]
};