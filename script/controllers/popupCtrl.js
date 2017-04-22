
sfobApp.controller('popupCtrl', ['$scope', 'bookmarksService', 'windowService', 'utils', 'OrgBookmarks',
                            function($scope, bookmarksService, windowService, utils, OrgBookmarks) {

    windowService.getOrgId().then(function(orgId) {
        //console.log('got orgId from service:', orgId);
        bookmarksService.getBookmarks(orgId).then(function(orgBookmarks) {
            //console.log('popupCtrl: stored orgBookmarks:', orgBookmarks);
            $scope.orgBookmarks = orgBookmarks;
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

    $scope.addBookmark = function() {
        windowService.getActiveTab().then(function(tab) {
            //utils.log('current tab:', tab);

            // remove salesforce title suffix
            var i = tab.title.indexOf(' ~ ');
            var title = (i > 0 ? tab.title.substring(0, i) : tab.title);

            $scope.orgBookmarks.addBookmark(title, tab.url);
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

    $scope.openUrl = function(url) {
        windowService.navigateTo(url);
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