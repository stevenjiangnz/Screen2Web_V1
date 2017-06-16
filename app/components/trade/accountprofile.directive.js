/**
 * Created by steven on 7/09/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('accountProfile', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                currentAccount: '='
            },
            templateUrl: 'app/components/trade/tmp-accountprofile.html',
            controller: 'AccountProfileController',
            link: function (scope, element, attrs) {
                scope.$watch('currentAccount', function (newValue, oldValue) {
                    //scope.displayIndicator(newValue);
                }, true);
            }
        };
    });
})();