/**
 * Created by steven on 26/02/2016.
 */
(function () {
    'use strict';
    var app = angular.module('screenApp');

    app.factory('userService', ['$http', '$q', '$rootScope', 'appSettings',
        function ($http, $q, $rootScope, appSettings) {
            var userServiceFactory = {};

            var _register = function (userData) {
                var deferred = $q.defer();
                var userObj = {
                    'Email': userData.email,
                    'Username': userData.username,
                    'FirstName': userData.firstName,
                    'LastName': userData.lastName,
                    'Password': userData.password,
                    'ConfirmPassword': userData.password2,
                    'RoleName': 'User'
                };

                var data = JSON.stringify(userObj);

                var config = {
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                };

                $http.post(appSettings.baseServiceUrl + '/api/accounts/create', data, config)
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    }).error(function (err, status) {
                    deferred.reject(err);
                });

                return deferred.promise;
            };


            var _hasPermission = function (requiredPermissions) {
                var hasPermission = false;

                if ($rootScope.authState && $rootScope.authState.isAuthed && $rootScope.authState.authData) {
                    var roles = $rootScope.authState.authData.roles;

                    if (roles) {
                        for (var i = 0; i < requiredPermissions.length; i++) {
                            var reqPerm = requiredPermissions[i];

                            for (var j = 0; j < roles.length; j++) {
                                if (reqPerm == roles[j]) {
                                    hasPermission = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                return hasPermission;
            };

            userServiceFactory.hasPermission = _hasPermission;
            userServiceFactory.register = _register;

            return userServiceFactory;
        }]);


})();