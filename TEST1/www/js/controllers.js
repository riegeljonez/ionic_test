angular.module('starter.controllers', [])

/*===========================================================================
  TO DO:
===========================================================================*/

// read the markers positions of the route and use them as centers of geofences
// define a lesson becomes "ready" if youre inside the geofence of the lesson
// define a lesson becomes "active" while the user is inside the lesson material


// abstract categories controller into the router http://learn.ionicframework.com/formulas/data-the-right-way/ ?


/*===========================================================================
  MAIN APP CONTROLLER
===========================================================================*/

.controller('AppCtrl', function() {
})

/*===========================================================================
  CATEGORIES CONTROLLER
===========================================================================*/

.controller('CategoriesCtrl', function($scope, categoriesService) {
	categoriesService.getCategoriesUsedBySeminars().then(function(data) {
		$scope.categories = data;
	}).
	catch (function() {
		$scope.error = 'Sorry! Unable to find the categories.';
	});
})

/*===========================================================================
  CATEGORY CONTROLLER
===========================================================================*/

.controller('CategoryCtrl', function($scope, $stateParams, seminarsByCategoryService, categoriesService) {
	categoriesService.getCatByID($stateParams.categoryID).then(function(data) {
		$scope.category = data;
	});
	seminarsByCategoryService.getSeminars($stateParams).then(function(data) {
		$scope.seminars = data;
	}).
	catch (function() {
		$scope.error = 'Sorry! Unable to find the category.';
	});
})

/*===========================================================================
  SEMINAR CONTROLLER
===========================================================================*/


.controller('SeminarCtrl', function($scope, $state, $stateParams, seminarByUID, $cordovaGeolocation, myMap, mySeminareData) {

	seminarByUID.getSeminar($stateParams.seminarUID).then(function(data) {

		$scope.seminarMeta = data;

		myMap.buildLessonsWaypoints($scope.seminarMeta).then(function(response){

			var drawResult = myMap.drawRoute(response);

			$scope.map = drawResult.mapping;
			$scope.markers = drawResult.marking;
			$scope.lc = myMap.trackMyPosition($scope.map);

      mySeminareData.findOrCreateSeminarData($scope.seminarMeta.seminarUID);


		});
	});

    $scope.start = function() {
        $state.go("app.content");
        console.log('stateChangeStart');
    };

    $scope.openCordovaWebView = function() {
        // Open cordova webview if the url is in the whitelist otherwise opens in app browser


        //window.open('', '_self');

        window.location.href = 'data/testendes-seminar/index.html';
        console.log('windowLocation');

        //window.open('data/testendes-seminar/index.html', '_self');

        /*openCordovaWebView.addEventListener('loadstop', function(event) {
         if (event.url.match("../../app/categories")) {
         openCordovaWebView.close();
         }
         }); */
    };
    $scope.openInAppBrowser = function() {
        // Open in app browser
        //window.open('data/testendes-seminar/index.html', '_blank');
        var ref = window.open('data/testendes-seminar/scorm_test_harness.html', '_self', 'location=yes');
        ref.addEventListener('exit', function(event) { alert(event.url); console.log(ref); });
    };

    $scope.exit = function() {
        $state.go("app.seminar");
        console.log('stateChangeExit');
    };

})


/*===========================================================================
 SEMINARCONTENT CONTROLLER
 ===========================================================================*/

.controller('SeminarContentCtrl', function( $scope, $state) {

    $scope.exit = function() {
        $state.go("app.seminar");
        console.log('stateChangeExitcontent');
    };

})

/*===========================================================================
  TEST-SEMINAR CONTROLLER
===========================================================================*/

.controller('TestendesSeminarCtrl', function($scope) {
	$scope.openInExternalBrowser = function() {
		// Open in external browser
		window.open('data/testendes-seminar/index.html', '_system', 'location=yes');
	};
	$scope.openInAppBrowser = function() {
		// Open in app browser

		var win = window.open('data/testendes-seminar/index.html', '_blank');
	};
	$scope.openCordovaWebView = function() {
		// Open cordova webview if the url is in the whitelist otherwise opens in app browser
		window.open('data/testendes-seminar/index.html', '_self');
/*openCordovaWebView.addEventListener('loadstop', function(event) {
            if (event.url.match("../../app/categories")) {
                openCordovaWebView.close();
            }
        }); */
	};
/*
        var ref = window.open('data/testendes-seminar/index2.html', '_blank');
        ref.addEventListener('loadstop', function(event) {
            if (event.url.match("mobile/close")) {
                ref.close();
            }
        });
*/
})
