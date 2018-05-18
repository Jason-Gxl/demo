"use strict";

var template = (function(undefined) {
	var _tpl_ = {
		1: "<div>\
				<ul class='drag-box'>\
					<li class='drag-item'>@NAME@</li>\
					<li class='drag-item'>@AGE@</li>\
					<li class='drag-item'>@SEX@</li>\
					<li class='drag-item'>@HOBBY@</li>\
				</ul>\
			</div>"
	};

	var _postUrl_ = {
		@NAME@: "",
		@AGE@: "",
		@SEX@: "",
		@HOBBY@: ""
	};

	return {
		getTpl: function(index) {
			return _tpl_[index];
		},
		getUrl: function(key) {
			return void(0)===key?_postUrl_:_postUrl_[key];
		}
	};
}());