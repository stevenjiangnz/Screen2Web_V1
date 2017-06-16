/**
 * Created by steven on 25/02/2016.
 */
(function () {
    "use strict";

    var app= angular.module('screenApp');

    app.controller('TopNavController', ['$scope','$rootScope', '$state', 'authService', '$timeout', TopNavController]);

    function TopNavController($scope, $rootScope, $state,  authService, $timeout){
        var vm = this;

        vm.logout = function(){

            authService.logout();

            $timeout(function() { $state.go('login'); });
        };

        $rootScope.$on('unauthorized', function() {
           vm.logout();
        });
    }

})();