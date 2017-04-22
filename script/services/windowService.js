sfobApp.factory('windowService',['$q', 'utils', function($q, utils) {


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
	                //console.log('response:', orgId);
	                deferred.resolve(orgId);
	            });
			})
	        return deferred.promise;
		},

	};
}]);