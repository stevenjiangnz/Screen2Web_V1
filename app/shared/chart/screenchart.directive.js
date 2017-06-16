/**
 * Created by steven on 19/03/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('screenChart', function () {

        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                options:'=',
                chart:'='
            },
            templateUrl: 'app/shared/chart/partial-screen-chart.html',
            controller: 'screenChartController',
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