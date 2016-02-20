angular.module('starter.factories', [])

/*===========================================================================
 FACTORY FOR FETCHING CATEGORIES FROM JSON
 ===========================================================================*/


.factory('categoriesService', function($http) {
    var getCategoriesUsedBySeminare = function() {
        return $http.get('data/alleSeminare.json').then(function (response) {


            var categories= [];

            for (var seminar in response.data.alleSeminare ){

                var catID = response.data.alleSeminare[seminar].seminarKategorieID;
                console.log(catID);
                var catAlreadyExists = false;

                var catObj;
                getCatByID(catID).then(function(data) {
                    console.log(data);
                    catObj = data;

                });
                console.log(catObj);

                for (var category in categories){

                    if(categories[category].uid == catID ){
                        catAlreadyExists = true;
                    }
                }
                if(!catAlreadyExists){

                    categories.push(catObj);
                }
            }

            return categories;
        });
    };

    var getCatByID = function(id) {
        return $http.get('data/categories.json').then(function (response) {

            var kategorien = response.data;

            for(var kategorie in kategorien){
                if (kategorien[kategorie].uid==id){

                    return kategorien[kategorie];
                }
            }

            return {"name": "Kategorie nicht gefunden", "id": -1};

        });
    };
    return {
        getCategoriesUsedBySeminare: getCategoriesUsedBySeminare,
        getCatByID: function() {getCatByID(id);}
    };
})

/*===========================================================================
 FACTORY FOR FETCHING SEMINARE BY CATEGORY
 ===========================================================================*/


.factory('seminareByCategoryService', function($http) {
        var getSeminare = function($stateParams) {
            return $http.get('data/alleSeminare.json').then(function (response) {

                var seminare = [];
                var alleSeminare = response.data.alleSeminare;

                for (var seminar in alleSeminare ){
                    if (alleSeminare[seminar].seminarKategorie == $stateParams.categoryName){
                        seminare.push(alleSeminare[seminar]);
                    }
                }
                return seminare;
            });
        };
        return {
            getSeminare: getSeminare
        };
    })

/*===========================================================================
 FACTORY FOR FETCHING SEMINAR BY NAME
 ===========================================================================*/


.factory('seminarByName', function($http) {
    var getSeminare = function($stateParams) {
        return $http.get('data/alleSeminare.json').then(function (response) {

            var seminare = [];
            var alleSeminare = response.data.alleSeminare;

            for (var seminar in alleSeminare ){
                if (alleSeminare[seminar].seminarKategorie == $stateParams.categoryName){
                    seminare.push(alleSeminare[seminar]);
                }
            }
            return seminare;
        });
    };
    return {
        getSeminare: getSeminare
    };
})
/*===========================================================================
FACTORY FOR CHECKING ON CONNECTIVITY STATES(for Mobile and Desktop):
===========================================================================*/

.factory('ConnectivityMonitor', function ($cordovaNetwork, $rootScope, $ionicPopup) {

    $rootScope.showAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Keine Internetverbindung!',
            template: 'Bitte verbinden Sie ihr Gerät zur Nutzung dieser App mit dem Internet.'
        });
        alertPopup.then(function (res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };

    return {
        isOnline: function () {
            if (ionic.Platform.isWebView()) {
                return $cordovaNetwork.isOnline();
            } else {
                return navigator.onLine;
            }
        },
        isOffline: function () {

            if (ionic.Platform.isWebView()) {
                return !$cordovaNetwork.isOnline();
            } else {
                return !navigator.onLine;
            }
        },
        startWatching: function () {
            //Checking for mobile device by searching for Cordova WebView
            if (ionic.Platform.isWebView()) {

                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    console.log("went online");
                });

                $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    console.log("went offline");
                    $rootScope.showAlert();
                });

            }
            //or you are on a desktop browser:
            else {

                window.addEventListener("online", function (e) {
                    console.log("went online");
                }, false);

                window.addEventListener("offline", function (e) {
                    console.log("went offline");
                    $rootScope.showAlert();
                }, false);
            }
        }
    }

})

/*===========================================================================
 FACTORY FOR GOOGLE MAPS
 ===========================================================================*/

