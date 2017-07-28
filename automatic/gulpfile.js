"use strict";

const gulp = require("gulp");
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const through = require('through2');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const reactify = require('reactify');
const del = require("del");
const watchify = require("watchify");

function doWatchify() {
	// 在这里添加自定义 browserify 选项
	var browserifyOpts = {
		entries: ['./src/index.js'],
		debug: true,
		transform: [reactify]
	}

	var opts = Object.assign({}, watchify.args, browserifyOpts);
	var b = watchify(browserify(opts));
	// 当任何依赖发生改变的时候，运行打包工具
	b.on('update', bundle.bind(global, b));
	// 输出编译日志到终端
	b.on('log', gutil.log); 
	return b;
}

function bundle(b) {
	// gulp 希望任务能返回一个 stream，因此我们在这里创建一个
	let bundledStream = through();

	bundledStream
	// 将输出的 stream 转化成为一个包含 gulp 插件所期许的一些属性的 stream
	.pipe(source("app.js"))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	// 在这里将相应 gulp 插件加入管道
	.pipe(uglify())
	.on("error", gutil.log)
	.pipe(sourcemaps.write("./"))
	.pipe(gulp.dest("./dist/js/"));

	// 将 Browserify stream 接入到我们之前创建的 stream 中去
	// 这里是 gulp 式管道正式开始的地方
	b.bundle().pipe(bundledStream);

	// 最后，我们返回这个 stream，这样 gulp 会知道什么时候这个任务会完成
	return bundledStream;
}

gulp.task("buildJS", () => {
	return bundle.call(global, doWatchify.call(global));
});

gulp.task("default", ["buildJS"]);