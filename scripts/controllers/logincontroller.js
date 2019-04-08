(function (angular) {
    'use strict';

    var app = angular.module('myApp');

    app.controller('loginController', function ($scope, $rootScope, $http, $httpParamSerializer, ReadingService, $location) {

        $scope.login = {
            username: '',
            password: ''
        };

        $scope.run = function () {
            $scope.loading = true;
            $http({
                url: 'https://healthreading.azurewebsites.net/Token',
                method: "POST",
                data: $httpParamSerializer({
                    'grant_type': 'password',
                    'username': $scope.login.username,
                    'password': $scope.login.password
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                $scope.login.token = response.data.access_token;
                ReadingService.setToken($scope.login.token);
                $scope.output = $scope.login.token;
                $rootScope.$broadcast('loggedin');
                $location.path('/readings');
                $scope.loading = false;
                console.log(response);
            }, function (response) {
                $scope.loading = false;
                $scope.loginMessage = response.data.error_description;
            });
        };
    });

}(window.angular));