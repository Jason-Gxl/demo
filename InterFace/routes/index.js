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
	var query = req.body;
		query.createTime = new Date();
	var saveQuery = new InterFace(query);
	saveQuery.save(function(err, result) {
		if(err) {
			console.log("error message", err);
			return ;
		} else {
			res.send(result);
		}
	});
});

router.get("/home/toUpdate", function(req, res, next) {
	var id = req.query.id;
	if(!id) return ;
	var query = {_id: id};
	InterFace.findOne(query, function(err, result) {
		if(err) {
			console.log("error message", err);
			return ;
		} else {
			res.render("update", {title: "接口文档", interFace: result});
		}
	});
});

router.post("/home/toUpdate/update", function(req, res, next) {
	var query = req.body;
	if(!query._id) return ;
	query.updateTime = new Date();
	InterFace.update(query, function(err, result) {
		if(err) {
			console.log("error message", err);
			return;
		} else {
			res.send(result);
		}
	}); 
});

router.get("/home/toView", function(req, res, next) {
	var id = req.query.id;
	if(!id) return ;
	var query = {_id: id};
	InterFace.findOne(query, function(err, result) {
		if(err) {
			console.log("error message", err);
			return ;
		} else {
			res.render("view", {title: "接口文档", interFace: result});
		}
	});
});

module.exports = router;