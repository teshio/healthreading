(function (angular, moment) {
    'use strict';

    var app = angular.module('myApp');

    app.factory('ReadingService', function ($http, $q) {
        return {
            setToken: function (token) {
                this.token = token;
            },
            getReadings: function (onSuccess) {

                if (this.token && this.token.length > 0) {
                    $http({
                        url: 'https://healthreading.azurewebsites.net/api/readings/',
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + this.token
                        }
                    }).then(onSuccess);
                } else {
                    onSuccess();
                }

            },
            saveReading: function (reading) {
                var token = this.token;
                return $q(function (resolve, reject) {
                    $http({
                        url: 'https://healthreading.azurewebsites.net/api/reading/',
                        method: reading.id > 0 ? 'PUT' : 'POST',
                        data: reading,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + token
                        }
                    }).then(function () {
                        reading.readingDate = moment(reading.readingDate).format('YYYY-MM-DDTHH:mm:ss');
                        resolve(reading);
                    }, reject);
                });
            },
            logout: function () {
                this.token = null;
            }

        };
    });

}(window.angular, moment));