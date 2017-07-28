"use strict";

var gulp = require("gulp"),
	del = require("del"),
	plugins = require("gulp-load-plugins")(),
	browserSync = require('browser-sync').create(),
	fileConfig = require("./file.config.js"),
	reg = /^.*\/([\w\*]+)\.\w+$/,
	toString = Object.prototype.toString,
	js = fileConfig.js,
	css = fileConfig.css,
	html = fileConfig.html, 
	img = fileConfig.img, 
	file = fileConfig.file,
	jsBuildTaskList = [], 
	cssBuildTaskList = [], 
	imgBuildTaskList = [], 
	fileBuildTaskList = [];

//初始化js打包任务
function initJSBuildTask(tasks) {

	var _initJSBuildTask = (taskName, js) => {
		var files = js.files;
		files = "[object Array]"===toString.call(files) && 1===files.length?files[0]:files;
		var output = "[object String]"===toString.call(files)?files.match(reg)[1]:"";
		output = /\*/g.test(output)?"":output;

		//js文件打包任务
		gulp.task(taskName, () => {
			return del([(js.basePath||".")+"/dist/*"]).then(() => {
				gulp.src(files)
					.pipe(plugins.sourcemaps.init({loadMaps: true}))
					.pipe(plugins.browserify({
						debug: true
					}))
					// .pipe(plugins.uglify())
					.pipe(plugins.rename({
						dirname: js.dirname || "js",
						prefix: js.prefix || "",
						basename: js.output || output,
						suffix: js.extname || ".min",
						extname: js.suffix || ".js"
					}))
					.pipe(plugins.sourcemaps.write("."))
					.pipe(gulp.dest((js.basePath||".")+"/dist"))
					.pipe(plugins.notify("success!!!"));
			});
		});

		gulp.watch(files, [taskName]).on("change", () => {
			console.log("Script is changed!");
			browserSync.reload();
		});

		jsBuildTaskList.push(taskName);
	};

	if("[object Array]"===toString.call(tasks)) {
		[].forEach.call(tasks, (task, index) => {
			var taskName = "build-js-"+index;
			_initJSBuildTask(taskName, task);
		});
	} else {
		_initJSBuildTask("build-js-0", tasks);
	}
}

//初始化css打包任务
function initCSSBuildTask(tasks) {

	var _initCSSBuildTask = (taskName, css) => {
		var files = css.files;
		files = "[object Array]"===toString.call(files) && 1===files.length?files[0]:files;
		var output = "[object String]"===toString.call(files)?files.match(reg)[1]:"";
		output = /\*/g.test(output)?"":output;

		gulp.task(taskName, () => {
			return del([(css.basePath||".")+"/dist/*"]).then(() => {
				gulp.src(files)
					.pipe(plugins.less())
					.pipe(plugins.sass())
					.pipe(plugins.sourcemaps.init({loadMaps: true}))
					.pipe(plugins.concat("all.css"))
					.pipe(plugins.uglifycss({
						uglyComments: true
					}))
					.pipe(plugins.rename({
						dirname: css.dirname || "css",
						prefix: css.prefix || "",
						basename: css.output || output,
						suffix: css.extname || ".min",
						extname: css.suffix || ".css"
					}))
					.pipe(plugins.sourcemaps.write("."))
					.pipe(gulp.dest((css.basePath||".")+"/dist"))
					.pipe(plugins.notify("success!!!"));
			});
		});

		gulp.watch(files, [taskName]).on("change", () => {
			console.log("Style is changed!");
			browserSync.reload();
		});

		cssBuildTaskList.push(taskName);
	};

	if("[object Array]"===toString.call(tasks)) {
		[].forEach.call(tasks, (task, index) => {
			var taskName = "build-css-"+index;
			_initCSSBuildTask(taskName, task);
		});
	} else {
		_initCSSBuildTask("build-css-0", tasks);
	}
}

//初始化图片打包任务
function initImgBuildTask(tasks) {

	var _initImgBuildTask = function(taskName, img) {
		gulp.task(taskName, () => {
			return del([(img.basePath||".")+"/dist/*"]).then(() => {
				gulp.src(img.files)
					.pipe(plugins.cache(plugins.imagemin({
						progressive: img.progressive || false,
						interlaced: img.interlaced || false,
						multipass: img.multipass || false,
						optimizationLevel: img.optimizationLevel || 3
					})))
					.pipe(plugins.rename({
						dirname: img.dirname || "img"
					}))
					.pipe(gulp.dest((img.basePath||".")+"/dist"))
					.pipe(plugins.notify("success!!!"));
			});
		});

		imgBuildTaskList.push(taskName);
	};

	if("[object Array]"===toString.call(tasks)) {
		[].forEach.call(tasks, (task, index) => {
			var taskName = "build-img-"+index;
			_initImgBuildTask(taskName, task);
		});
	} else {
		_initImgBuildTask("build-img-0", tasks);
	}
}

//初始化其它文件打包任务
function initFileBuildTask(tasks) {

	var _initFileBuildTask = function(taskName, file) {
		gulp.task(taskName, () => {
			return del([(file.basePath||".")+"/dist/*"]).then(() => {
				gulp.src(file.files)
					.pipe(plugins.rename({
						dirname: file.dirname || "file"
					}))
					.pipe(gulp.dest((file.basePath||".")+"/dist"))
					.pipe(plugins.notify("success!!!"));
			});
		});

		fileBuildTaskList.push(taskName);
	};

	if("[object Array]"===toString.call(tasks)) {
		[].forEach.call(tasks, (task, index) => {
			var taskName = "build-file-"+index;
			_initFileBuildTask(taskName, task);
		});
	} else {
		_initFileBuildTask("build-file-0", tasks);
	}
}

js && initJSBuildTask(js);
css && initCSSBuildTask(css);
img && initImgBuildTask(img);
file && initFileBuildTask(file);

//服务任务
gulp.task("server", () => {
	var opts = {
		ui: false,
		open: "external",
		logLevel: "debug",
		reloadDelay: 100,
		logFileChanges: true,
		host: fileConfig.host||"localhost",
		port: fileConfig.port||3000,
		https: !!fileConfig.https,
		startPath: fileConfig.homePage||"",
		browser: fileConfig.browser||["firefox", "chrome", "explorer"]
	};

	if(fileConfig.proxy) {
		opts.proxy = fileConfig.proxy;
	} else {
		opts.server = { baseDir: fileConfig.pagePath||"./" };
	}

	browserSync.init(opts);	
});

html && gulp.watch(html).on("change", () => {
	console.log("HTML is changed!");
	browserSync.reload();
});

var allTask = [].concat.apply([], [].concat.apply(jsBuildTaskList, [].concat.apply(cssBuildTaskList, [].concat.apply(imgBuildTaskList, fileBuildTaskList))));
gulp.task("build", allTask);
gulp.task("default", ["build"], function() {
    gulp.start("server");
});
gulp.task("build-css", cssBuildTaskList);
gulp.task("build-js", jsBuildTaskList);