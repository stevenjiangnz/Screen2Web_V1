/**
 * Created by steven on 18/06/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('highChart', function () {

        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                options:'=',
                chart:'='
            },
            templateUrl: 'app/shared/chart/partial-high-chart.html',
            controller: 'highChartController',
            link: function (scope, element, attrs) {
                scope.$watch('options', function (newValue, oldValue) {
                    if (newValue) {
                        scope.drawChart(element);
                    }
                });
            }
        };
    });
})();
