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
	debugger
	User.count(query, function(err, doc) {
		debugger
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

router.post("/home/search", function(req, res, next) {
	var query = req.body || {},
		currentPage = query.currentPage || 1,
		pageSize = query.pageSize || 10,
		name = query.name || "",
		type = query.type || 0,
		createBy = query.createBy || "",
		createTime = query.createTime || null;

	var queryObj = InterFace.find({});
	queryObj.skip((currentPage-1)*pageSize);
	queryObj.limit(pageSize);

	var countQuery = {};
	if(name) countQuery.name = name;
	if(type) countQuery.type = type;
	if(createBy) countQuery.createBy = createBy;
	if(createTime) countQuery.createTime = createTime;

	InterFace.count(countQuery, function(err, rs) {
		if(err) {
			console.log('error message',err);
			return ;
		} else {
			queryObj.exec(function(err, results) {
				if(err) {
					console.log('error message',err);
					return ;
				} else {
					res.send({interFace: results, total: rs, currentPage: currentPage, pageSize: pageSize, totalPage: Math.floor(rs/pageSize)+1});
				}
			});
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