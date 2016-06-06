(function(global) {
	"use strict"

	var data = [],
		time = 10,
		screenCount = 4,
		players = [],
		it = 0,
		group = [],
		count = 0,
		tool = global.vm.module["tool"],
		toString = Object.prototype.toString;

	var Loop = function() {
		this.name = "Loop";
	};

	Loop.prototype = {
		constructor: Loop,
		setData: function(_d) {
			if(!_d) return ;
			data = tool.deepCopy("[object Array]"!==toString.call(_d)?[_d]:_d, []);
			return data;
		},
		getData: function() {
			return data;
		},
		setTime: function(_t) {
			if(isNaN(_t) || 0==_t) return ;
			time = _t;
			return time;
		},
		getTime: function() {
			return time;
		},
		setScreenCount: function(_c) {
			if(isNaN(_c) || 0==_c) return ;
			screenCount = _c;
			return screenCount;
		},
		getScreenCount: function() {
			return screenCount;
		},
		setPlayer: function(_players) {
			if(!_players) return ;
			players = tool.deepCopy("[object Array]"!==toString.call(_players)?[_players]:_players, []);
			return players;
		},
		getPlayer: function() {
			return players;
		},
		addJoiner: function(_joiners) {
			if(!_joiners) return ;
			data = tool.deepCopy("[object Array]"!==toString.call(_joiners)?[_joiners]:_joiners, data);
			return data;
		},
		offLine: function(id) {
			if(!id) return ;
			if("[object Object]"===Object.prototype.toString.call(data)) {
				if(data.id==id) {
					data = null;
					this.stop();
				}
			} else {
				var len = data.length;
				while(len--) {
					if(data[len].id==id) {
						data.splice(len, 1);
					}
				}
				if(0>=data.length) {
					this.stop();
				}
			}
		},
		grouping: function() {
			group = [];
			if("[object Array]"!==Object.prototype.toString.call(data)) return;
			var _data = tool.deepCopy(data);
			var _c = Math.ceil(_data/screenCount);
			while(_c--) {
				var i = 0,
					_group = [];
				while(i++<screenCount) {
					_group.push(_data.shift());
				}
				group.push(_group);
			}
		},
		start: function() {
			var len = data.length,
				self = this;

			if(len<screenCount) {
				return ;
			}

			this.grouping();
			count = 0;

			it = setInterval(function() {
				self.next();
			}, time);
		},
		stop: function() {
			clearInterval(it);
			return ;
		},
		next: function() {
			var _group = group[count],
				i = 0,
				len = players.length;

			while(i++<len) {
				players[i].player.play();
			}

			count++;

			count = count>=group.length?0:count;
		},
		pre: function() {
			var _group = group[count],
				i = 0,
				len = players.length;
			while(i++<len) {
				players[i].player.play();
			}

			count--;

			count = count<0?group.length:count;
		}
	};

	var MeettingLoop = function() {
		this.name = "MeettingLoop";
	};

	MeettingLoop.prototype = new Loop();

	var OnlineClassLoop = function() {
		this.name = "OnlineClassLoop";
	};

	OnlineClassLoop.prototype = new Loop();

	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["meettingLoop"] = new MeettingLoop();
	global.vm.module["onlineClassLoop"] = new OnlineClassLoop();
})(window);