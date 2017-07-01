var webpack = require("webpack");
module.exports = {
	debug: true,
	entry: {},
	module: {
		//加载器配置
		loaders: [
			//.css 文件使用 style-loader 和 css-loader 来处理
			{test: /\.css$/, loader: "style!css"},
			//.js 文件使用 jsx-loader 来编译处理
			{test: /\.js$/, loader: "jsx?harmony"},
			//.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
            {test: /\.scss$/, loader: "style!css!sass?sourceMap"}
		]
	},
	//插件项
	plugins: [
		new webpack.BannerPlugin("@Author Jason")
	]
};