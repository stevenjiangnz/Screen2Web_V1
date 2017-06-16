/**
 * Created by steven on 7/09/2016.
 */

(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('accountLog', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                currentAccount: '='
            },
            templateUrl: 'app/components/trade/tmp-accountlog.html',
            controller: 'AccountLogController',
            link: function (scope, element, attrs) {
                scope.$watch('currentAccount', function (newValue, oldValue) {
                    //scope.displayIndicator(newValue);
                });
            }
        };
    });
})();