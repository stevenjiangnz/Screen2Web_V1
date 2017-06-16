/**
 * Created by steven on 14/05/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('StockIndicatorController', StockIndicatorController);

    StockIndicatorController.$inject = ['$scope', '$q', '$state', '$rootScope', 'toaster', '$timeout',
        'utilService', 'shareService', 'tickerService', 'indicatorService'];

    function StockIndicatorController($scope, $q, $state, $rootScope, toaster, $timeout,
                                      utilService, shareService, tickerService, indicatorService) {

        activate();

        function activate() {
            //ShowWatchList();
        }

        $scope.displayIndicator = function (input) {
            if (input && input.shareId && input.tradingDate) {
                utilService.startProgressBar();
                indicatorService.getIndicatorByDate(input.shareId, input.tradingDate).then(
                    function (data) {
                        $scope.indicatorDetail = data;
                        utilService.completeProgressBar();
                    }
                );
            }
        };
    }
})();