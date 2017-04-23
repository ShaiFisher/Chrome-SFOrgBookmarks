sfobApp.factory('Bookmark',['$q', 'utils', function($q, utils) {

	var bookmarkObj = {
		title: '',
		url: '',
		createdDate: '',
		//modifiedDate: '',		// what for?
		lastUseDate: ''
	};

	return function(bookmark, title, url) {
		bookmarkObj = bookmark || {
			title: title,
			url: url
		};
		bookmarkObj.createdDate = new Date(bookmarkObj.createdDate);
		bookmarkObj.lastUseDate = new Date(bookmarkObj.lastUseDate);

		//console.log('new bookmark:', bookmarkObj);
		return bookmarkObj;
	};
}]);