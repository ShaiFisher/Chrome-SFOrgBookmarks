sfobApp.factory('Bookmark',['$q', 'utils', function($q, utils) {

	var bookmarkObj = {
		title: '',
		url: '',
		createdDate: '',
		modifiedDate: '',
		lastUseDate: ''
	};

	return function(bookmark, title, url) {
		bookmarkObj = bookmark;
		if (!bookmark) {
			bookmarkObj = {
				title: title,
				url: url,
				createdDate: new Date(),
				modifiedDate: new Date(),
				lastUseDate: new Date()
			};
		}


		return bookmarkObj;
	};
}]);