
sfobApp.controller('popupCtrl', ['$scope', 'bookmarksService', 'windowService', 'utils', 'OrgBookmarks', '$timeout',
                            function($scope, bookmarksService, windowService, utils, OrgBookmarks, $timeout) {

    const BOOKMARK_OPACITY_MAX = 0.6;
    const BOOKMARK_OPACITY_MIN = 0.4;
    const BOOKMARK_OLDNESS_MAX = 60;
    const BOOKMARK_OPACITY_FACTOR = BOOKMARK_OLDNESS_MAX / BOOKMARK_OPACITY_MAX;
    const ORG_OLDNESS_MAX = 360;
    const ORG_OPACITY_FACTOR = ORG_OLDNESS_MAX / BOOKMARK_OPACITY_MAX;
    const LAST_EXPORT_WARNING_LIMIT = 20;

    $scope.displaySettings = true;

    var loadOrgBookmarks = function(orgId) {
        bookmarksService.getBookmarks(orgId).then(function(orgBookmarks) {
            //console.log('popupCtrl: stored orgBookmarks:', orgBookmarks);
            $scope.orgBookmarks = orgBookmarks;
            if (orgBookmarks.orgId && !orgBookmarks.name) {
                $scope.editOrg = true;
            }

            // set opacity
            angular.forEach(orgBookmarks.getAllBookmarks(), function(bookmark) {
                setOpacity(bookmark);
            });
        });
    };

    windowService.getOrgId().then(function(orgId) {
        //console.log('got orgId from service:', orgId);
        $scope.currentOrgId = orgId;
        loadOrgBookmarks(orgId);
    });

    // check last export date
    bookmarksService.getLastExportDate().then(function(lastExportDate) {
        //console.log('lastExportDate:', lastExportDate);
        if (lastExportDate) {
            $scope.daysFromLastExport = utils.daysUntillNow(lastExportDate);
            $scope.displayLastExportWarning = ($scope.daysFromLastExport > LAST_EXPORT_WARNING_LIMIT);
        } else {
            bookmarksService.setLastExportDateAsNow();
            $scope.daysFromLastExport = '(never)';
        }
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
            let i = tab.title.indexOf(' ~ ');
            if (i < 0) {
                i = tab.title.indexOf(' | ');
            }
            const title = (i > 0 ? tab.title.substring(0, i) : tab.title);

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

    $scope.shiftGroup = function(group, shift) {
        var success = $scope.orgBookmarks.shiftGroup(group, shift);
        if (success) {
            $scope.saveChanges();
        }
    },

    $scope.openBookmark = function(bookmark, inNewTab) {
        //console.log('openBookmark:', bookmark);
        if (inNewTab) {
            bookmark.openInNewTab();
            $scope.saveChanges();
        } else {
            bookmark.open();
        }
        $timeout(function() {
            setOpacity(bookmark);
            $scope.saveChanges();
        }, 500);
        
    };

    function setOpacity(bookmark, maxOldness, factor) {
        //console.log('lastUseDate:', bookmark.lastUseDate, bookmark);
        if (bookmark.lastUseDate) {
            var dayswithoutUse = Math.min(utils.daysUntillNow(bookmark.lastUseDate), (maxOldness || BOOKMARK_OLDNESS_MAX));
            //dayswithoutUse = utils.daysUntillNow(bookmark.lastUseDate);
            bookmark.dayswithoutUse = dayswithoutUse;
            bookmark.opacity = 1 - dayswithoutUse / (factor || BOOKMARK_OPACITY_FACTOR);
        } else {
            bookmark.opacity = 1 - BOOKMARK_OPACITY_MAX;
        }
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

    //----------------- orgs list ---------------------

    $scope.showOrgsList = function() {
        bookmarksService.getAllOrgsBookmarks().then(function(allBookmarks) {
            $scope.orgsList = Object.values(allBookmarks).map(org => ({
                orgId: org.orgId,
                name: org.name,
                lastUseDate: bookmarksService.getLastUseDate(org),
                groups: org.groups
            }));
            $scope.orgsList.forEach(org => {
                setOpacity(org, ORG_OLDNESS_MAX, ORG_OPACITY_FACTOR);
                org.lastUseDateStr = org.lastUseDate ? org.lastUseDate.toLocaleDateString() : "?";
            });
            $scope.displayOrgsList = true;
        });
    };

    $scope.selectOrg = function(org) {
        $scope.currentOrgId = org.orgId;
        loadOrgBookmarks(org.orgId);
        $scope.displayOrgsList = false;
    }

    $scope.deleteOrg = function(orgToDel) {
        if (confirm("Are you sure you want do delete " + orgToDel.name + "?")) {
            bookmarksService.removeOrg(orgToDel.orgId);
            $scope.orgsList = $scope.orgsList.filter(org => org.orgId !== orgToDel.orgId);
        }
    }

    $scope.sortOrgsByName = function() {
        $scope.orgsList.sort((a, b) => (a.name || "").localeCompare(b.name));
    }

    $scope.sortOrgsByDate = function() {
        $scope.orgsList.sort((a, b) => (b.lastUseDate?.toISOString() || "").localeCompare(a.lastUseDate?.toISOString() || ""));
    }

    //----------------- Settings methods ---------------------

    $scope.exportBookmarks = function() {
        bookmarksService.getAllOrgsBookmarks().then(function(allBookmarks) {
            //console.log('allBookmarks:', allBookmarks);
            $scope.bookmarksJson = angular.toJson(allBookmarks);
            bookmarksService.setLastExportDateAsNow();
            $scope.daysFromLastExport = 0;
            $scope.displayLastExportWarning = false;
        });
    };

    $scope.importBookmarks = function() {
        try {
            var orgsData = angular.fromJson($scope.bookmarksJson);
        } catch(ex) {
            $scope.settingsMessage = 'Invalid JSON string';
        }
        if (orgsData) {
            bookmarksService.importOrgsBookmarks(orgsData, $scope.replaceCurrentData).then(function(result) {
                //console.log('done!', result);
                $scope.settingsMessage = 'Imported ' + result.numOrgs + ' orgs (' + result.numNewOrgs + ' new).';
                if ($scope.currentOrgId) {
                    loadOrgBookmarks($scope.currentOrgId);
                }
            });
        }
    };

    $scope.changeSFInstance = function() {
        if ($scope.oldSFInstance && $scope.newSFInstance) {
            $scope.orgBookmarks.changeSFInstance($scope.oldSFInstance, $scope.newSFInstance);
            $scope.saveChanges();
            alert('Instance has been changed for all bookmarks in this org');
        }
    };

    $scope.$watch('displaySettings', function(newValue, oldValue) {
        $scope.settingsMessage = '';
    });

    
}]);
