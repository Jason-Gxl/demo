var mongoose = require("mongoose");

var db = mongoose.connect("mongodb://localhost/InterFace");
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String, 
	password: String,
	department: String
});

var interfaceSchema = new Schema({
	name: String,
	description: String,
	createTime: Date,
	updateTime: Date,
	createBy: String,
	type: String
});

module.exports.user = db.model("users", userSchema);
module.exports.interFace = db.model("interfaces", interfaceSchema);