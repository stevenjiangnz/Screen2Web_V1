/**
 * Created by steven on 25/02/2016.
 */
(function () {
    'use strict';
    var app = angular.module('screenApp');

    app.factory('authService', ['$http', '$q', '$rootScope', 'dataService', 'jwtHelper', 'appSettings',
        function ($http, $q, $rootScope, dataService, jwtHelper, appSettings) {
            var authServiceFactory = {};
            var _login = function (loginData) {
                var deferred = $q.defer();
                var data = $.param(loginData);

                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };

                $http.post(appSettings.baseServiceUrl + '/oauth/token', data, config)
                    .success(function (data, status, headers, config) {
                        if(status ==200) {
                            var authData = {};
                            authData.username = loginData.username;
                            authData.token = data.access_token;
                            var tokenPayload = jwtHelper.decodeToken(data.access_token);

                            authData.roles = tokenPayload.role;

                            $rootScope.authState = {};
                            $rootScope.authState.isAuthed = true;
                            $rootScope.authState.authData = authData;

                            dataService.saveToLocalRepository("authState", $rootScope.authState);

                            deferred.resolve(data);
                        }
                        else
                        {
                            deferred.reject({
                                'error_description': 'Login error. please check your login and password.'
                            });
                        }
                    }).error(function (err, status) {

                    deferred.reject(err);
                });

                return deferred.promise;
            };

            var _logout = function () {
                $rootScope.authState.isAuthed = false;
                $rootScope.authState.authData = null;
                dataService.clearLocalRepository();
            };

            var _emailConfirm = function(userId, code)
            {
                var deferred = $q.defer();

                $http({
                    method : "GET",
                    url : appSettings.baseServiceUrl + '/api/accounts/ConfirmEmail?userId=' + userId +'&code=' + encodeURIComponent(code)
                }).then(function (response) {
                    deferred.resolve(response);
                }, function (response) {
                    deferred.reject(response);
                });

                return deferred.promise;
            };

            // build return object
            authServiceFactory.login = _login;
            authServiceFactory.logout = _logout;
            authServiceFactory.emailConfirm = _emailConfirm;

            return authServiceFactory;
        }]);
})();
