angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('SeminareCtrl', function ($scope) {
        $scope.seminare = [
            {title: 'Mitarbeiter führen', id: 1},
            {title: 'Konfliktmanagement', id: 2},
            {title: 'Seminar Seminar', id: 3},
            {title: 'Beispiel Seminar', id: 4},
            {title: 'Seminar Beispiel', id: 5},
            {title: 'Beispiel Beispiel', id: 6}
        ];
    })

    .controller('SeminarCtrl', function ($scope, $stateParams) {
    })


    /*===========================================================================
     MAP TEST 1
     ===========================================================================*/

    .controller('MapController', function ($scope, $state, $ionicLoading, $cordovaGeolocation, $compile, ConnectivityMonitor) {
        ConnectivityMonitor.startWatching();

        var positionsOptions = {timeout: 10000, enableHighAccuracy: true, maximumAge: 0};

        //Load Geolocation Functions after deviceready:
        ionic.Platform.ready(function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Lade Standort!'
            });

            $cordovaGeolocation.getCurrentPosition(positionsOptions).then(function (position) {

                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var mapOptions = {
                    center: latLng,
                    zoom: 21,
                    mapTypeId: google.maps.MapTypeId.HYBRID,
                    panControl: true,
                    zoomControl: true,
                    mapTypeControl: true,
                    scaleControl: false,
                    streetViewControl: false,
                    navigationControl: true,
                    disableDefaultUI: true,
                    overviewMapControl: true
                };

                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                $ionicLoading.hide();

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: "Sie befinden sich hier!"
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });

            }, function (error) {
                $ionicLoading.hide();
                console.log("Could not get location");
            });
        })
    })

    /*===========================================================================
     MAP TEST 2
     ===========================================================================*/

    .controller('MapControllerZwei', function ($scope, $rootScope, $timeout, GoogleMapsService) {
        // Ideally, this initService should be called on page load and before code below is run

        alert(7);
        ionic.Platform.ready(function () {
            alert($scope);

            $scope.init = function () {
                alert(9);
                GoogleMapsService.initService(document.getElementById("mapzwei"), "AIzaSyD1e_lE3sCS-MA_srsBVUlEKkS4EabQvkY");
                alert(10);
            };
        });

        $scope.journeyLegs = [];
        var journeyLeg = {
            "zipPostalCode": "66045",
            "contactId": "1"
        };
        $scope.journeyLegs.push(journeyLeg);

        // Call this method to add the route
        $scope.addRoute = function (origin, destination) {
            if (origin !== "" && destination !== "") {
                // Callout to Google to get route between first and last contact.
                // The 'legs' between these contact will give us the distance/time
                var waypts = [];
                for (i = 0, len = $scope.journeyLegs.length; i < len; i++) {
                    waypts.push({
                        location: $scope.journeyLegs[i].zipPostalCode,
                        stopover: true
                    });
                }
                GoogleMapsService.addRoute(origin, destination, waypts, true);
            }
        };

        // Handle callback from Google Maps after route has been generated
        var deregisterUpdateDistance = $rootScope.$on('googleRouteCallbackComplete', function (event, args) {
            $scope.updateDistance();
        });

        // We'll add the route after the initService has loaded the Google Maps javascript
        // We're only adding this timeout here because we've called the initService in the code above, and we need to give it time to load the js
        $timeout(function () {
            // Call the method to add the route
            $scope.addRoute("94087", "27215");
        }, 3000);

        // Deregister the handler when scope is destroyed
        $scope.$on('$destroy', function () {
            deregisterUpdateDistance();
        });

        $scope.updateDistance = function () {
            $timeout(function () {
                // Get the route saved after callback from Google directionsService (to get route)
                var routeResponse = GoogleMapsService.getRouteResponse();
                if (routeResponse) {
                    // We’ve only defined one route with waypoints (or legs) along it
                    var route = routeResponse.routes[0];
                    // The following is an example of getting the distance and duration for the last leg of the route
                    var distance = route.legs[route.legs.length - 1].distance;
                    var duration = route.legs[route.legs.length - 1].duration;
                    console.log("distance.value = ", distance.value);
                    console.log("duration.value = ", duration.value);
                    console.log("duration.text = ", duration.text);
                }
            });
        };

    })

    /*===========================================================================
     MAP TEST 3
     ===========================================================================*/

    .controller('MapControllerDrei', function ($scope, $state, $ionicLoading, $cordovaGeolocation, $compile, ConnectivityMonitor, $cordovaSQLite) {
        ConnectivityMonitor.startWatching();

        var positionsOptions = {timeout: 10000, enableHighAccuracy: true, maximumAge: 0};

        //Load Geolocation Functions after deviceready:
        ionic.Platform.ready(function () {
            console.log("Ionic ready");

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Lade Standort!'
            });

            $cordovaGeolocation.getCurrentPosition(positionsOptions).then(function (position) {

                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);


                //latLng = new google.maps.LatLng(48.33414, 10.89334);
                var mapOptions = {
                    center: latLng,
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    panControl: true,
                    zoomControl: true,
                    mapTypeControl: true,
                    scaleControl: false,
                    streetViewControl: false,
                    navigationControl: true,
                    disableDefaultUI: true,
                    overviewMapControl: true
                };


                $scope.map = new google.maps.Map(document.getElementById("mapdrei"), mapOptions);
                $ionicLoading.hide();

                /*
                 var ctaLayer = new google.maps.KmlLayer({
                 url:'http://jonasriegel.de/route_test1.kmz',
                 map:$scope.map

                 });
                 */

                latLngMark1 = new google.maps.LatLng(48.33295, 10.89558);
                latLngMark2 = new google.maps.LatLng(48.33284, 10.89875);
                latLngMark3 = new google.maps.LatLng(48.33431, 10.89822);

                markersLatLng = [latLngMark1, latLngMark2, latLngMark3];

                var markers = new Array();

                for (var i = 0; i < markersLatLng.length; i++) {

                    marker = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: markersLatLng[i]
                    });

                    markers.push(marker);

                }

                console.log($scope.map);

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });

