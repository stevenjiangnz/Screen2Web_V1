/**
 * Created by steven on 23/05/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('stockIndicator', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                indicatorInput: '='
            },
            templateUrl: 'app/components/stock/partial-stock-indicator.html',
            controller: 'StockIndicatorController',
            link: function (scope, element, attrs) {
                scope.$watch('indicatorInput', function (newValue, oldValue) {
                    scope.displayIndicator(newValue);
                }, true);
            }
        };
    });
})();