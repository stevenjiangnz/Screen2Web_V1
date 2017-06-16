/**
 * Created by steven on 7/09/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('AccountHistoryController', AccountHistoryController);

    AccountHistoryController.$inject = ['$scope', '$q', '$state', '$rootScope', 'toaster', '$timeout',
        'utilService', 'dataService', 'shareService', 'tickerService', 'indicatorService', 'tradeService'];

    function AccountHistoryController($scope, $q, $state, $rootScope, toaster, $timeout,
                                  utilService, dataService, shareService, tickerService, indicatorService, tradeService) {


        activate();

        function activate() {
            setItemSize();
        }

        function setItemSize()
        {
            var itemSizeKey = "AccountHistoryItemSize";
            var itemSize = dataService.getFromLocalRepository(itemSizeKey);

            if(itemSize)
            {
                $scope.itemSize = itemSize;
            }
            else
            {
                $scope.itemSize = '100';
                dataService.saveToLocalRepository(itemSizeKey, $scope.itemSize);
            }

            $scope.$watch('itemSize', function (newValue, oldValue) {
                if(newValue)
                {
                    dataService.saveToLocalRepository(itemSizeKey, $scope.itemSize);
                    $scope.showJourneyList($scope.currentAccount.id);
                }
            });
        }

        $scope.showJourneyList = function(accountId){
            utilService.startProgressBar();

            tradeService.getAccountBalanceJourneyList(accountId, $scope.itemSize).then(function (data) {

                $scope.journeyList = data;

                //console.log("journey list, ", data);
                _.each($scope.journeyList, function(j){
                    if(j.orderId)
                    {
                        j.refId="O." + j.orderId;
                    }
                    if(j.transactionId)
                    {
                        j.refId="T." + j.transactionId;
                    }

                });

                utilService.completeProgressBar();
            });
        };

    }
})();
