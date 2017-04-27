sfobApp.factory('Bookmark',['$q', 'utils', 'windowService', function($q, utils, windowService) {

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
		bookmarkObj.createdDate = (bookmarkObj.createdDate ? new Date(bookmarkObj.createdDate) : new Date());
		bookmarkObj.lastUseDate = (bookmarkObj.lastUseDate ? new Date(bookmarkObj.lastUseDate) : new Date());

		bookmarkObj.open = function() {
			bookmark.lastUseDate = new Date();
			windowService.navigateTo(this.url);
		};

		console.log('new bookmark:', bookmarkObj);
		return bookmarkObj;
	};
}]);