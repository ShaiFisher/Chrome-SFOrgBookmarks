sfobApp.factory('bookmarksService',['$q', 'utils', 'OrgBookmarks', 'storageService', 
			function($q, utils, OrgBookmarks, storageService) {

	const ORGS_LIST_KEY = 'orglist';
	const LAST_ORG_ID_KEY = 'lastOrgId';


	function getKey(orgId) {
		return 'orgInfo_' + orgId;
	}

	return {

		loadFromStorage: function(key, callback) {
			chrome.storage.sync.get(key, callback);
		},

		saveToStorage: function(key, value, callback) {
			var data = {};
			data[key] = value;
			chrome.storage.sync.set(data, callback);
		},

        getBookmarks: function(orgId) {
        	console.log('getBookmarks:', orgId);

        	// add orgId to global orgs ids list
        	this.addToOrgsList(orgId);

        	var deferred = $q.defer();
    		var key = getKey(orgId);
    	 	chrome.storage.sync.get(key, function(result) {
	    		//utils.log('load bookmarks:', key, angular.copy(result[key]));
	    		var orgBookmarks = new OrgBookmarks(result[key], orgId);
	    		deferred.resolve(orgBookmarks);
    		});
		    return deferred.promise;
		},

		updateBookmarks: function(orgBookmarks) {
			// strip functions
			var orgBookmarksJson = angular.toJson(orgBookmarks);
			var orgBookmarksData = angular.fromJson(orgBookmarksJson);

			var key = getKey(orgBookmarks.orgId);
			var data = {};
			data[key] = orgBookmarksData;
			chrome.storage.sync.set(data, function() {
				//utils.log('saved:', key, orgBookmarksData);
				// check stored data for testing
				/*chrome.storage.sync.get(key, function(result) {
					utils.log('load bookmarks for check:', key, result);
				});*/
			});
		},

		addToOrgsList: function(orgId) {
			storageService.load(ORGS_LIST_KEY).then(function(orgsList) {
				console.log('loaded orgsList:', orgsList);
				orgsList = orgsList || [];
				if (orgsList.indexOf(orgId) == -1) {
					orgsList.push(orgId);
					storageService.save(ORGS_LIST_KEY, orgsList);
				}
			});
		},

	};
}]);