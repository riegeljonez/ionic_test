angular.module('starter', ['ionic', 'ngCordova', 'ngStorage', 'starter.factories', 'leaflet-directive', 'starter.controllers'])

.run(function ($ionicPlatform) {
	$ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
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
        })

        .state('app.content', {
            //url: '/categories/:categoryId/:seminarUID/:seminarFolder',
            views: {
                'menuContent': {
                    templateUrl: 'data/testendes-seminar/index.html',
                    controller: 'SeminarContentCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/categories');
});


