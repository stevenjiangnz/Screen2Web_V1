(function () {
    "use strict";
    angular.module('screenApp')
        .controller('DailyScanController', DailyScanController);

    DailyScanController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings', 'dataService',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'tradeService', 'ngDialog'];

    function DailyScanController($scope, $state, $rootScope, toaster, $timeout, appSettings, dataService,
                               utilService, shareService, tickerService, analysisService, tradeService, ngDialog) {
        var vm = this;
        var zoneId = null;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();

            if($scope.currentZone)
                zoneId = $scope.currentZone.id;

            vm.isloading = true;
            $scope.detailMode = "new";

            loadDailyScanList();
            loadWatchList();
            loadRuleList();
        }

        $scope.createDailyScan = function () {
            $scope.detailMode = "new";
            $scope.localDailyScan = {};
            $scope.localDailyScan.status = 'Active';
            $scope.localDailyScan.useRule = true;
        };

        $scope.updateDailyScan = function (dailyScan) {
            $scope.detailMode = "update";
            $scope.currentDailyScan = dailyScan;
            $scope.localDailyScan = angular.copy(dailyScan);
            $scope.localDailyScan.watchList = getWatchListArray($scope.localDailyScan.watchListString);
        };

        $scope.removeDailyScan = function (dailyScan) {

            ngDialog.openConfirm({
                template: '<div style="height:100px"><p>Are you sure you want to delete daily scan <b>' + dailyScan.id + '</b>?</p>' +
                '<div class="pull-right">' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)" style="margin-right: 10px">Yes&nbsp;</button>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                '</button></div></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                analysisService.deleteDailyScan(dailyScan.id).then(
                    function () {
                        loadDailyScanList();

                        toaster.success({
                            title: "Daily scan removed success",
                            body: "Successfully removed daily scan " + dailyScan.name
                        });

                        $scope.createDailyScan();
                    }
                );
            }, function (value) {
                //cancelled, do nothing
            });
        };


        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localDailyScan = null;
                form.$setPristine();
            }
            else {
                $scope.localDailyScan = $scope.currentDailyScan;
            }

        };

        $scope.submitDailyScan = function (form) {

            $scope.localDailyScan.zoneId = zoneId;
            $scope.localDailyScan.watchListString = getWatchListString($scope.localDailyScan.watchList);

            utilService.startProgressBar();

            if(customValidation())
            {
                if ($scope.detailMode == 'new') {
                    analysisService.addDailyScan($scope.localDailyScan).then(
                        function (newScan) {
                            $scope.dailyScanList.push(newScan);

                            toaster.success({
                                title: "New daily scan created success",
                                body: "Successfully created new daily scan " + newScan.name
                            });

                            $scope.cancel(form);

                            utilService.completeProgressBar();
                        }
                    );
                }
                else
                {
                    analysisService.updateDailyScan($scope.localDailyScan).then(
                        function (data) {
                            utilService.copyObject(data, $scope.currentDailyScan);

                            toaster.success({
                                title: "Daily scan update success",
                                body: "Successfully updated daily scan " + data.name
                            });

                            utilService.completeProgressBar();
                        }
                    );
                }
            }
        };

        function customValidation()
        {
            var isValid = true;

            if(!$scope.localDailyScan.useRule)
            {
                if (!$scope.localDailyScan.formula)
                {

                    toaster.error({
                        title: "Validation Error",
                        body: "Formula is required."
                    });

                    isValid = false;
                }
            }
            else
            {
                if (!$scope.localDailyScan.ruleId)
                {

                    toaster.error({
                        title: "Validation Error",
                        body: "Rule selection is required."
                    });

                    isValid = false;
                }
            }

            return isValid;
        }


        $scope.getBroker = function(id)
        {
            var s = _.where($scope.optionBrokerList, {id:id});

            if(s && s.length ===1)
            {
                return s[0];
            }
            else
            {
                return null;
            }
        };

        $scope.getRuleFormula = function(ruleId)
        {
            var rule = utilService.getObjFromList($scope.ruleList, ruleId);

            if(rule && rule.formula)
            {
                return rule.formula;
            }

            return null;
        };

        function getWatchListString(watchIdArray){
            var wString=null;

            _.each(watchIdArray, function(w){
                if(wString)
                {
                    wString= wString + ",";
                }

                wString = wString + w;

            });

            return wString;
        }

        function getWatchListArray(watchIdString){
            var strArr = watchIdString.split(',');
            var intArr = [];
            for(var i=0; i < strArr.length; i++)
                intArr.push(parseInt(strArr[i]));

            return intArr;
        }

        function loadWatchList() {
            utilService.startProgressBar();
            analysisService.getWatchListByZone(zoneId).then(function (data) {
                vm.isloading = false;
                $scope.watchList = data;

                utilService.completeProgressBar();
            });
        }

        function loadRuleList() {
            analysisService.getRuleList().then(function (data) {
                $scope.ruleList = data;
            });
        }

        function loadDailyScanList() {
            analysisService.getDailyScanListByZone(zoneId).then(function (data) {
                vm.isloading = false;

                console.log("daily scan list. ", data);
                $scope.dailyScanList = data;
            });
        }
    }
})();