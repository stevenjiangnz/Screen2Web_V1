/**
 * Created by steven on 2/07/2016.
 */
(function () {
    "use strict";
    angular.module('screenApp')
        .controller('ScanController', ScanController);

    ScanController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'ngDialog'];

    function ScanController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                            utilService, shareService, tickerService, analysisService, ngDialog) {
        var vm = this;

        activate();

        function activate() {
            vm.isloading = true;
            loadScanList();
            loadShareList();
            loadWatchList();
            loadRuleList();

            $timeout(function(){
                $scope.createScan();
            });
        }

        $scope.createScan = function () {
            $scope.detailMode = "new";
            $scope.localScan = {};
            $scope.localScan.scopeType='Stock';
        };

        $scope.updateScan = function (scan) {
            $scope.detailMode = "update";
            $scope.currentScan = scan;
            $scope.localScan = angular.copy(scan);
            prepareObjectFromService();
        };

        $scope.addShareToScope = function (selected) {
            if($scope.localScan.shareString)
            {
                $scope.localScan.shareString += "; ";
            }
            else
            {
                $scope.localScan.shareString ="";
            }

            $scope.localScan.shareString += selected.originalObject.symbol+'(' +selected.originalObject.id + ')';
        };

        $scope.removeScan = function (scan) {
            analysisService.deleteScan(scan.id).then(
                function () {
                    $scope.scanList.pop(scan);

                    toaster.success({
                        title: "Scan removed success",
                        body: "Successfully removed scan " + scan.name
                    });

                    $scope.createRule();
                }
            );
        };

        $scope.runScan = function(scan)
        {
        };

        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localScan = null;
                form.$setPristine();
            }
            else {
                $scope.localScan = $scope.currentScan;
            }

        };

        $scope.submitNewScan = function (form) {
            if(customValid())
            {
                prepareObjectToService();

                if ($scope.detailMode == 'new') {
                    analysisService.addScan($scope.localScan).then(
                        function (newScan) {
                            $scope.scanList.push(newScan);

                            toaster.success({
                                title: "New scan created success",
                                body: "Successfully created new scan " + newScan.name
                            });

                            $scope.cancel(form);
                        }
                    );
                }
                else {
                     analysisService.updateScan($scope.localScan).then(
                     function (data) {
                     utilService.copyObject(data, $scope.currentScan);

                     toaster.success({
                     title: "Scan update success",
                     body: "Successfully updated scan " + data.name
                     });
                     }
                     );
                }
            }

        };

        function customValid(){
            var isValid = true;

            if($scope.localScan.scopeType === "Stock" && (!$scope.localScan.shareString))
            {
                toaster.error({
                    title: "Validation Error",
                    body: "At least one share needs to be selected."
                });

                isValid = false;
            }

            if($scope.localScan.scopeType === "Watch" && ($scope.localScan.watchList == null  || $scope.localScan.watchList.length ==0 ))
            {
                toaster.error({
                    title: "Validation Error",
                    body: "At least one watch list needs to be selected."
                });

                isValid = false;
            }

            if($scope.localScan.startDateObj && $scope.localScan.endDateObj)
            {
                if($scope.localScan.startDateObj > $scope.localScan.endDateObj)
                {
                    toaster.error({
                        title: "Validation Error",
                        body: "End date can't be later than start date."
                    });
                }

            }
            return isValid
        }

        function prepareObjectToService()
        {

            if($scope.localScan.startDateObj){
                $scope.localScan.startDate = utilService.dateToInt($scope.localScan.startDateObj);
            }

            if($scope.localScan.endDateObj){
                $scope.localScan.endDate = utilService.dateToInt($scope.localScan.endDateObj);
            }

            $scope.localScan.watchString = JSON.stringify($scope.localScan.watchList);


        }

        function prepareObjectFromService(){
            if($scope.localScan.startDate){
                $scope.localScan.startDateObj = utilService.intToDate($scope.localScan.startDate);
            }

            if($scope.localScan.endDate){
                $scope.localScan.endDateObj = utilService.intToDate($scope.localScan.endDate);
            }

            if($scope.localScan.watchString)
            {
                $scope.localScan.watchList = $.parseJSON($scope.localScan.watchString);
            }
        }


        function loadScanList() {
            analysisService.getScanList().then(function (data) {
                vm.isloading = false;
                $scope.scanList = data;
            });
        }

        function loadRuleList(){
            analysisService.getRuleList().then(function (data) {
                vm.isloading = false;
                $scope.ruleList = data;
            });
        }

        $scope.startDateOptions = {
            dateDisabled: false,
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.endDateOptions = {
            dateDisabled: false,
            formatYear: 'yy',
            startingDay: 1
        };


        function loadShareList() {
            shareService.getShareList(false).then(function (data) {
                var activeShareList = _.filter(data, function (share) {
                    return share.isActive;
                });

                $scope.optionShareList = activeShareList;
            });
        }

        function loadWatchList() {
            analysisService.getWatchList().then(
                function (data) {
                    $scope.watchList = data;
                }
            );
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

        $scope.format= 'yyyy-MM-dd';
        $scope.startDateOpen = function(){
            $scope.startDatePop.opened = true;
        };

        $scope.endDateOpen = function(){
            $scope.endDatePop.opened = true;
        };

        $scope.startDatePop = {
            opened: false
        };

        $scope.endDatePop = {
            opened: false
        };
    }
})();
