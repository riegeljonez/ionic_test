angular.module('starter.factories', [])

/*===========================================================================
 FACTORY: FETCHING CATEGORIES FROM JSON
 ===========================================================================*/

.factory('categoriesService', function($http) {

	var getCategoriesUsedBySeminars = function() {

		var categories = [];

		return $http.get('data/allSeminars.json').then(function(response) {
			for (var seminar in response.data.allSeminars) {

				var catID = response.data.allSeminars[seminar].seminarCategoryID;

				getCatByID(catID).then(function(response) {
					var catAlreadyExists = false;

					for (var category in categories) {
						if (categories[category].id == response.id) {
							catAlreadyExists = true;
						}
					}

					if (!catAlreadyExists) {
						categories.push(response);
					}

					return response;
				});
			}

			return categories;
		});
	};

	var getCatByID = function(id) {
		return $http.get('data/categories.json').then(function(response) {

			var categories = response.data;

			for (var category in categories) {
				if (categories[category].id == id) {
					return categories[category];
				}
			}

			return {
				"name": "Sorry! Category not found.",
				"id": -1
			};
		});
	};

	return {
		getCategoriesUsedBySeminars: getCategoriesUsedBySeminars,
		getCatByID: getCatByID
	};

})

/*===========================================================================
 FACTORY: FETCHING SEMINARE BY CATEGORY
 ===========================================================================*/

.factory('seminarsByCategoryService', function($http) {

	var getSeminars = function($stateParams) {
		return $http.get('data/allSeminars.json').then(function(response) {

			var seminars = [];

			var allSeminars = response.data.allSeminars;

			for (var seminar in allSeminars) {
				if (allSeminars[seminar].seminarCategoryID == $stateParams.categoryID) {
					seminars.push(allSeminars[seminar]);
				}
			}

			return seminars;
		});
	};

	return {
		getSeminars: getSeminars
	};

})

/*===========================================================================
 FACTORY: FETCHING SEMINAR BY UID TO GET META FOR LISTING
 ===========================================================================*/

.factory('seminarByUID', function($http) {

	var getSeminar = function(uid) {
		return $http.get('data/allSeminars.json').then(function(response) {



			var allSeminars = response.data.allSeminars;

			for (var seminar in allSeminars) {

				if (allSeminars[seminar].seminarUID == uid) {

					return allSeminars[seminar];
				}
			}

			return {
				"seminarName": "Seminar zur UID nicht gefunden"
			};
		});
	};

  var getLessonsFromSeminar = function(seminarFolder) {

    var articlesUrl = "data/" + seminarFolder + "/course/en/articles.json";

    var lessonPositions = [];

    return $http.get(articlesUrl).then(function(response) {
      return response.data;
    });

  };

	return {
		getSeminar: getSeminar,
    getLessonsFromSeminar: getLessonsFromSeminar
	};

})

/*===========================================================================
 FACTORY: CREATING AND WORKING ON LOCAL SEMINARDATA (SEMINAR PROGRESS ETC...)
 ===========================================================================*/
  .factory('mySeminareData', function($http, $localstorage, seminarByUID) {

    var findOrCreateSeminarData = function(uid){

      var localSeminare = ($localstorage.getObject('seminare'));


      // check if Seminar is already stored in localstorage
      for(var localSeminar in localSeminare){

        if(localSeminare[localSeminar].seminarUID==uid){

          console.log("Found in local");
          return localSeminare[localSeminar];

        }

      }

      // Seminar not found in localstorage, generate entry in localstorage

      localSeminare = [];


      seminarByUID.getSeminar(uid).then(function(seminarData){



        var newLocalSeminar = {"seminarName": seminarData.seminarName,
          "seminarUID":uid,
          "seminarCategoryID": seminarData.seminarCategoryID,
          "seminarLessonsCount": seminarData.seminarLessonsCount,
          "seminarFolder": seminarData.seminarFolder,
          "active": false,
          "finished": false,
          "lessons": []
        };


        // Add lessons to created seminar

        seminarByUID.getLessonsFromSeminar(seminarData.seminarFolder).then(function(lessonData){

          var lessonCounter = 1;

          for(var lesson in lessonData){

            var  curLesson = lessonData[lesson];

            var newLocalLesson = {"lessonName":curLesson.displayTitle ,
              "reihenfolge": lessonCounter,
              "latitude": curLesson.location.lat,
              "longitude": curLesson.location.lng,
              "geofenceUID": curLesson._id,
              "freigeschaltet": false,
              "bearbeitet": false,};

            newLocalSeminar.lessons.push(newLocalLesson);

            lessonCounter++;
          }

          localSeminare.push(newLocalSeminar);

          // Save seminar in localstorage
          console.log("local created");
          console.log(localSeminare);
          $localstorage.setObject("seminare", localSeminare);

        });


      });

    };
    return {
      findOrCreateSeminarData:findOrCreateSeminarData
    };
  })

/*===========================================================================
 FACTORY: CREATING AND INTERACTING WITH LEAFLET MAP
 ===========================================================================*/

