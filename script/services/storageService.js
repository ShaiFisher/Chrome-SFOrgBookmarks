sfobApp.factory('storageService',['$q', 'utils', function($q, utils) {

	return {

		load: function(key) {
			var deferred = $q.defer();
			chrome.storage.sync.get(key, function(result) {
				deferred.resolve(result[key]);
			});
			return deferred.promise;
		},

		loadMultiple: function(keys) {
			var deferred = $q.defer();
			chrome.storage.sync.get(keys, function(result) {
				deferred.resolve(result);
			});
			return deferred.promise;
		},

		save: function(key, value) {
			//console.log('saving', key, value);
			var deferred = $q.defer();
			var data = {};
			data[key] = value;
			chrome.storage.sync.set(data, function() {
				deferred.resolve();
			});
			return deferred.promise;
		},

		remove: function(key) {
			chrome.storage.sync.remove([key]);
		},

		saveMultiple: function(dataMap) {
			//console.log('saveMultiple:', dataMap);
			var deferred = $q.defer();
			chrome.storage.sync.set(dataMap, function() {
				deferred.resolve();
			});
			return deferred.promise;
		},

		removeMultiple: function(keys) {
			chrome.storage.sync.remove(keys);
		}

	};
}]);