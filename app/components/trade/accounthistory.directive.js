/**
 * Created by steven on 7/09/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('accountHistory', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                currentAccount: '='
            },
            templateUrl: 'app/components/trade/tmp-accounthistory.html',
            controller: 'AccountHistoryController',
            link: function (scope, element, attrs) {
                scope.$watch('currentAccount', function (newValue, oldValue) {
                    if(newValue)
                    {
                        //scope.showJourneyList(newValue.id);
                    }
                });
            }
        };
    });
})();