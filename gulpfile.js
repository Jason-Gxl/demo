var gulp = require("gulp"),
	webpack = require("webpack"),
	plugins = require("gulp-load-plugins")(),
	browserSync = require('browser-sync').create(),
	fileConfig = require("./file.config.js"),
	toString = Object.prototype.toString,
	js = fileConfig.js, css = fileConfig.css, html = fileConfig.html, img = fileConfig.img, file = fileConfig.file,
	jsBuildTaskList = [], cssBuildTaskList = [];

//初始化js打包任务
function initJSBuildTask(tasks) {
	var _initJSBuildTask = (taskName, js) => {
		//js文件打包任务
		gulp.task(taskName, () => {
			gulp.src(js.files)
				.pipe(plugins.webpack({
					module: {
						loaders: [{test: /\.js$/, loader: "jsx?harmony"}]
					},
					plugins: [new webpack.BannerPlugin("@Author Jason")]
				}))
				.pipe(plugins.sourcemaps.init())
				.pipe(plugins.uglify())
				.pipe(plugins.rename({
					dirname: js.dirname || "",
					prefix: js.prefix || "",
					basename: js.output || "main",
					suffix: js.extname || ".min",
					extname: js.suffix || ".js"
				}))
				.pipe(plugins.sourcemaps.write("."))
				.pipe(gulp.dest("dist"));
		});

		gulp.watch(js.files, [taskName]).on("change", () => {
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
		gulp.task(taskName, () => {
			gulp.src(css.files)
				.pipe(plugins.less())
				.pipe(plugins.sass())
				.pipe(plugins.sourcemaps.init())
				.pipe(plugins.concat("all.css"))
				.pipe(plugins.uglifycss({
					uglyComments: true
				}))
				.pipe(plugins.rename({
					dirname: css.dirname || "",
					prefix: css.prefix || "",
					basename: css.output || "main",
					suffix: css.extname || ".min",
					extname: css.suffix || ".css"
				}))
				.pipe(plugins.sourcemaps.write("."))
				.pipe(gulp.dest("dist"));
		});

		gulp.watch(css.files, [taskName]).on("change", () => {
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

initJSBuildTask(js);
initCSSBuildTask(css);

gulp.task("build-img", () => {
	gulp.src(img.files)
		.pipe(plugins.cache(plugins.imagemin({
			progressive: img.progressive || false,
			interlaced: img.interlaced || false,
			multipass: img.multipass || false,
			optimizationLevel: img.optimizationLevel || 3
		})))
		.pipe(plugins.rename({
			dirname: img.dirname || ""
		}))
		.pipe(gulp.dest("dist"));
});

gulp.task("build-file", () => {
	gulp.src(file.files)
		.pipe(plugins.rename({
			dirname: file.dirname || ""
		}))
		.pipe(gulp.dest("dist"));
});

//服务任务
gulp.task("server", () => {
	browserSync.init({
		ui: false,
		open: "external",
		logLevel: "debug",
		reloadDelay: 100,
		logFileChanges: true,
		host: fileConfig.host||"localhost",
		port: fileConfig.port||8080,
		startPath: fileConfig.path||"",
		browser: fileConfig.browser||["firefox", "chrome"],
		server: {
			baseDir: "./",
			proxy: fileConfig.proxy||""
		}
	});	
});

gulp.watch(html.files).on("change", () => {
	console.log("HTML is changed!");
	browserSync.reload();
});

console.log([].concat.apply(["build-img", "build-file"], [].concat.apply(jsBuildTaskList, cssBuildTaskList)));
gulp.task("build", [].concat.apply(["build-img", "build-file"], [].concat.apply(jsBuildTaskList, cssBuildTaskList)));
gulp.task("default", ["server", "build"]);
gulp.task("build-css", cssBuildTaskList);
gulp.task("build-js", jsBuildTaskList);