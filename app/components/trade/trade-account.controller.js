(function () {
    "use strict";
    angular.module('screenApp')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings', 'dataService',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'tradeService', 'ngDialog'];

    function AccountController($scope, $state, $rootScope, toaster, $timeout, appSettings, dataService,
                               utilService, shareService, tickerService, analysisService, tradeService, ngDialog) {
        var vm = this;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();
            vm.isloading = true;
            $scope.detailMode = "new";
            loadAccountList();
            loadBrokerList();
            loadZoneList();
        }

        $scope.createAccount = function () {
            $scope.detailMode = "new";
            $scope.localAccount = null;
            $scope.activeDetailPanel = 'details';
        };

        $scope.updateAccount = function (account) {
            $scope.detailMode = "update";
            $scope.activeDetailPanel = 'details';
            $scope.currentAccount = account;
            $scope.localAccount = angular.copy(account);
        };

        $scope.removeAccount = function (account) {
            ngDialog.openConfirm({
                template: '<div style="height:100px"><p>Are you sure you want to delete account? <b>' + account.id + '</b>?</p>' +
                '<div class="pull-right">' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)" style="margin-right: 10px">Yes&nbsp;</button>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                '</button></div></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                tradeService.deleteAccount(account.id).then(
                    function () {
                        loadAccountList();

                        toaster.success({
                            title: "Account removed success",
                            body: "Successfully removed account " + account.name
                        });

                        $scope.createAccount();
                    },
                    function (value) {
                        toaster.error({
                            title: "Account removed fail",
                            body: "Error removed account " + account.name + "  " + value
                        });
                    }
                );
            }, function (value) {
                //cancelled, do nothing
            });
        };


        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localAccount = null;
                form.$setPristine();
            }
            else {
                $scope.localAccount = $scope.currentAccount;
            }

        };


        $scope.submitAccount = function (form) {
            if ($scope.detailMode == 'new') {
                tradeService.addAccount($scope.localAccount).then(
                    function (newAccount) {
                        loadAccountList();

                        toaster.success({
                            title: "New account created success",
                            body: "Successfully created new account " + newAccount.name
                        });

                        $scope.cancel(form);
                    }
                );
            }
            else {
                tradeService.updateAccount($scope.localAccount).then(
                    function (data) {
                        utilService.copyObject(data, $scope.currentAccount);

                        toaster.success({
                            title: "Account update success",
                            body: "Successfully updated account " + data.name
                        });
                    }
                );
            }
        };

        $scope.cancelFund = function (form) {
            $scope.localFund = {};
            $scope.localFund.operation = 'deposit';
            form.$setPristine();
        };

        $scope.submitFund = function (form) {
            tradeService.transferFund($scope.localAccount.id,
                $scope.localFund.operation,
                $scope.localFund.fundAmount).then(
                function (newBalance) {
                    loadAccountList();
                    toaster.success({
                        title: "Fund transfer success",
                        body: "Successfully " + $scope.localFund.operation + ' $' + $scope.localFund.fundAmount + "."
                    });

                    $scope.cancelFund(form);
                },
                function (error) {
                    toaster.error({
                        title: "Fund transfer failed",
                        body: error.message
                    });
                }
            );
        };

        $scope.getBroker = function (id) {
            var s = _.where($scope.optionBrokerList, {id: id});

            if (s && s.length === 1) {
                return s[0];
            }
            else {
                return null;
            }
        };

        function loadAccountList() {
            utilService.startProgressBar();
            var zoneId = null;
            if ($scope.currentZone) {
                zoneId = $scope.currentZone.id;
            }
            tradeService.getAccountList(zoneId).then(function (data) {
                console.log("account list ", data);
                vm.isloading = false;
                $scope.accountList = data;
                utilService.completeProgressBar();
            });
        }


        function loadBrokerList() {

            tradeService.getBrokerList().then(function (data) {
                vm.isloading = false;
                $scope.optionBrokerList = data;
            });
        }

        function loadZoneList() {
            tradeService.getZoneList().then(function (data) {
                $scope.optionZoneList = data;
            });
        }
    }
})();