/**
 * Created by steven on 7/09/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('AccountPositionController', AccountPositionController);

    AccountPositionController.$inject = ['$scope', '$q', '$state', '$rootScope', 'toaster', '$timeout',
        'utilService', 'shareService', 'tickerService', 'indicatorService','tradeService'];

    function AccountPositionController($scope, $q, $state, $rootScope, toaster, $timeout,
                                    utilService, shareService, tickerService, indicatorService,tradeService) {
        var vm = this;
        var zoneId = null;
        var accountId = null;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();
            if ($scope.currentZone) {
                zoneId = $scope.currentZone.id;
            }

            $scope.currentAccount = tradeService.getCurrentAccount();
            if ($scope.currentAccount) {
                accountId = $scope.currentAccount.id;
            }

            loadShareList();
            loadPositionList();
        }

        function loadPositionList() {
            utilService.startProgressBar();
            tradeService.getOutstandingPositionListByAccount(accountId).then(function (data) {
                vm.isloading = false;

                $scope.positionList = data;
                utilService.completeProgressBar();
            });
        }

        function loadShareList() {
            shareService.getShareList(false).then(function (data) {
                $scope.optionShareList = data;
            });
        }

        $scope.editPosition = function(position){
            $scope.currentPosition = {
                id: position.id,
                currentPrice: position.currentPrice,
                size: position.size,
                stop: position.stop,
                limit: position.limit

            };

            var localPos = {};
            utilService.copyObject($scope.currentPosition, localPos);

            $scope.localPosition = localPos;

            $scope.positionDetailEditExpanded = true;

            tickerService.getNextTickerByZone(position.shareId, zoneId).then(function (data) {
                $scope.localPosition.nextOpen = data.open;
                $scope.localPosition.nextClose = data.close;
                $scope.localPosition.nextTradingDate = data.tradingDate;
            });
        };

        $scope.cancelPositionUpdate = function()
        {
            var localPos = {};
            utilService.copyObject($scope.currentPosition, localPos);
            $scope.localPosition = localPos;
        };

        $scope.submitPositionUpdate = function(){

            if(customValid()) {
                tradeService.updatePosition($scope.localPosition).then(function (data) {

                    loadPositionList();

                    toaster.success({
                        title: "Update position success",
                        body: "Successfully update position " + data.id
                    });
                });
            }
        };

        $scope.getShare = function (id) {
            var s = _.where($scope.optionShareList, {id: id});

            if (s && s.length === 1) {
                return s[0];
            }
            else {
                return null;
            }
        };

        function customValid() {
            var isValid = true;

            if ($scope.localPosition.size > 0) {
                if ($scope.localPosition.stop && $scope.localPosition.stop >= $scope.localPosition.currentPrice) {
                    toaster.error({
                        title: "Validation Error",
                        body: "For Long, stop should less than the order price."
                    });

                    isValid = false;
                }

                if ($scope.localPosition.limit && $scope.localPosition.limit <= $scope.localPosition.currentPrice) {
                    toaster.error({
                        title: "Validation Error",
                        body: "For Long, limit should greater than the order price."
                    });

                    isValid = false;
                }
            }

            if ($scope.localPosition.size < 0) {
                if ($scope.localPosition.stop && $scope.localPosition.stop <= $scope.localPosition.currentPrice) {
                    toaster.error({
                        title: "Validation Error",
                        body: "For Short, stop should greater than the order price."
                    });

                    isValid = false;
                }

                if ($scope.localPosition.limit && $scope.localPosition.limit >= $scope.localPosition.currentPrice) {
                    toaster.error({
                        title: "Validation Error",
                        body: "For Short, limit should less than the order price."
                    });

                    isValid = false;
                }
            }

            return isValid
        }
    }
})();