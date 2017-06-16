/**
 * Created by steven on 17/07/2016.
 */
/**
 * Created by steven on 27/06/2016.
 */
(function () {
    "use strict";
    angular.module('screenApp')
        .controller('ZoneController', ZoneController);

    ZoneController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings', 'dataService',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'tradeService', 'ngDialog'];

    function ZoneController($scope, $state, $rootScope, toaster, $timeout, appSettings, dataService,
                            utilService, shareService, tickerService, analysisService, tradeService, ngDialog) {
        var vm = this;

        activate();

        function activate() {
            vm.isloading = true;
            $scope.detailMode = "new";
            loadZoneList();

            $rootScope.$on('zoneChanged', function (event, data) {

                console.log("zonf changed handled ", data); // 'Broadcast!'
            });
        }

        $scope.createZone = function () {
            $scope.detailMode = "new";
            $scope.localZone = null;
        };

        $scope.updateZone = function (zone) {
            $scope.detailMode = "update";
            $scope.currentZone = zone;
            $scope.localZone = angular.copy(zone);
            prepareObjectFromService();
        };

        $scope.removeZone = function (zone) {
            ngDialog.openConfirm({
                template: '<div style="height:100px"><p>Are you sure you want to delete account? <b>' + zone.id + '</b>?</p>' +
                '<div class="pull-right">' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)" style="margin-right: 10px">Yes&nbsp;</button>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                '</button></div></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                tradeService.deleteZone(zone.id).then(
                    function () {
                        $scope.zoneList.pop(zone);

                        toaster.success({
                            title: "Zone removed success",
                            body: "Successfully removed zone " + zone.name
                        });

                        $scope.createZone();
                    }
                );
            }, function (value) {
                //cancelled, do nothing
            });
        };


        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localZone = null;
                form.$setPristine();
            }
            else {
                $scope.localZone = $scope.currentZone;
            }

        };

        $scope.submitNewZone = function (form) {
            if (customValid()) {
                prepareObjectToService();

                if ($scope.detailMode == 'new') {
                    $scope.localZone.tradingDate = utilService.dateToInt($scope.localZone.startDateObj);

                    tradeService.addZone($scope.localZone).then(
                        function (newZone) {
                            $scope.zoneList.push(newZone);

                            toaster.success({
                                title: "New zone created success",
                                body: "Successfully created new zone " + newZone.name
                            });

                            $scope.cancel(form);
                        }
                    );
                }
                else {
                    tradeService.updateZone($scope.localZone).then(
                        function (data) {
                            utilService.copyObject(data, $scope.currentZone);

                            // update the current zone detail in local repository
                            var currentZone = dataService.getFromLocalRepository(appSettings.zoneKey);

                            if(currentZone && currentZone.id == data.id)
                            {
                                dataService.saveToLocalRepository(appSettings.zoneKey, $scope.currentZone);
                            }

                            toaster.success({
                                title: "Zone update success",
                                body: "Successfully updated zone " + data.name
                            });
                        }
                    );
                }
            }
        };

        function loadZoneList() {
            tradeService.getZoneList().then(function (data) {
                vm.isloading = false;
                $scope.zoneList = data;
            });
        }

        $scope.getDateInt = function (d) {
            var dInt = null;

            if (d) {
                var dd = new Date(d);

                dInt = utilService.dateToInt(dd);
            }

            return dInt;
        };

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

        $scope.format = 'yyyy-MM-dd';
        $scope.startDateOpen = function () {
            $scope.startDatePop.opened = true;
        };

        $scope.endDateOpen = function () {
            $scope.endDatePop.opened = true;
        };

        $scope.startDatePop = {
            opened: false
        };

        $scope.endDatePop = {
            opened: false
        };

        function customValid(){
            var isValid = true;

            if($scope.localZone.startDate && $scope.localZone.endDate)
            {
                if($scope.localZone.startDate > $scope.localZone.endDate)
                {
                    toaster.error({
                        title: "Validation Error",
                        body: "End date can't be later than start date."
                    });
                }
            }
            return isValid
        }

        function prepareObjectToService() {

            if ($scope.localZone.startDateObj) {
                $scope.localZone.startDate = $scope.localZone.startDateObj.toISOString();
            }

            if ($scope.localZone.endDateObj) {
                $scope.localZone.endDate = $scope.localZone.endDateObj.toISOString();
            }else {
                $scope.localZone.endDate = null;
            }
        }

        function prepareObjectFromService(){
            console.log("$scope.localZone, ", $scope.localZone);

            if($scope.localZone.startDate){
                $scope.localZone.startDateObj = new Date($scope.localZone.startDate);
            }

            if($scope.localZone.endDate){
                $scope.localZone.endDateObj = new Date($scope.localZone.endDate);
            }

        }
    }
})();