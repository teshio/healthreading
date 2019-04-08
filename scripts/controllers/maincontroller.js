(function (angular) {
    'use strict';

    var app = angular.module('myApp');

    app.controller('mainController', function ($scope, ReadingService, $location) {
        $scope.$on('loggedin', function () {
            $scope.isLoggedIn = true;
        });

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.classActive = function (viewLocation) {
            return $scope.isActive(viewLocation) ? 'active' : '';
        };

        $scope.logout = function () {
            $scope.isLoggedIn = false;
            ReadingService.logout();
            $location.path('/login');
        };

    });

}(window.angular));