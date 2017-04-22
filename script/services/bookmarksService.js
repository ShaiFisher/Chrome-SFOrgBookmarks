sfobApp.factory('bookmarksService',['$q', 'utils', 'OrgBookmarks', function($q, utils, OrgBookmarks) {

	const ORGS_LIST_KEY = 'orglist';

	var bookmarksMock = {
		orgId: 'test',
		orgName: 'Test Org',
		bookmarks: [
			{name: 'bookmark1', url: 'url1'},
			{name: 'bookmark2', url: 'url2'},
			{name: 'bookmark3', url: 'url3'}
		]
	};

	var promises = {
	};
	var orgsList = null;

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

		loadOrgsList: function() {
			this.loadFromStorage(ORGS_LIST_KEY, function(result) {
	    		//utils.log('orgs list:', ORGS_LIST_KEY, result[ORGS_LIST_KEY]);
	    		orgInfo = result[ORGS_LIST_KEY] || {};
    		});
		},

		updateOrgsList: function() {
			this.saveToStorage(ORGS_LIST_KEY, orgsList);
		},
	};
}]);