/**
 * Created by steven on 24/02/2016.
 */

(function(){
    'use strict';

    var app = angular.module('screenApp');

    app.directive('topNav', function() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/shared/topnav/partial-topnav.html',
            controller: 'TopNavController',
            controllerAs:'vm'
        };
    });
})();

