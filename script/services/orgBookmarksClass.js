sfobApp.factory('OrgBookmarks',['$q', 'utils', 'Bookmark', function($q, utils, Bookmark, OrgBookmarks) {

	const DEFAULT_GROUP = 'Default';
	const NEW_GROUP = 'New Group';

	var orgBookmarksBase = {
		/*			data:
		orgId: null,
		name: null,
		groups: [
			{
				name: 'default',
				createdDate: '',
				bookmarks: []
			}
		],
		bookmarks: [],	- deprecated
		*/

		addGroup: function(name) {
			var newGroup = {
				name: name || NEW_GROUP,
				createdDate: new Date(),
				bookmarks: []
			};
			this.groups.push(newGroup);
			return newGroup;
		},

		deleteGroup: function(index) {
			delete this.groups[index];
		},

		getDefaultGroup: function() {
			this.groups = this.groups || [];
			var groups = this.groups;

			if (groups.length == 0) {
				this.addGroup(DEFAULT_GROUP);
				return groups[0];
			}

			var defaultGroup = groups[0];
			angular.forEach(groups, function(group) {
				if (group.name == DEFAULT_GROUP) {
					defaultGroup = group;
				}
			});
			return defaultGroup;
		},

		shiftGroup: function(group, shift) {
			var index = this.groups.indexOf(group);
	        var success = utils.switchItems(this.groups, index, index + shift);
	        return success;
	    },

		/*getGroupsNames: function() {
			return utils.getValues(this.groups, 'name');
		},*/

		//---------------- Bookmarks methods -------------------------

		getIndex: function(group, bookmark) {
			return group.bookmarks.indexOf(bookmark);
		},

		addBookmark: function(title, url, group) {
			var bookmark = new Bookmark(null, title, url);
			group = group || this.getDefaultGroup();
			group.bookmarks.push(bookmark);
		},

		deleteBookmark: function(group, bookmark) {
			//var group = this.groups[groupIndex];
			var index = this.getIndex(group, bookmark);
			group.bookmarks.splice(index, 1);
		},

		moveBookmark: function(group, bookmark, shift) {
			var index = this.getIndex(group, bookmark);
	        var success = utils.switchItems(group.bookmarks, index, index + shift);
	        return success;
	    },

	    moveBookmarkToGroup: function(bookmark, oldGroup, newGroup) {
	    	newGroup.bookmarks.push(bookmark);
	    	this.deleteBookmark(oldGroup, bookmark);
	    },

	    getAllBookmarks: function() {
	    	var bookmarks = [];
	    	angular.forEach(this.groups, function(group) {
	    		angular.forEach(group.bookmarks, function(bookmark) {
	    			bookmarks.push(bookmark);
	    		});
	    	});
	    	return bookmarks;
	    },
	};

	var orgBookmarksObj;

	/*function contains(bookmarks, title, url) {
        for (var i=0; i<bookmarks.length; i++) {
            if (bookmarks[i].title == title && bookmarks[i].url == url) {
                return true;
            }
        }
    }*/

	return function(orgBookmarks, orgId) {

		orgBookmarks = orgBookmarks || { orgId: orgId };

		// copy functionality into object
		angular.merge(orgBookmarks, orgBookmarksBase);

		orgBookmarks.orgId = orgBookmarks.orgId || orgId;

		// clean groups and bookmarks
		orgBookmarks.groups = utils.removeEmptyItems(orgBookmarks.groups);

		// complete data of groups and bookmarks
		angular.forEach(orgBookmarks.groups, function(group) {
			//orgBookmarks.groupsMap[group.name] = group;
			if (!group.createdDate) {
				group.createdDate = new Date();
			}
			// load bookmarks functions
			for (var i=0; i<group.bookmarks.length; i++) {
				group.bookmarks[i] = new Bookmark(group.bookmarks[i]);
			}
		});

		// arrange old bookmarks into default group
		if (orgBookmarks.bookmarks) {
			angular.forEach(orgBookmarks.bookmarks, function(bookmark) {
				orgBookmarks.addBookmark(bookmark.title, bookmark.url);
			});
			delete orgBookmarks.bookmarks;
		}

		return orgBookmarks;
	};

}]);