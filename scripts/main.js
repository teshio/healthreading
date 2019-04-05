var app = angular.module('myApp', []);

app.factory('ReadingService', function($http) {
  return {
    setToken: function(token) {
      this.token = token;
    },
    getReadings: function(onSuccess) {

      $http({
        url: 'https://healthreading.azurewebsites.net/api/readings/',
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'bearer ' + this.token
        }
      })
      .then(onSuccess);

    }
  }
});

app.controller('readingController', function($scope, $http, $httpParamSerializer, ReadingService) {
  var initialise = function() {
    ReadingService.getReadings(function(data) {
      console.log(data.data);
      $scope.data = data.data;
    });
  };
  $scope.$on('loggedin', initialise);
});

app.controller('loginController', function($scope, $rootScope, $http, $httpParamSerializer, ReadingService) {
  $scope.test = "hi"
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
          'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
        }
      })
      .then(function(response) {
          $scope.login.token = response.data.access_token;
          ReadingService.setToken($scope.login.token);
          $scope.output = $scope.login.token;
          $rootScope.$broadcast('loggedin');
          $scope.loading = false;
        },
        function(response) { // optional
          console.log(response);
          $scope.loading = false;
          $scope.loginMessage = response.data.error_description;
        });
  }
});
