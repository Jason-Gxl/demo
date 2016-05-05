var express = require('express');
var db = require("../database/db");
var mongoose = require("mongoose");

var User = db.user,
	InterFace = db.interFace;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '接口文档' });
});

router.post("/", function(req, res, next) {
	var query = {username: req.body.username, password: req.body.password};
	User.count(query, function(err, doc) {
		if(1===doc) {
			res.redirect("/home");
		} else {
			res.redirect("/");
		}
	});
});

router.get("/home", function(req, res, next) {
	res.render('home', { title: '接口文档' });
});

router.get("/home/search", function(req, res, next) {
	var query = req.query || {};
	InterFace.find(query, function(err, results) {
		if(err) {
			console.log('error message',err);
			return ;
		} else {
			res.send(results);
		}
	});
});

router.post("/home/delete", function(req, res, next) {
	var query = req.body;
	InterFace.remove(query, function(err, result) {
		if(err) {
			console.log("error message", err);
			return ;
		} else {
			res.send(result);
		}
	});
});

router.get("/home/toAdd", function(req, res, next) {
	res.render("add", {title: "接口文档"});
});

router.post("/home/toAdd/add", function(req, res, next) {
	var query = JSON.stringify(req.body);
	debugger
	InterFace.save(query, function(err, result) {
		if(err) {
			console.log("error message", err);
			return ;
		} else {
			res.send(result);
		}
	});
});

module.exports = router;
