/**
 * Created by steven on 14/08/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('PlanJourneyController', PlanJourneyController);

    PlanJourneyController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'tradeService', 'planService', 'ngDialog'];

    function PlanJourneyController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                                   utilService, shareService, tickerService, tradeService, planService, ngDialog) {
        var vm = this;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();
            vm.isloading = true;
            $scope.tinymceModel = '';
            $scope.detailMode = "new";
            $scope.tinymceOptions = appSettings.editorSettings;
            $scope.localJourney = {};
            loadJourneyList();

        }

        $scope.createJourney = function () {
            $scope.detailMode = "new";
            $scope.localJourney = {};
            $scope.localJourney.status = "Active";
        };

        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localJourney = {};
                form.$setPristine();
            }
            else {
                $scope.localJourney = $scope.currentJourney;
            }

        };
        $scope.submitJourney = function (form) {
            if ($scope.currentZone) {
                $scope.localJourney.zoneId = $scope.currentZone.id;
            }
            else {
                $scope.localJourney.zoneId = null;
            }

            if ($scope.detailMode == 'new') {

                planService.addJourney($scope.localJourney).then(
                    function (newJourney) {
                        $scope.journeyList.push(newJourney);

                        toaster.success({
                            title: "New journey created success",
                            body: "Successfully created new journey " + newJourney.startDay
                        });

                        $scope.cancel(form);
                    }
                );
            }
            else {
                planService.updateJourney($scope.localJourney).then(
                    function (data) {
                        _.each($scope.journeyList, function (j) {
                            if (j.id == data.id)
                                utilService.copyObject(data, j);
                        });

                        toaster.success({
                            title: "Journey update success",
                            body: "Successfully updated journey " + data.startDay
                        });
                    }
                );
            }
        };


        $scope.updateJourney = function (journey) {
            $scope.detailMode = "update";

            planService.getJourney(journey.id).then(
                function (data) {

                    $scope.currentJourney = data;

                    $scope.localJourney = angular.copy(data);
                }
            );
        };

        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localJourney = {};
                form.$setPristine();
            }
            else {
                $scope.localJourney = $scope.currentJourney;
            }
        };


        $scope.removeJourney = function (journey) {
            ngDialog.openConfirm({
                template: '<div style="height:100px"><p>Are you sure you want to delete journey? <b>' + journey.id + '</b>?</p>' +
                '<div class="pull-right">' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)" style="margin-right: 10px">Yes&nbsp;</button>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                '</button></div></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                planService.deleteJourney(journey.id).then(
                    function () {
                        toaster.success({
                            title: "Journey removed success",
                            body: "Successfully removed journey " + journey.startDay
                        });

                        loadJourneyList();

                        $scope.createJourney();
                    }
                );

            }, function (value) {
                //cancelled, do nothing
            });
        };

        function loadJourneyList() {
            var zoneId = null;
            if ($scope.currentZone) {
                zoneId = $scope.currentZone.id;
            }

            planService.getJourneyList(zoneId).then(function (data) {
                console.log("journey list", data);
                $scope.journeyList = data;
            });
        }
    }
})();