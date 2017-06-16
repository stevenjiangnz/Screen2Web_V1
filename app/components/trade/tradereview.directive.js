/**
 * Created by steven on 22/10/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('tradeReview', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                currentPosition: '='
            },
            templateUrl: 'app/components/trade/tmp-tradereview.html',
            controller: 'TradeReviewController',
            link: function (scope, element, attrs) {
                scope.$watch('currentPosition', function (newValue, oldValue) {

                    if(newValue)
                    {
                        scope.displayPositionReview(newValue.id);
                    }

                }, true);
            }
        };
    });
})();