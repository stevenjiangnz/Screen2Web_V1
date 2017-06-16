/**
 * Created by steven on 14/08/2016.
 */

(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('analysisAlert', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                currentShare: '=',
                alertUpdated: '&',
                alertCreated: '&',
                alertDeleted: '&'
            },
            templateUrl: 'app/components/analysis/partial-analysis-alert.html',
            controller: 'AnalysisAlertController',
            link: function (scope, element, attrs) {
                scope.$watch('currentShare', function (newValue, oldValue) {
                    if (newValue) {
                        scope.showAlertList();
                    }
                });

            }
        };
    });
})();

