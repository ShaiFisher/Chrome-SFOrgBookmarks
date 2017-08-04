sfobApp.factory('bookmarksService',['$q', 'utils', 'OrgBookmarks', 'storageService', 
			function($q, utils, OrgBookmarks, storageService) {

	const ORGS_LIST_KEY = 'orglist';
	const LAST_ORG_ID_KEY = 'lastOrgId';


	function getKey(orgId) {
		return 'orgInfo_' + orgId;
	}

	return {

        getBookmarks: function(orgId) {
        	//console.log('getBookmarks:', orgId);

        	// add orgId to global orgs ids list
        	this.addToOrgsList(orgId);

        	var deferred = $q.defer();
    		var key = getKey(orgId);

    		storageService.load(key).then(function(result) {
    			// check if sotred as json (new method to fix dates)
    			if (!angular.isObject(result)) {
    				//console.log('convert from json');
    				result = angular.fromJson(result);
    			}
    			var orgBookmarks = new OrgBookmarks(result, orgId);
    			//console.log('orgBookmarks:', orgBookmarks);
    			deferred.resolve(orgBookmarks);
    		});
		    return deferred.promise;
		},

		updateBookmarks: function(orgBookmarks) {
			// strip functions
			var orgBookmarksJson = angular.toJson(orgBookmarks);
			//var orgBookmarksData = angular.fromJson(orgBookmarksJson);

			var key = getKey(orgBookmarks.orgId);
			storageService.save(key, orgBookmarksJson);
		},

		addToOrgsList: function(orgId) {
			//console.log('addToOrgsList:', orgId);
			this.getAllOrgsIds().then(function(orgsList) {
				//console.log('loaded orgsList:', orgsList);
				orgsList = orgsList || [];
				if (orgsList.indexOf(orgId) == -1) {
					orgsList.push(orgId);
					storageService.save(ORGS_LIST_KEY, orgsList);
				}
			});
		},

		getAllOrgsIds: function() {
			var deferred = $q.defer();
			storageService.load(ORGS_LIST_KEY).then(function(orgsIds) {
				deferred.resolve(orgsIds);
			});
			return deferred.promise;
		},

		getAllOrgsKeys: function() {
			var deferred = $q.defer();
			this.getAllOrgsIds().then(function(orgsList) {
				var orgsKeys = [];
				angular.forEach(orgsList, function(orgId) {
					orgsKeys.push(getKey(orgId));
				});
				deferred.resolve(orgsKeys);
			});
			return deferred.promise;
		},

		getAllOrgsBookmarks: function() {
			var deferred = $q.defer();
			this.getAllOrgsKeys().then(function(orgsKeys) {
				storageService.loadMultiple(orgsKeys).then(function(allOrgsData) {
					// convert keys to plain org id
					var allOrgs = {};
					angular.forEach(allOrgsData, function(orgData) {
						// check if sotred as json (new method to fix dates)
		    			if (!angular.isObject(orgData)) {
		    				//console.log('convert from json');
		    				orgData = angular.fromJson(orgData);
		    			}
						if (orgData.orgId) {
							allOrgs[orgData.orgId] = orgData;
						}
					});
					deferred.resolve(allOrgs);
				});
			});

			return deferred.promise;
		},

		removeAllOrgs: function() {
			return this.getAllOrgsKeys().then(function(orgsKeys) {
				storageService.removeMultiple(orgsKeys);
				storageService.save(ORGS_LIST_KEY, []);
			});
		},

		importOrgsBookmarks: function(orgsData, clearCurrentData) {
			var deferred = $q.defer();
			var self = this;

			var importData = function(orgsIdsList, orgsBookmarks) {
				var numOrgs = 0;
				var numNewOrgs = 0;

				// prepare for save
				var fixedOrgsData = {};
				angular.forEach(orgsData, function(orgData) {
					numOrgs++;
					var oldOrgData = orgsBookmarks[orgData.orgId];
					if (!oldOrgData) {
						numNewOrgs++;
						orgsIdsList.push(orgData.orgId);
					} else {
						var oldOrgData = orgsBookmarks[orgData.orgId];
						var oldOrgBookmarks = new OrgBookmarks(oldOrgData);
						oldOrgBookmarks.mergeBookmarks(orgData);
						orgData = oldOrgBookmarks
					}
					var key = getKey(orgData.orgId);
					fixedOrgsData[key] = orgData;
				});

				// update data
				//console.log('updating:', fixedOrgsData, orgsIdsList);
				$q.all([
					storageService.saveMultiple(fixedOrgsData),
					storageService.save(ORGS_LIST_KEY, orgsIdsList)
				]).then(function() {
					deferred.resolve({numOrgs: numOrgs, numNewOrgs: numNewOrgs});
				});
			};


			if (clearCurrentData) {
				self.removeAllOrgs().then(function() {
					importData([], {});
				});
			} else {
				self.getAllOrgsIds().then(function(orgsIdsList) {
					self.getAllOrgsBookmarks().then(function(orgsBookmarks) {
						importData(orgsIdsList, orgsBookmarks);
					});
				});
				
			}

			return deferred.promise;
		},

	};
}]);