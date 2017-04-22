sfobApp.directive('bookmarkEditForm', ['$interval', '$timeout', function($interval, $timeout){
	return {
	    restrict: 'EA',
	    scope: {
	    	orgBookmarks: '=',
	    	group: '=',
	    	bookmark: '=',
	    	onClose: '&',
    	},
	    template:	
	    	'<div class="bookmark-edit-form-wrap">' +
		    	'<input type="text" ng-model="bookmark.title"/>' +
		    	'<input type="text" ng-model="bookmark.url"/>' +
		    	'<select ng-model="selectedGroup" ' + 
		    			'ng-options="group.name for group in groups" ' + 
		    			'ng-change="moveToGroup(selectedGroup)"></select>' +
	        '</div>',

	    link: function (scope, element, attrs) {  
	    	//scope.groupsNames = scope.orgBookmarks.getGroupsNames();
	    	scope.selectedGroup = scope.group;
	    	scope.groups = scope.orgBookmarks.groups;
	    	//console.log('groupsNames:', scope.groupsNames);

	    	scope.moveToGroup = function(newGroup) {
	    		//console.log('moveToGroup:', newGroup);
	    		scope.orgBookmarks.moveBookmarkToGroup(scope.bookmark, scope.group, newGroup);
	    		scope.group = newGroup;
	    		if (scope.onClose) {
	    			scope.onClose();
	    		}
	    	};
	    }
	                
	};
}]);