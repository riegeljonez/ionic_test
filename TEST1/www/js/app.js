// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
//Wait until the map is loaded
var db = null;


angular.module('starter', ['ionic', 'ngCordova', 'ngStorage', 'starter.factories', 'leaflet-directive', 'starter.controllers'])


.run(function ($ionicPlatform, $cordovaSQLite) { //https://blog.nraboy.com/2014/11/use-sqlite-instead-local-storage-ionic-framework/
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if (window.cordova) { //http://stackoverflow.com/questions/26101120/how-do-i-use-the-ngcordova-sqlite-service-and-the-cordova-sqliteplugin-with-ioni
            db = $cordovaSQLite.openDB({ name: "my.db", location: 2 }, successcb, errorcb); //device
        }else{
            db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
        }
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
    });
})


.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.search', {
            url: '/search',
            views: {
                'menuContent': {
                    templateUrl: 'templates/search.html'
                }
            }
        })

        .state('app.mapstest', {
            url: '/mapstest',
            views: {
                'menuContent': {
                    templateUrl: 'templates/mapstest.html',
                    controller: 'MapController'
                }
            }
        })

        .state('app.mapstestzwei', {
            url: '/mapstestzwei',
            views: {
                'menuContent': {
                    templateUrl: 'templates/mapstestzwei.html',
                    controller: 'MapControllerZwei'
                }
            }
        })

        .state('app.mapstestdrei', {
            url: '/mapstestdrei',
            views: {
                'menuContent': {
                    templateUrl: 'templates/mapstestdrei.html',
                    controller: 'MapControllerDrei'
                }
            }
        })

       /* .state('app.seminare', {
            url: '/seminare',
            views: {
                'menuContent': {
                    templateUrl: 'templates/seminare.html',
                    controller: 'SeminareCtrl'
                }
            }
        })
*/
        .state('app.testendesSeminar', {
            url: '/testendesSeminar',
            views: {
                'menuContent': {
                    templateUrl: 'templates/testendesSeminar.html',
                    controller: 'TestendesSeminarCtrl'
                }
            }
        })

        .state('app.categories', {
            url: '/categories',
            views: {
                'menuContent': {
                    templateUrl: 'templates/categories.html',
                    controller: 'CategoriesCtrl'
                }
            }
        })

        .state('app.category', {
            url: '/categories/:categoryID',
            views: {
                'menuContent': {
                    templateUrl: 'templates/category.html',
                    controller: 'CategoryCtrl'
                }
            }
        })

        .state('app.seminar', {
            url: '/categories/:categoryId/:seminarUID',
            views: {
                'menuContent': {
                    templateUrl: 'templates/seminar.html',
                    controller: 'SeminarCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/categories');
});


