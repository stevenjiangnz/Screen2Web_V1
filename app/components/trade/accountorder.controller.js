/**
 * Created by steven on 7/09/2016.
 */

(function () {
    "use strict";

    angular.module('screenApp')
        .controller('AccountOrderController', AccountOrderController);

    AccountOrderController.$inject = ['$scope', '$q', '$state', '$rootScope', 'toaster', '$timeout',
        'utilService', 'shareService', 'tickerService', 'indicatorService', 'tradeService','ngDialog'];

    function AccountOrderController($scope, $q, $state, $rootScope, toaster, $timeout,
                                    utilService, shareService, tickerService, indicatorService,
                                    tradeService, ngDialog) {
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

            $scope.detailMode = "new";
            $scope.currentOrder = null;
            //showOrders();

            loadShareList();
            loadOrderList();
            loadAccountList();
        }

        $scope.createOrder = function () {
            $scope.detailMode = "new";
            $scope.currentOrder = null;
            $scope.orderFormExpanded = true;
        };

        $scope.updateOrder = function (order) {
            $scope.detailMode = "update";
            $scope.currentOrder = order;
            $scope.orderFormExpanded = true;
        };

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
                utilService.startProgressBar();
                tradeService.deleteOrder(order.id).then(
                    function () {
                        loadOrderList();
                        toaster.success({
                            title: "Order removed success",
                            body: "Successfully removed order " + order.name
                        });
                        utilService.completeProgressBar();
                        $scope.createOrder();
                    }
                );
            }, function (value) {
                //cancelled, do nothing
            });
        };

        $scope.orderUpdated = function (order) {
        };

        $scope.showShareDetails = function (order) {
            $scope.$emit('onShowShareDetails', order.shareId);
        };

        $scope.orderCreated = function (order) {
            $scope.orderList.push(order);
        };

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

        function loadOrderList() {
            utilService.startProgressBar();
            tradeService.getOrderListByAccountStatus(accountId, 'open').then(function (data) {
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
