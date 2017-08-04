sfobApp.factory('utils',['$q', function($q) {

	const DAY_MILISECONDS = 24*60*60*1000;

	var logHandlers = [];

	return {
        log: function(message, param1, param2, param3) {
        	console.log(message, param1, param2, param3);
        	logMsg = message + (param1 ? ' ' + param1 : '') + (param2 ? ' ' + param2 : '') + (param3 ? ' ' + param3 : '');
        	angular.forEach(logHandlers, function(logHandler) {
        		logHandler(logMsg);
        	})
		},

		addLogHandler: function(logHandler) {
			logHandlers.push(logHandler);
		},

		switchItems: function(array, index1, index2) {
			if (index1 >= 0 && index1 < array.length && index2 >= 0 && index2 < array.length) {
	            var item1 = array[index1];
	            var item2 = array[index2];
	            array[index2] = null;	// to avoid duplicates in ng-repeat
	            array[index1] = item2;
	            array[index2] = item1;
	            return true;
	        }
	        return false;
		},

		removeEmptyItems: function(array) {
			var newArray = [];
			angular.forEach(array, function(item) {
				if (item) {
					newArray.push(item);
				}
			});
			return newArray;
		},

		daysBetween: function(date1, date2) {
			return Math.round(Math.abs((date1.getTime() - date2.getTime())/(DAY_MILISECONDS))); 
		},

		daysUntillNow: function(date) {
			var now = new Date();
			return this.daysBetween(date, now);
		},

		arrayToMap: function(array, field) {
			var map = {};
			angular.forEach(array, function(item) {
				var key = item[field];
				map[key] = item;
			});
			return map;
		},
		/*getValues: function(array, field) {
			var values = [];
			angular.forEach(array, function(item) {
				values.push(item[field]);
			});
			return values;
		}*/

	};
}]);