
sfobApp.controller('popupCtrl', ['$scope', 'bookmarksService', 'windowService', 'utils', 'OrgBookmarks',
                            function($scope, bookmarksService, windowService, utils, OrgBookmarks) {

    const BOOKMARK_OPACITY_MAX = 0.8;
    const BOOKMARK_OLDNESS_MAX = 60;
    const BOOKMARK_OPACITY_FACTOR = BOOKMARK_OLDNESS_MAX / BOOKMARK_OPACITY_MAX;

    windowService.getOrgId().then(function(orgId) {
        //console.log('got orgId from service:', orgId);
        bookmarksService.getBookmarks(orgId).then(function(orgBookmarks) {
            console.log('popupCtrl: stored orgBookmarks:', orgBookmarks);
            $scope.orgBookmarks = orgBookmarks;

            // set opacity
            angular.forEach(orgBookmarks.getAllBookmarks(), function(bookmark) {
                //console.log('lastUseDate:', bookmark.lastUseDate);
                var dayswithoutUse = Math.min(utils.daysUntillNow(bookmark.lastUseDate), BOOKMARK_OLDNESS_MAX);
                bookmark.opacity = 1 - dayswithoutUse / BOOKMARK_OPACITY_FACTOR;
                //console.log('opacity:', dayswithoutUse, '/', BOOKMARK_OPACITY_FACTOR, '=', bookmark.opacity);
            });
            
        });
    });

    $scope.saveChanges = function() {
        bookmarksService.updateBookmarks($scope.orgBookmarks);
    };

    $scope.deleteAllBookmarks = function() {
        $scope.orgBookmarks.groups = [];
        $scope.saveChanges();
    };

    //--------------- Bookmarks methods ----------------------

    $scope.addBookmark = function(group) {
        windowService.getActiveTab().then(function(tab) {
            //utils.log('current tab:', tab);

            // remove salesforce title suffix
            var i = tab.title.indexOf(' ~ ');
            var title = (i > 0 ? tab.title.substring(0, i) : tab.title);

            $scope.orgBookmarks.addBookmark(title, tab.url, group);
            $scope.saveChanges();
            //$scope.$digest();
        });
        //utils.log('addBookmark');
    };

    $scope.deleteBookmark = function(group, bookmark) {
        //console.log('deleteBookmark:', group, bookmark);
        $scope.orgBookmarks.deleteBookmark(group, bookmark);
        $scope.saveChanges();
    };

    $scope.moveBookmark = function(group, bookmark, shift) {
        var success = $scope.orgBookmarks.moveBookmark(group, bookmark, shift);
        if (success) {
            $scope.saveChanges();
        }
    };

    $scope.openBookmark = function(bookmark) {
        //console.log('openBookmark:', bookmark);
        bookmark.open();
        $scope.saveChanges();
    };


    //----------------- Groups methods ---------------------

    $scope.addGroup = function() {
        var group = $scope.orgBookmarks.addGroup();
        group.editMode = true;
        $scope.saveChanges();
    };

    $scope.deleteGroup = function(index) {
        $scope.orgBookmarks.deleteGroup(index);
        $scope.saveChanges();
    };
}]);
