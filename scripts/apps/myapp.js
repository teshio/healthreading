(function (angular) {
    'use strict';

    var app = angular.module('myApp', ['ngRoute', 'ngSanitize']);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'loginController'
            })
            .when('/readings', {
                templateUrl: 'views/readings.html',
                controller: 'readingController',
                resolve: {}
            })
            .when('/readings/add', {
                templateUrl: 'views/readingForm.html',
                controller: 'readingEditController',
                resolve: {}
            })
            .when('/readings/edit/:id', {
                templateUrl: 'views/readingForm.html',
                controller: 'readingEditController',
                resolve: {}
            })
            .otherwise({
                templateUrl: 'views/home.html'
            });

        $locationProvider.html5Mode(true);
    }]);

}(window.angular));