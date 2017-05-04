sfobApp.factory('windowService',['$q', 'utils', 'storageService', function($q, utils, storageService) {

	const LAST_ORG_ID_KEY = 'lastOrgId';

	return {

		getActiveTab: function() {
			var deferred = $q.defer();
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				deferred.resolve(tabs[0]);
	        });
	        return deferred.promise;
		},

		getActiveTabId: function() {
			var deferred = $q.defer();
			this.getActiveTab().then(function(tab) {
				deferred.resolve(tab.id);
			})
	        return deferred.promise;
		},

		navigateTo: function(url) {
			this.getActiveTab().then(function(tab) {
				chrome.tabs.update(tab.id, {url: url});
			});
		},

		getOrgId: function() {
			var deferred = $q.defer();
			this.getActiveTabId().then(function(tabId) {
				chrome.tabs.sendMessage(tabId, "getOrgId", function(orgId) {
	                //console.log('getOrgId response:', orgId);
	                if (orgId) {
	                	// store as last org id
	                	storageService.save(LAST_ORG_ID_KEY, orgId);
	                	//console.log('last org id saved');

	                	// return org id
	                	deferred.resolve(orgId);
	                } else {
	                	//deferred.reject('Unknown org Id');
	                	// retrieve last org id
	                	storageService.load(LAST_ORG_ID_KEY).then(function(lastOrgId) {
	                		//console.log('last org id:', lastOrgId);
	                		deferred.resolve(lastOrgId);
	                	});
	                }
	                
	                
	            });
			})
	        return deferred.promise;
		},

	};
}]);