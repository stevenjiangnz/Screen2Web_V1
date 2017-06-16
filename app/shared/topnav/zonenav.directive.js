/**
 * Created by steven on 20/07/2016.
 */


(function(){
    'use strict';

    var app = angular.module('screenApp');

    app.directive('zoneNav', function() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/shared/topnav/partial-zonenav.html',
            controller: 'ZoneNavController'
        };
    });
})();
