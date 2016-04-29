(function(angular) {
	"use strict"

	var mutliSelect = function() {
		return {
			restrict: "AE",	//AECM
			replace: false,	//boolean
			transclude: false	,	//boolean
			scope: {
				data: "=",	//=、@、&
				selectedData: "=ngModel",
				showParm: "@"
			},
			link: function($scope, element, attrs) {
				$scope.data  = $scope.data || [],
				$scope.selectedData = $scope.selectedData || [];

				function dataSovle(send, receive, flag) {
					var len = $scope[send].length;
					if(flag) {
						while(len--) {
							var _d = $scope[send][len];
							if(_d.selected) {
								var obj = {};
								for(var key in _d) {
									obj[key] = _d[key];
								}
								delete obj.selected;
								$scope[receive].push(obj);
								$scope[send].splice(len, 1);
							}
						}
					} else {
						while(len--) {
							var _d = $scope[send][len];
							var obj = {};
							for(var key in _d) {
								obj[key] = _d[key];
							}
							delete obj.selected;
							$scope[receive].push(obj);
							$scope[send].splice(len, 1);
						}
					}
				}

				$scope.select = function() {
					dataSovle("data", "selectedData", true);
				};

				$scope.selectAll = function() {
					dataSovle("data", "selectedData", false);
				};

				$scope.remove = function() {
					dataSovle("selectedData", "data", true);
				};

				$scope.removeAll = function() {
					dataSovle("selectedData", "data", false);
				};
			},
			template: 
					"<div class='mutli-select-wrap'>\
						<div class='mutli-select-left-box mutli-select-box'>\
							<ul class='mutli-select-left-ul mutli-select-ul'>\
								<li class='mutli-select-left-item mutli-select-item' ng-class='{\"selected\":per.selected}' ng-repeat='per in data' ng-click='per.selected = !per.selected'>{{per[showParm]}}</li>\
							</ul>\
						</div>\
						<div class='mutli-select-ctrl-wrap'>\
							<span class='mutli-select-ctrl-item' ng-click='selectAll()'>全选</span>\
							<span class='mutli-select-ctrl-item' ng-click='select()'>选择</span>\
							<span class='mutli-select-ctrl-item' ng-click='remove()'>移除</span>\
							<span class='mutli-select-ctrl-item' ng-click='removeAll()'>全移</span>\
						</div>\
						<div class='mutli-select-right-box mutli-select-box'>\
							<ul class='mutli-select-right-ul mutli-select-ul'>\
								<li class='mutli-select-right-item mutli-select-item' ng-class='{\"selected\":per.selected}' ng-repeat='per in selectedData' ng-click='per.selected = !per.selected'>{{per[showParm]}}</li>\
							</ul>\
						</div>\
					</div>"
		};
	};

	var myDirective = angular.module("myDirective", []);
	myDirective.directive("mutliSelect", mutliSelect);
})(angular)