.factory('myMap', function($cordovaGeolocation, $http) {

	/*var getDefaultMap = function() {
		return {
			defaults: {
				tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
				maxZoom: 18,
				zoomControlPosition: 'bottomleft'
			},
			center: {
				lat: location.lat,
				lng: location.lng,
				zoom: 12
			},
			markers: [],
			events: {
				map: {
					enable: ['context'],
					logic: 'emit'
				}
			}
		};
	};*/

	var trackMyPosition = function(map) {
		var lc = L.control.locate({
			position: 'topleft',
			// set the location of the control
			layer: new L.LayerGroup(),
			// use your own layer for the location marker
			drawCircle: true,
			// controls whether a circle is drawn that shows the uncertainty about the location
			follow: true,
			// follow the user's location
			setView: false,
			// automatically sets the map view to the user's location, enabled if `follow` is true
			keepCurrentZoomLevel: true,
			// keep the current map zoom level when displaying the user's location. (if `false`, use maxZoom)
			stopFollowingOnDrag: false,
			// stop following when the map is dragged if `follow` is true (deprecated, see below)
			remainActive: false,
			// if true locate control remains active on click even if the user's location is in view.
			markerClass: L.circleMarker,
			// L.circleMarker or L.marker
			circleStyle: {},
			// change the style of the circle around the user's location
			markerStyle: {},
			followCircleStyle: {},
			// set difference for the style of the circle around the user's location while following
			followMarkerStyle: {},
			icon: 'fa fa-map-marker',
			// class for icon, fa-location-arrow or fa-map-marker
			iconLoading: 'fa fa-spinner fa-spin',
			// class for loading icon
			iconElementTag: 'span',
			// tag for the icon element, span or i
			circlePadding: [0, 0],
			// padding around accuracy circle, value is passed to setBounds
			metric: true,
			// use metric or imperial units
			onLocationError: function(err) {
				alert(err.message)
			},
			// define an error callback function
			onLocationOutsideMapBounds: function(context) { // called when outside map boundaries
				alert(context.options.strings.outsideMapBoundsMsg);
			},
			showPopup: true,
			// display a popup when the user click on the inner marker
			strings: {
				title: "Zeig mir wo ich bin",
				// title of the locate control
				metersUnit: "Meter",
				// string for metric units
				feetUnit: "Fuß",
				// string for imperial units
				popup: "Du bist innerhalb von {distance} {unit} von diesem Punkt.",
				// text to appear if user clicks on circle
				outsideMapBoundsMsg: "You seem located outside the boundaries of the map" // default message for onLocationOutsideMapBounds
			},
			locateOptions: {
				enableHighAccuracy: true
			} // define location options e.g enableHighAccuracy: true or maxZoom: 10
		}).addTo(map);

		lc.start();

		return lc;
	}

	var buildLessonsWaypoints = function(seminarMeta) {

		var articlesUrl = "data/" + seminarMeta.seminarFolder + "/course/en/articles.json";

		var lessonPositions = [];

		return $http.get(articlesUrl).then(function(response) {

			for (var lesson in response.data) {

				var lat = response.data[lesson].location.lat;
				var lng = response.data[lesson].location.lng;

				lessonPositions.push({
					latLng: L.latLng(lat, lng)
				});
			}
			return lessonPositions;
		});
	}

	var drawRoute = function(lessonPositions) {

		L.Map = L.Map.extend({
			openPopup: function(popup) {

				//this.closePopup();
				this._popup = popup;

				return this.addLayer(popup).fire('popupopen', {
					popup: this._popup
				});
			}
		});

    

		var map = new L.Map('map', {
			center: [47.618052, 10.710770],
			zoom: 18
		});

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			//options
		}).addTo(map);

		var markers = [];

		var routingControl = L.Routing.control({

			waypoints: lessonPositions,
			draggableWaypoints: false,
			createMarker: function(waypointIndex, waypoint, numberOfWaypoints) {
				var marker = L.marker(waypoint.latLng, {
					title: "Here I am!"
				});

				marker.bindPopup("<b>Hello world!</b><br>I am a popup.");
				markers.push(marker);

				return marker;
			}
		}).addTo(map);

		routingControl.hide();

		return {"mapping": map, "marking": markers};
	}

	return {
		//getDefaultMap: getDefaultMap,
		trackMyPosition: trackMyPosition,
		buildLessonsWaypoints: buildLessonsWaypoints,
		drawRoute: drawRoute
	};
})

/*===========================================================================
FACTORY: CHECKING ON CONNECTIVITY STATES(for Mobile and Desktop):
===========================================================================*/

.factory('ConnectivityMonitor', function($cordovaNetwork, $rootScope, $ionicPopup) {

	$rootScope.showAlert = function() {
		var alertPopup = $ionicPopup.alert({
			title: 'Keine Internetverbindung!',
			template: 'Bitte verbinden Sie ihr Gerät zur Nutzung dieser App mit dem Internet.'
		});
		alertPopup.then(function(res) {
			console.log('Thank you for not eating my delicious ice cream cone');
		});
	};

	return {
		isOnline: function() {
			if (ionic.Platform.isWebView()) {
				return $cordovaNetwork.isOnline();
			} else {
				return navigator.onLine;
			}
		},
		isOffline: function() {
			if (ionic.Platform.isWebView()) {
				return !$cordovaNetwork.isOnline();
			} else {
				return !navigator.onLine;
			}
		},
		startWatching: function() {
			//Checking for mobile device by searching for Cordova WebView
			if (ionic.Platform.isWebView()) {
				$rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
					console.log("went online");
				});
				$rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
					console.log("went offline");
					$rootScope.showAlert();
				});
			}
			//or you are on a desktop browser:
			else {
				window.addEventListener("online", function(e) {
					console.log("went online");
				}, false);
				window.addEventListener("offline", function(e) {
					console.log("went offline");
					$rootScope.showAlert();
				}, false);
			}
		}
	}
})

angular.module('ionic.utils', [])

  .factory('$localstorage', ['$window', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
  }]);
