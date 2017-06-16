/**
 * Created by steven on 12/08/2016.
 */
(function () {
    "use strict";
    angular.module('screenApp')
        .controller('PositionSummaryController', PositionSummaryController);

    PositionSummaryController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings', 'dataService',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'tradeService', 'ngDialog'];

    function PositionSummaryController($scope, $state, $rootScope, toaster, $timeout, appSettings, dataService,
                             utilService, shareService, tickerService, analysisService, tradeService, ngDialog) {
        var vm = this;
        var zoneId = null;
        var accountId = null;

        activate();

        function activate() {
            setItemSize();

            $scope.currentZone = tradeService.getCurrentZone();
            if($scope.currentZone)
            {
                zoneId = $scope.currentZone.id;
            }

            $scope.currentAccount = tradeService.getCurrentAccount();
            if($scope.currentAccount)
            {
                accountId = $scope.currentAccount.id;
            }

            vm.isloading = true;

            loadShareList();
            //loadPositionSummaryList();
        }

        function setItemSize()
        {
            var itemSizeKey = "TradeTransactionItemSize";
            var itemSize = dataService.getFromLocalRepository(itemSizeKey);

            $scope.$watch('itemSize', function (newValue, oldValue) {
                if(newValue)
                {
                    dataService.saveToLocalRepository(itemSizeKey, $scope.itemSize);
                    loadPositionSummaryList();
                }
            });

            if(itemSize)
            {
                $scope.itemSize = itemSize;
            }
            else
            {
                $scope.itemSize = '100';
                dataService.saveToLocalRepository(itemSizeKey, $scope.itemSize);
            }
        }

        function loadPositionSummaryList(){
            utilService.startProgressBar();

            tradeService.getPositionSummaryListByAccount(accountId, $scope.itemSize).then(
                function (positionList) {
                    vm.isloading = false;
                    $scope.positionList = positionList;
                    utilService.completeProgressBar();
                }
            );
        }

        $scope.displayPositionDetails = function(position)
        {
            $scope.currentPosition = position;

            console.log("position ", position);

            showEntryTransaction(position.entryTransactionId);

            if(position.exitTransactionId)
            {
                showExitTransaction(position.exitTransactionId);
            }
            else
            {
                $scope.exitTransaction =null;
            }
        };

        function showEntryTransaction(transactionId)
        {
            tradeService.getTransactionById(transactionId).then(
                function (trans) {
                    $scope.entryTransaction = trans;
                }
            );
        }

        function showExitTransaction(transactionId)
        {
            tradeService.getTransactionById(transactionId).then(
                function (trans) {
                    $scope.exitTransaction = trans;
                }
            );
        }

        $scope.getShare = function(id)
        {
            var s = _.where($scope.optionShareList, {id:id});

            if(s && s.length ===1)
            {
                return s[0];
            }
            else
            {
                return null;
            }
        };

        $scope.getAccount = function(id)
        {
            var s = _.where($scope.optionAccountList, {id:id});

            if(s && s.length ===1)
            {
                return s[0];
            }
            else
            {
                return null;
            }
        };


        function loadShareList() {
            shareService.getShareList(false).then(function (data) {
                $scope.optionShareList = data;
            });
        }
    }
})();