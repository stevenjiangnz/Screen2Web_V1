/**
 * Created by steven on 14/05/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('stockWatch', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                currentShare:'='
            },
            templateUrl: 'app/components/stock/partial-stock-watch.html',
            controller: 'StockWatchController',
            link: function (scope, element, attrs) {
                scope.$watch('currentShare', function (newValue, oldValue) {
                    if(newValue && newValue.id>0)
                    {
                        scope.ShowWatchList();
                    }
                });

            }

        };
    });
})();