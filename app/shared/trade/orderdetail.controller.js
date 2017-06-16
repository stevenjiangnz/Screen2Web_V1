/**
 * Created by steven on 12/03/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.controller('OrderDetailController', ['$scope', '$rootScope', 'blockUI', 'toaster', '$timeout',
        'ngProgressFactory', 'utilService', 'shareService', 'tickerService', 'tradeService',
        function ($scope, $rootScope, blockUI, toaster, $timeout, ngProgressFactory,
                  utilService, shareService, tickerService, tradeService) {

            var zoneId = null;
            var accountId = null;

            active();

            function active() {
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

                loadAccountList();

                loadShareList();

                $scope.$watch('localOrder', function (newValue, oldValue) {
                    if ($scope.localOrder)
                        $scope.localOrder.orderType = null;

                    if (newValue) {
                        if (newValue.latestPrice && newValue.orderPrice) {
                            if (newValue.direction === 'Long') {
                                if (newValue.latestPrice < newValue.orderPrice) {
                                    $scope.localOrder.orderType = 'Stop';
                                }
                                else {
                                    $scope.localOrder.orderType = 'Limit';
                                }
                            }
                            if (newValue.direction === 'Short') {
                                if (newValue.latestPrice > newValue.orderPrice) {
                                    $scope.localOrder.orderType = 'Stop';
                                }
                                else {
                                    $scope.localOrder.orderType = 'Limit';
                                }
                            }
                        }
                    }
                }, true);
            }

            function loadAccountList() {
                tradeService.getAccountList(zoneId).then(
                    function (accountList) {
                        $scope.optionAccountList = accountList;
                    }
                );
            }

            function loadShareList() {
                var activeShareList;
                if (!$scope.currentZone) {
                    shareService.getShareList(false).then(function (data) {
                        activeShareList = _.filter(data, function (share) {
                            return share.isActive;
                        });

                        $scope.optionShareList = activeShareList;
                    });
                }
                else {
                    shareService.getShareListByZone($scope.currentZone.id).then(function (data) {
                        activeShareList = _.filter(data, function (share) {
                            return share.isActive;
                        });

                        $scope.optionShareList = activeShareList;
                    });
                }
            }

            $scope.localSearch = function (str, shares) {
                var matches = [];
                shares.forEach(function (share) {
                    var shareDesc = share.name + ' ' + share.symbol;

                    if (shareDesc.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) {
                        matches.push(share);
                    }
                });
                return matches;
            };

            $scope.cancel = function (form) {
                if ($scope.mode == 'new') {
                    $scope.localOrder = {};
                    $scope.localOrder.accountId = accountId;
                    $scope.$broadcast('angucomplete-alt:clearInput');
                    $scope.localOrder.direction="Long";
                    form.$setPristine();
                }
                else{
                    utilService.copyObject($scope.order, $scope.localOrder);
                }
            };

            $scope.submitOrder = function (form) {

                if (customValid()) {
                    if ($scope.mode == 'new') {
                        tradeService.addOrder($scope.localOrder).then(
                            function (newOrder) {
                                toaster.success({
                                    title: "New order created success",
                                    body: "Successfully created new order " + newOrder.id
                                });

                                if ($scope.orderCreated) {
                                    $scope.orderCreated({order: newOrder});
                                }

                                $scope.cancel(form);
                            },
                            function(error)
                            {
                                toaster.error({
                                    title: "New order created failed",
                                    body: error.message
                                });

                            }
                        );
                    }
                    else {
                        tradeService.updateOrder($scope.localOrder).then(
                            function (data) {
                                utilService.copyObject(data, $scope.order);

                                toaster.success({
                                    title: "Order update success",
                                    body: "Successfully updated order " + data.id
                                });
                            },
                            function(error)
                            {
                                toaster.error({
                                    title: "Update order failed",
                                    body: error.message
                                });

                            }
                        );
                    }
                }
            };


            $scope.addShareToScope = function (selected) {
                if (selected) {
                    $scope.selectedShare = selected.originalObject;

                    var zoneId = null;
                    if ($scope.currentZone) {
                        zoneId = $scope.currentZone.id;
                    }

                    if($scope.mode == 'new') {
                        tickerService.getLatestTickerByZone($scope.selectedShare.id, zoneId).then(function (data) {
                            $scope.selectedTicker = data;
                            $scope.localOrder.latestPrice = data.close;
                            $scope.localOrder.latestTradingDate = data.tradingDate;
                            $scope.localOrder.tradingOrderDate = data.tradingDate;
                        });



                        $scope.localOrder.shareId = $scope.selectedShare.id;
                    }

                    tickerService.getNextTickerByZone($scope.selectedShare.id, zoneId).then(function (data) {
                        $scope.localOrder.nextOpen = data.open;
                        $scope.localOrder.nextClose = data.close;
                        $scope.localOrder.nextTradingDate = data.tradingDate;
                    });
                }
                else {
                    $scope.selectedShare = null;
                }
            };

            function customValid() {
                var isValid = true;

                if ($scope.localOrder.direction === "Long") {
                    if ($scope.localOrder.stop && $scope.localOrder.stop >= $scope.localOrder.orderPrice) {
                        toaster.error({
                            title: "Validation Error",
                            body: "For Long, stop should less than the order price."
                        });

                        isValid = false;
                    }

                    if ($scope.localOrder.limit && $scope.localOrder.limit <= $scope.localOrder.orderPrice) {
                        toaster.error({
                            title: "Validation Error",
                            body: "For Long, limit should greater than the order price."
                        });

                        isValid = false;
                    }
                }

                if ($scope.localOrder.direction === "Short") {
                    if ($scope.localOrder.stop && $scope.localOrder.stop <= $scope.localOrder.orderPrice) {
                        toaster.error({
                            title: "Validation Error",
                            body: "For Short, stop should greater than the order price."
                        });

                        isValid = false;
                    }

                    if ($scope.localOrder.limit && $scope.localOrder.limit >= $scope.localOrder.orderPrice) {
                        toaster.error({
                            title: "Validation Error",
                            body: "For Short, limit should less than the order price."
                        });

                        isValid = false;
                    }
                }

                return isValid
            }

            $scope.createOrder = function () {
                $scope.localOrder = {};
                $scope.localOrder.accountId = accountId;
                $scope.localOrder.direction = "Long";
            };

            $scope.updateOrder = function () {
                utilService.copyObject($scope.order, $scope.localOrder);

                var share = _.findWhere($scope.optionShareList, {id: $scope.order.shareId});

                $scope.$broadcast('angucomplete-alt:changeInput', 'inputShare', share);

            };
        }]);
})();
