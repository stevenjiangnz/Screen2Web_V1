/**
 * Created by steven on 12/03/2016.
 */

(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('orderDetail', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                order: '=',
                mode: '=',
                orderUpdated: '&',
                orderCreated: '&'
            },
            link: function ($scope, element, attrs) {
                $scope.$watch('mode', function (newValue, oldValue) {
                    if (newValue && newValue == 'new') {
                        $scope.createOrder();
                    }

                });

                $scope.$watch('order', function (newValue, oldValue) {
                    if (newValue && newValue.id >0) {
                        $scope.updateOrder();
                    }
                });

            },
            templateUrl: 'app/shared/trade/partial-orderdetail.html',
            controller: 'OrderDetailController'
        };
    });
})();
