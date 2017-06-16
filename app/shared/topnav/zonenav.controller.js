/**
 * Created by steven on 20/07/2016.
 */
(function () {
    "use strict";

    var app = angular.module('screenApp');

    app.controller('ZoneNavController', ['$scope', '$rootScope', '$state', 'authService',
        '$timeout', '$window', 'tradeService', 'dataService', 'appSettings', 'toaster', 'ngDialog', 'utilService',
        ZoneNavController]);

    function ZoneNavController($scope, $rootScope, $state, authService,
                               $timeout, $window, tradeService, dataService, appSettings, toaster, ngDialog, utilService) {


        activate();
        function activate() {
            $scope.env = {};
            loadZoneList();
            loadAccountList();
            initForm();
        }

        function initForm() {
            $scope.currentZone = dataService.getFromLocalRepository(appSettings.zoneKey);
            $scope.currentAccount = dataService.getFromLocalRepository(appSettings.accountKey);

            $scope.isCurrent = true;

            if ($scope.currentZone != null) {
                $scope.env.selectedZoneId = $scope.currentZone.id;
                loadAccountList($scope.currentZone.id);
            }

            if($scope.currentAccount)
            {
                $scope.env.selectedAccountId = $scope.currentAccount.id;
            }

            setEnvString();
        }

        $scope.changeNextDay = function () {
            utilService.startProgressBar();
            tradeService.getNextDayZone($scope.currentZone.id).then(function(data){
                $scope.currentZone = data;
                dataService.saveToLocalRepository(appSettings.zoneKey, data);
                utilService.completeProgressBar();
                toaster.success({
                    title: "Zone move next day change success",
                    body: "Successfully move the zone to next day. Might need refresh the page."
                });

                $window.location.reload();

                setEnvString();
            });

        };

        $scope.changeTradingEnv = function () {
            $scope.setEnvDialog = ngDialog.open({
                template: 'temp-set-environment.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };

        $scope.submitEnv = function () {
            if ($scope.env.selectedZoneId) {
                var selectedZone = _.findWhere($scope.zoneList, {id: $scope.env.selectedZoneId});
                dataService.saveToLocalRepository(appSettings.zoneKey, selectedZone);

                $scope.currentZone = selectedZone;
            }
            else {
                dataService.saveToLocalRepository(appSettings.zoneKey, null);
                $scope.currentZone = null;
            }

            if ($scope.env.selectedAccountId) {
                var selectedAccount = _.findWhere($scope.accountList, {id: $scope.env.selectedAccountId});
                dataService.saveToLocalRepository(appSettings.accountKey, selectedAccount);

                $scope.currentAccount = selectedAccount;
            }
            else {
                dataService.saveToLocalRepository(appSettings.accountKey, null);
                $scope.currentAccount = null;
            }

            toaster.success({
                title: "Zone and account change success",
                body: "Successfully Changed zone and account. Might need refresh the page."
            });

            $scope.setEnvDialog.close();
            setEnvString();
        };

        $scope.changeEnvZone = function () {
            var zoneId = null;

            if ($scope.env && $scope.env.selectedZoneId && $scope.env.selectedZoneId > 0) {
                zoneId = $scope.env.selectedZoneId;
            }

            $scope.env.selectedAccountId = null;

            loadAccountList(zoneId);
        };

        function setEnvString ()
        {
            if($scope.currentZone)
            {
                $scope.envString = $scope.currentZone.name + "  |  " + $scope.currentAccount.name + "  |  " + $scope.currentZone.tradingDate;
            }
            else
            {
                if($scope.currentAccount)
                {
                    $scope.envString = "Current  |  " +  $scope.currentAccount.name;
                }
                else
                {
                    $scope.envString = "Current  ";
                }
            }
        }

        function loadZoneList() {
            tradeService.getZoneList().then(function (data) {
                $scope.zoneList = data;
            });
        }

        function loadAccountList(zoneId) {
            tradeService.getAccountList(zoneId).then(function (data) {
                $scope.accountList = data;
            });
        }
    }
})();