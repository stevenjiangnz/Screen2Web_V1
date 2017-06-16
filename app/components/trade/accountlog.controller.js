/**
 * Created by steven on 7/09/2016.
 */

(function () {
    "use strict";

    angular.module('screenApp')
        .controller('AccountLogController', AccountLogController);

    AccountLogController.$inject = ['$scope', '$q', '$state', '$rootScope', 'toaster', '$timeout',
        'utilService', 'dataService', 'shareService', 'tickerService', 'indicatorService', 'tradeService'];

    function AccountLogController($scope, $q, $state, $rootScope, toaster, $timeout,
                                    utilService, dataService, shareService, tickerService, indicatorService,tradeService) {

        var vm = this;
        var zoneId = null;
        var accountId = null;

        activate();

        function activate() {
            setItemSize();

            $scope.currentZone = tradeService.getCurrentZone();
            if ($scope.currentZone) {
                zoneId = $scope.currentZone.id;
            }

            $scope.currentAccount = tradeService.getCurrentAccount();
            if ($scope.currentAccount) {
                accountId = $scope.currentAccount.id;
            }

            loadShareList();
            loadAccountList();
        }

        function setItemSize()
        {
            var itemSizeKey = "AccountLogItemSize";
            var itemSize = dataService.getFromLocalRepository(itemSizeKey);

            $scope.$watch('itemSize', function (newValue, oldValue) {
                if(newValue)
                {
                    dataService.saveToLocalRepository(itemSizeKey, $scope.itemSize);

                    loadTransactionList();
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

        function loadAccountList() {
            tradeService.getAccountList(zoneId).then(
                function (accountList) {
                    $scope.optionAccountList = accountList;
                }
            );
        }

        $scope.getShare = function (id) {
            var s = _.where($scope.optionShareList, {id: id});

            if (s && s.length === 1) {
                return s[0];
            }
            else {
                return null;
            }
        };

        $scope.getAccount = function (id) {
            var s = _.where($scope.optionAccountList, {id: id});

            if (s && s.length === 1) {
                return s[0];
            }
            else {
                return null;
            }
        };

        function loadTransactionList() {
            utilService.startProgressBar();
            tradeService.getTransactionListByAccount(accountId, $scope.itemSize).then(function (data) {
                vm.isloading = false;

                $scope.transactionList = data;

                utilService.completeProgressBar();
            });
        }

        function loadShareList() {
            shareService.getShareList(false).then(function (data) {
                $scope.optionShareList = data;
            });
        }
    }
})();
