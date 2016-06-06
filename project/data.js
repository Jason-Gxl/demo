(function(global) {
	"use strict"
	var data = {
		type: "video",
		videoCount: 6,
		videoLayout: "left",
		meetState: "initial",
		role: 1,
		moreScreen: false
	};

	var dialogs = {},
		interimData = {
			showMode: 1,
			moreAppIsShow: false,
			earphone: 70,
			microphone: 70,
			earphoneShut: false,
			microphoneShut: false,
			videoFullScreen: false,
			hasDialogShow: 0
		};

	var DataContainer = function() {
		this.name = "DataContainer";
	};

	DataContainer.prototype = {
		constructor: DataContainer,
		set: function(key, val) {
			data[key] = val;
			return data;
		},
		get: function(key) {
			return !key?data:data[key];
		},
		setDialog: function(key, dialog) {
			dialogs[key] = dialog;
			return dialogs;
		},
		getDialog: function(key) {
			return !key?dialogs:dialogs[key];
		},
		setInterimData: function(key, val) {
			interimData[key] = val;
			return interimData;
		},
		getInterimData: function(key) {
			return !key?interimData:interimData[key];
		}
	};

	global.vm = global.vm || {};
	global.vm.module = global.vm.module || {};
	global.vm.module["dataContainer"] = new DataContainer();
})(window)