.factory('GoogleMapsService', ['$rootScope', '$ionicLoading', '$timeout', '$window', '$document', 'ConnectivityService', function($rootScope, $ionicLoading, $timeout, $window, $document, ConnectivityService) {

    var apiKey = null;
    var    map = null;
    var    mapDiv = null;
    var    directionsService;
        var   directionsDisplay;
        var routeResponse;

    function initService(mapEl, key) {
        alert(6);
        mapDiv = mapEl;
        if (typeof key !== "undefined") {
            apiKey = key;
        }
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
            disableMap();
            if (ConnectivityService.isOnline()) {
                $timeout(function() {
                    loadGoogleMaps();
                }, 0);
            }
        } else {
            if (ConnectivityService.isOnline()) {
                initMap();
                enableMap();
            } else {
                disableMap();
            }
        }
    }

    function initMap() {
        alert(1);
        if (mapDiv) {
            var mapOptions = {
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(mapDiv, mapOptions);
            alert(2);
            directionsService = new google.maps.DirectionsService();
            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            // Wait until the map is loaded
            google.maps.event.addListenerOnce(map, 'idle', function() {
                enableMap();
            });
        }
    }

    function enableMap() {
        // For demonstration purposes we’ll use a $rootScope variable to enable/disable the map.
        // However, an alternative option would be to broadcast an event and handle it in the controller.
        $rootScope.enableMap = true;
    }

    function disableMap() {
        $rootScope.enableMap = false;
    }

    function loadGoogleMaps() {
        // This function will be called once the SDK has been loaded
        $window.mapInit = function() {
            initMap();
        };

        // Create a script element to insert into the page
        var script = $document[0].createElement("script");
        script.type = "text/javascript";
        script.id = "googleMaps";

        // Note the callback function in the URL is the one we created above
        if (apiKey) {
            script.src = 'https://maps.google.com/maps/api/js?key=' + apiKey + '&sensor=true&callback=mapInit';
        } else {
            script.src = 'https://maps.google.com/maps/api/js?sensor=true&callback=mapInit';
        }
        $document[0].body.appendChild(script);
    }

    function checkLoaded() {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
            $timeout(function() {
                loadGoogleMaps();
            }, 2000);
        } else {
            enableMap();
        }
    }

    function addRoute(origin, destination, waypts, optimizeWaypts) {
        routeResponse = null;
        if (typeof google !== "undefined") {
            var routeRequest = {
                origin: origin,
                destination: destination,
                waypoints: waypts,
                optimizeWaypoints: optimizeWaypts,
                travelMode: google.maps.TravelMode.WALKING
            };
            alert(directionsService);
            directionsService.route(routeRequest, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    google.maps.event.trigger(map, 'resize');
                    // Save the response so we access it from controller
                    routeResponse = response;
                    // Broadcast event so controller can process the route response
                    $rootScope.$broadcast('googleRouteCallbackComplete');
                }
            });
        }
    }

    function removeRoute() {
        if (typeof google !== "undefined" && typeof directionsDisplay !== "undefined") {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
        }
    }

    return {
        initService: function(mapEl, key) {
            initService(mapEl, key);
        },
        checkLoaded: function() {
            checkLoaded();
        },
        disableMap: function() {
            disableMap();
        },
        removeRoute: function() {
            removeRoute();
        },
        getRouteResponse: function() {
            return routeResponse;
        },
        addRoute: function(origin, destination, waypts, optimizeWaypts) {
            addRoute(origin, destination, waypts, optimizeWaypts);
        }
    };

}])

/*===========================================================================
 ===========================================================================*/

.factory('ConnectivityService', [function() {
    return {
        isOnline: function() {
            var status = localStorage.getItem('networkStatus');
            if (status === null || status == "online") {
                return true;
            } else {
                return false;
            }
        }
    };
}])

/*===========================================================================
 ===========================================================================*/

.factory('NetworkService', ['GoogleMapsService', function(GoogleMapsService) {
    /*
     * handles network events (online/offline)
     */
    return {
        networkEvent: function(status) {
            var pastStatus = localStorage.getItem('networkStatus');
            if (status == "online" && pastStatus != status) {
                // The app has regained connectivity...
                GoogleMapsService.checkLoaded();
            }
            if (status == "offline" && pastStatus != status) {
                // The app has lost connectivity...
                GoogleMapsService.disableMap();
            }
            localStorage.setItem('networkStatus', status);
            return true;
        }
    };
}]);

