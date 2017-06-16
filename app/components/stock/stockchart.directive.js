/**
 * Created by steven on 16/04/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('stockChart', function () {

        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                setting:'=',
                control:'='
            },
            templateUrl: 'app/components/stock/partial-stock-chart.html',
            controller: 'StockChartController'
            ,
            link: function (scope, element, attrs) {
                scope.$watch('setting', function (newValue, oldValue) {
                    if (newValue && newValue.shareId) {
                        console.log("chart setting", newValue);

                        scope.drawChart(newValue);
                    }
                }, true);
            }
        };
    });
})();