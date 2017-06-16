/**
 * Created by steven on 14/08/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('PlanPlanController', PlanPlanController);

    PlanPlanController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'tradeService', 'planService', 'ngDialog'];

    function PlanPlanController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                                   utilService, shareService, tickerService, tradeService, planService, ngDialog) {
        var vm = this;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();
            vm.isloading = true;
            $scope.tinymceModel = '';
            $scope.detailMode = "new";
            $scope.tinymceOptions = appSettings.editorSettings;
            $scope.localPlan = {};
            loadPlanList();

        }

        $scope.createPlan = function () {
            $scope.detailMode = "new";
            $scope.localPlan = {};
            $scope.localPlan.status = "Active";
        };

        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localPlan = {};
                form.$setPristine();
            }
            else {
                $scope.localPlan = $scope.currentPlan;
            }

        };
        $scope.submitPlan = function (form) {
            if ($scope.currentZone) {
                $scope.localPlan.zoneId = $scope.currentZone.id;
            }
            else {
                $scope.localPlan.zoneId = null;
            }

            if ($scope.detailMode == 'new') {

                planService.addPlan($scope.localPlan).then(
                    function (newPlan) {
                        $scope.planList.push(newPlan);

                        toaster.success({
                            title: "New plan created success",
                            body: "Successfully created new plan " + newPlan.tradingDate
                        });

                        $scope.cancel(form);
                    }
                );
            }
            else {
                planService.updatePlan($scope.localPlan).then(
                    function (data) {
                        _.each($scope.planList, function (j) {
                            if (j.id == data.id)
                                utilService.copyObject(data, j);
                        });

                        toaster.success({
                            title: "Plan update success",
                            body: "Successfully updated plan " + data.startDay
                        });
                    }
                );
            }
        };


        $scope.updatePlan = function (plan) {
            $scope.detailMode = "update";

            planService.getPlan(plan.id).then(
                function (data) {

                    $scope.currentPlan = data;

                    $scope.localPlan = angular.copy(data);
                }
            );
        };

        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localPlan = {};
                form.$setPristine();
            }
            else {
                $scope.localPlan = $scope.currentPlan;
            }
        };


        $scope.removePlan = function (plan) {
            ngDialog.openConfirm({
                template: '<div style="height:100px"><p>Are you sure you want to delete plan? <b>' + plan.id + '</b>?</p>' +
                '<div class="pull-right">' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)" style="margin-right: 10px">Yes&nbsp;</button>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                '</button></div></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                planService.deletePlan(plan.id).then(
                    function () {
                        toaster.success({
                            title: "Plan removed success",
                            body: "Successfully removed plan " + plan.tradingDate
                        });

                        loadPlanList();

                        $scope.createPlan();
                    }
                );

            }, function (value) {
                //cancelled, do nothing
            });
        };

        function loadPlanList() {
            var zoneId = null;
            if ($scope.currentZone) {
                zoneId = $scope.currentZone.id;
            }

            planService.getPlanList(zoneId).then(function (data) {
                $scope.planList = data;
            });
        }
    }
})();