/* WORKS ONLY ON DEVICE
                window.geofence.initialize();

                alert();

                window.geofence.addOrUpdate({
                    id: "start", //A unique identifier of geofence
                    latitude: position.coords.latitude, //Geo latitude of geofence
                    longitude: position.coords.longitude, //Geo longitude of geofence
                    radius: 1000, //Radius of geofence in meters
                    transitionType: 1, //Type of transition 1 - Enter, 2 - Exit, 3 - Both
                    notification: {         //Notification object
                        id: Number, //optional should be integer, id of notification
                        title: "Drin", //Title of notification
                        text: "", //Text of notification
                        smallIcon: "", //Small icon showed in notification area, only res URI
                        icon: "", //icon showed in notification drawer
                        openAppOnClick: true,//is main app activity should be opened after clicking on notification
                        vibration: [Integer], //Optional vibration pattern - see description
                        data: Object  //Custom object associated with notification
                    }
                }).then(function () {
                    console.log('Geofence successfully added');
                }, function (reason) {
                    console.log('Adding geofence failed', reason);
                });

                window.geofence.onTransitionReceived = function (geofences) {
                    geofences.forEach(function (geo) {
                        console.log('Geofence transition detected', geo);
                    });
                };

*/
// https://blog.nraboy.com/2014/11/use-sqlite-instead-local-storage-ionic-framework/
                $scope.insert = function(firstname, lastname) {
                    var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
                    $cordovaSQLite.execute(db, query, [firstname, lastname]).then(function(res) {
                        console.log("INSERT ID -> " + res.insertId);
                    }, function (err) {
                        console.error(err);
                    });
                }

                $scope.select = function(lastname) {
                    var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
                    $cordovaSQLite.execute(db, query, [lastname]).then(function(res) {
                        if(res.rows.length > 0) {
                            console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
                        } else {
                            console.log("No results found");
                        }
                    }, function (err) {
                        console.error(err);
                    });
                }


                var infoWindow = new google.maps.InfoWindow({
                    content: "Sie befinden sich hier!"
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });

            }, function (error) {
                $ionicLoading.hide();
                console.log("Could not get location");
            });
        })
    });