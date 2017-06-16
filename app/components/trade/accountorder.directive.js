/**
 * Created by steven on 7/09/2016.
 */

(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('accountOrder', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                currentAccount: '='
            },
            templateUrl: 'app/components/trade/tmp-accountorder.html',
            controller: 'AccountOrderController',
            link: function (scope, element, attrs) {
                scope.$watch('currentAccount', function (newValue, oldValue) {
                    if(newValue)
                    {
                        //console.log("in account order, current account");
                    }
                });
            }
        };
    });
})();
