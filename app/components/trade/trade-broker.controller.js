/**
 * Created by steven on 27/06/2016.
 */
(function () {
    "use strict";
    angular.module('screenApp')
        .controller('BrokerController', BrokerController);

    BrokerController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings', 'dataService',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'tradeService', 'ngDialog'];

    function BrokerController($scope, $state, $rootScope, toaster, $timeout, appSettings, dataService,
                              utilService, shareService, tickerService, analysisService, tradeService, ngDialog) {
        var vm = this;

        activate();

        function activate() {
            vm.isloading = true;
            $scope.detailMode = "new";
            loadBrokerList();

        }

        $scope.createBroker = function () {
            $scope.detailMode = "new";
            $scope.localBroker = null;
        };

        $scope.updateBroker = function (broker) {
            $scope.detailMode = "update";
            $scope.currentBroker = broker;
            $scope.localBroker = angular.copy(broker);
        };

        $scope.removeBroker = function (broker) {
            ngDialog.openConfirm({
                template: '<div style="height:100px"><p>Are you sure you want to delete account? <b>' + broker.id + '</b>?</p>' +
                '<div class="pull-right">' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)" style="margin-right: 10px">Yes&nbsp;</button>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                '</button></div></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                tradeService.deleteBroker(broker.id).then(
                    function () {
                        $scope.brokerList.pop(broker);

                        toaster.success({
                            title: "Broker removed success",
                            body: "Successfully removed broker " + broker.name
                        });

                        $scope.createBroker();
                    }
                );
            }, function (value) {
                //cancelled, do nothing
            });
        };

        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localBroker = null;
                form.$setPristine();
            }
            else {
                $scope.localBroker = $scope.currentBroker;
            }

        };

        $scope.submitBroker = function (form) {
            if ($scope.detailMode == 'new') {
                tradeService.addBroker($scope.localBroker).then(
                    function (newBroker) {
                        $scope.brokerList.push(newBroker);

                        toaster.success({
                            title: "New broker created success",
                            body: "Successfully created new broker " + newBroker.name
                        });

                        $scope.cancel(form);
                    }
                );
            }
            else {
                tradeService.updateBroker($scope.localBroker).then(
                    function (data) {
                        utilService.copyObject(data, $scope.currentBroker);

                        toaster.success({
                            title: "Broker update success",
                            body: "Successfully updated broker " + data.name
                        });
                    }
                );
            }
        };

        function loadBrokerList() {
            tradeService.getBrokerList().then(function (data) {
                vm.isloading = false;
                $scope.brokerList = data;
            });
        }

    }
})();