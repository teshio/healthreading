(function(angular) {
  'use strict';

  var app = angular.module('myApp', ['ngRoute', 'ngSanitize']);

  app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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


  app.factory('ReadingService', function($http) {
    return {
      setToken: function(token) {
        this.token = token;
      },
      getReadings: function(onSuccess) {

        if (this.token && this.token.length > 0) {
          $http({
              url: 'https://healthreading.azurewebsites.net/api/readings/',
              method: "GET",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + this.token
              }
            })
            .then(onSuccess);
        } else {
          onSuccess();
        }

      },
      logout: function() {
        this.token = null;
      }

    }
  });

  app.controller('readingEditController', function($scope, $http, $httpParamSerializer, ReadingService, $route, $location, $routeParams) {
    //var readingId = $routeParams.id;
    //console.log('id:' + readingId);
  });


  app.controller('mainController', function($scope, $http, $httpParamSerializer, ReadingService, $route, $location, $routeParams) {
    $scope.$on('loggedin', function() {
      $scope.isLoggedIn = true;
    });

    $scope.isActive = function(viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.classActive = function(viewLocation) {
      return $scope.isActive(viewLocation) ? 'active' : '';
    }

    $scope.logout = function() {
      $scope.isLoggedIn = false;
      ReadingService.logout();
      $location.path('/login');
    };

  });

  app.controller('readingController', function($scope, $http, $httpParamSerializer, ReadingService) {
    var initialise = function() {
      ReadingService.getReadings(function(data) {
        console.log(data.data);
        $scope.data = data.data;
      });
    };
    $scope.$on('loggedin', initialise);

    $scope.deleteReading = function(reading) {
      var data = $scope.data;
      $scope.data = data.filter(function(value, index, arr) {
        return value.id != reading.id;
      });
    }

    $scope.editReading = function(reading) {

      $('#readingDialog').modal();
      reading.readingDate = null;
      $scope.reading = reading;
      $rootScope.reading = reading;
      window.setTimeout(2000, function(){

      });
/*
      $uibModal.open({
        templateUrl: 'views/readingForm.html',
        controller: function($scope) {
          debugger;
        }
      });*/
      //$scope.reading = reading;

    }

    initialise();

  });

  app.controller('loginController', function($scope, $rootScope, $http, $httpParamSerializer, ReadingService, $location) {

    $scope.login = {
      username: '',
      password: ''
    };

    $scope.run = function() {
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
        })
        .then(function(response) {
            $scope.login.token = response.data.access_token;
            ReadingService.setToken($scope.login.token);
            $scope.output = $scope.login.token;
            $rootScope.$broadcast('loggedin');
            $location.path('/readings');
            $scope.loading = false;
          },
          function(response) { // optional
            console.log(response);
            $scope.loading = false;
            $scope.loginMessage = response.data.error_description;
          });
    }
  });

})(window.angular);
