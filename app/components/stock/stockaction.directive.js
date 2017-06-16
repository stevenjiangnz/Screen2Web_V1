/**
 * Created by steven on 27/03/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('stockAction', ['$timeout', function ($timeout) {

        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                currentShare:'=',
                tradingDate:'='
            },
            templateUrl: 'app/components/stock/partial-stock-action.html',
            controller: 'StockActionController',
            link: function (scope, element, attrs) {
                scope.$watch('currentShare', function (newValue, oldValue) {
                    if(newValue && newValue.id>0)
                    {
                        scope.getTickerByDate(newValue);

                        scope.getStockInfo(newValue.id);
                    }
                });


            }
        };
    }]);
})();