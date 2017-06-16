/**
 * Created by steven on 24/02/2016.
 */

(function(){
    'use strict';

    var app = angular.module('screenApp');

    app.directive('footer', function() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/shared/footer/partial-footer.html'
        };
    });
})();
