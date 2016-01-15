"use strict";

angular.module("myliveenh", [])
.factory("Alarm", function(){
	return {
		"resetAlarm": function(){
			chrome.alarms.clearAll();
		},
		"setAlarm": function(settings){
			if(settings.notifyFollow === 0){
				return;
			}
			chrome.alarms.create("notify", {
				periodInMinutes: settings.notifyFollow,
				delayInMinutes: settings.notifyFollow
			});
		}
	}
})
.controller("Settings", ["$scope", "$timeout", "Alarm", function($scope, $timeout, Alarm){
	$scope.settings = angular.copy(defaultSettings);
	$scope.saved = false;
	chrome.storage.sync.get("settings", function(data){
		if(!data.settings){
			return;
		}
		$scope.settings = _.defaults(data.settings, defaultSettings);
		$scope.$apply();
	});

	var saveTimeout;
	$scope.save = function(){
		$timeout.cancel(saveTimeout);
		chrome.storage.sync.set({
			settings: $scope.settings
		}, function(){
			$scope.saved = true;
			$scope.$apply();

			Alarm.resetAlarm();
			Alarm.setAlarm($scope.settings);

			saveTimeout = $timeout(function(){
				$scope.saved = false;
			}, 1500);
		});
	};

	$scope.reset = function(){
		if(!confirm("Reset all settings to default values?\nThis action cannot be undone")){
			return;
		}
		$scope.settings = angular.copy(defaultSettings);
		$scope.save();
	};
}]);