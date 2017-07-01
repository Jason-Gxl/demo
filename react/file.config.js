module.exports = {
	css: [
		{
			files: ["./css/index.css", "./icon/*.css", "!./icon/demo.css"],
			dirname: "/css",	//生成的文件目录，在dist/的基础之后的目录，如果为空生成的文件就在dist/js/下
			prefix: "",			//生成的文件前缀，默认为空
			output: "index",	//生成的文件主名，默认为main
			extname: "",		//生成的文件的拓展名，默认为.min
			suffix: "" 			//生成的文件的后缀名，默认为.js
		},
		{
			files: ["./css/test.css"],
			dirname: "/css",	//生成的文件目录，在dist/的基础之后的目录，如果为空生成的文件就在dist/js/下
			prefix: "",			//生成的文件前缀，默认为空
			output: "test",		//生成的文件主名，默认为main
			extname: "",		//生成的文件的拓展名，默认为.min
			suffix: "" 			//生成的文件的后缀名，默认为.js
		}
	],
	js: {
		files: ["./js/**/*.js"],
		dirname: "/js",		
		prefix: "",			
		output: "index",	
		extname: "",		
		suffix: "" 	
	},
	img: {
		files: ["./img/*.{png,jpg}"],
		dirname: "/img",		
		progressive: true,		//无损压缩jpg图片  默认：false
		interlaced: true,		//隔行扫描gif进行渲染  默认：false
		multipass: true,		//多次优化svg直到完全优化  默认：false
		optimizationLevel: 5	//优化等级  默认：3  取值范围0-7
	},
	file: {
		files: ["./icon/iconfont.{eot,svg,ttf,woff}"],
		dirname: "/css",
	},
	html: {
		files: ["./page/*.html"],
	},
	host: "china.dev.com",
	port: 8080,
	path: "page/index.html",
	proxy: "",
	browser: null    //[object Array]  可选项"chrome", "firefox"
};