/**
 * Created by steven on 19/03/2016.
 */
(function () {
    'use strict';
    var app = angular.module('screenApp');

    app.controller('screenChartController', ['$scope', '$rootScope', 'blockUI', 'toaster', '$timeout',
        'utilService', 'shareService',
        function ($scope, $rootScope, blockUI, toaster, $timeout, utilService, shareService) {

            $scope.drawChart = drawChart;
            activate();
            function activate() {
            }

            function drawChart(element) {
                $timeout(function () {
                    $scope.options.chart = {renderTo: element[0],
                        height: $scope.options.height};

                    $scope.chart = new Highcharts.StockChart($scope.options);
                });

            }
        }]);


})();