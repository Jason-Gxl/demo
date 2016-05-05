var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookie: {maxAge: 7*24*60*60*1000},
  secret: "session secret",
  store: new MongoStore({url: "mongodb://localhost/InterFace"})
}));

app.use('/', function(req, res, next) {
  routes(req, res, next);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//监测路由文件
fs.watch(require.resolve("./routes/index"), function() {
  cleanCache(require.resolve("./routes/index"));
  try {
    routes = require("./routes/index");
  } catch(e) {
    console.error('module update failed');
  }
});

//清除路由文件缓存
function cleanCache(modulePath) {
  var module = require.cache[modulePath];
  if(module.parent) {
    module.parent.children.splice(module.parent.children.indexOf(module), 1);
  }
  require.cache[modulePath] = null;
}

module.exports = app;