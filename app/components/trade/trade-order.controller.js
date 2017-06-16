/**
 * Created by steven on 27/06/2016.
 */
(function () {
    "use strict";
    angular.module('screenApp')
        .controller('OrderController', OrderController);

    OrderController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings', 'dataService',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'tradeService', 'ngDialog'];

    function OrderController($scope, $state, $rootScope, toaster, $timeout, appSettings, dataService,
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
            $scope.detailMode = "new";
            loadShareList();
            //loadOrderList();
            loadAccountList();
        }

        $scope.createOrder = function () {
            $scope.detailMode = "new";
            $scope.currentOrder = null;
        };

        $scope.updateOrder = function (order) {
            $scope.detailMode = "update";
            $scope.currentOrder = order;

        };

        function setItemSize()
        {
            var itemSizeKey = "TradeOrderItemSize";
            var itemSize = dataService.getFromLocalRepository(itemSizeKey);

            $scope.$watch('itemSize', function (newValue, oldValue) {
                if(newValue)
                {
                    dataService.saveToLocalRepository(itemSizeKey, $scope.itemSize);
                    loadOrderList();
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

        $scope.removeOrder = function (order) {
            ngDialog.openConfirm({
                template: '<div style="height:100px"><p>Are you sure you want to delete order? <b>' + order.id + '</b>?</p>' +
                '<div class="pull-right">' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)" style="margin-right: 10px">Yes&nbsp;</button>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                '</button></div></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                tradeService.deleteOrder(order.id).then(
                    function () {
                        $scope.orderList.pop(order);
                        toaster.success({
                            title: "Order removed success",
                            body: "Successfully removed order " + order.name
                        });

                        $scope.createOrder();
                    }
                );
            }, function (value) {
                //cancelled, do nothing
            });
        };

        $scope.orderUpdated = function(order)
        {
          //console.log("log order updated. ", order);
        };

        $scope.orderCreated = function(order)
        {
            $scope.orderList.push(order);
        };

        function loadAccountList(){
            tradeService.getAccountList(zoneId).then(
                function (accountList) {
                    console.log("account list", accountList);

                    $scope.optionAccountList = accountList;
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

        function loadOrderList() {
            utilService.startProgressBar();
            tradeService.getOrderListByAccount(accountId, $scope.itemSize).then(function (data) {
                vm.isloading = false;
                $scope.orderList = data;
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