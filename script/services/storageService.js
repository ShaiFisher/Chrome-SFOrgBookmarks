sfobApp.factory('storageService',['$q', 'utils', function($q, utils) {

	return {

		load: function(key, callback) {
			var deferred = $q.defer();
			chrome.storage.sync.get(key, function(result) {
				deferred.resolve(result[key]);
			});
			return deferred.promise;
		},

		save: function(key, value) {
			var data = {};
			data[key] = value;
			chrome.storage.sync.set(data);
		},

	};
}]);