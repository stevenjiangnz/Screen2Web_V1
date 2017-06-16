/**
 * Created by steven on 18/06/2016.
 */
(function () {
    'use strict';
    var app = angular.module('screenApp');

    app.controller('highChartController', ['$scope', '$rootScope', 'blockUI', 'toaster', '$timeout',
        'utilService', 'shareService',
        function ($scope, $rootScope, blockUI, toaster, $timeout, utilService, shareService) {

            $scope.drawChart = drawChart;
            activate();
            function activate() {
            }

            function drawChart(element) {
                Highcharts.chart(element[0], $scope.options);
                    $scope.chart = element.highcharts();
                    $scope.chart.reflow();
            }
        }]);


})();