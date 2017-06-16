/**
 * Created by steven on 14/08/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('PlanIdeaController', PlanIdeaController);

    PlanIdeaController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'tradeService', 'planService', 'ngDialog'];

    function PlanIdeaController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                                   utilService, shareService, tickerService, tradeService, planService, ngDialog) {
        var vm = this;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();
            vm.isloading = true;
            $scope.tinymceModel = '';
            $scope.detailMode = "new";
            $scope.tinymceOptions = appSettings.editorSettings;
            $scope.localIdea = {};
            loadIdeaList();

        }

        $scope.createIdea = function () {
            $scope.detailMode = "new";
            $scope.localIdea = {};
            $scope.localIdea.status = "Active";
        };

        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localIdea = {};
                form.$setPristine();
            }
            else {
                $scope.localIdea = $scope.currentIdea;
            }

        };
        $scope.submitIdea = function (form) {
            utilService.startProgressBar();
            if ($scope.detailMode == 'new') {
                planService.addIdea($scope.localIdea).then(
                    function (newIdea) {
                        $scope.ideaList.push(newIdea);

                        toaster.success({
                            title: "New idea created success",
                            body: "Successfully created new idea " + newIdea.id
                        });

                        $scope.cancel(form);

                        utilService.completeProgressBar();
                    }
                );
            }
            else {
                planService.updateIdea($scope.localIdea).then(
                    function (data) {
                        _.each($scope.ideaList, function (j) {
                            if (j.id == data.id)
                                utilService.copyObject(data, j);
                        });

                        toaster.success({
                            title: "Idea update success",
                            body: "Successfully updated idea " + data.startDay
                        });

                        utilService.completeProgressBar();
                    }
                );
            }
        };


        $scope.updateIdea = function (idea) {
            $scope.detailMode = "update";

            planService.getIdea(idea.id).then(
                function (data) {

                    $scope.currentIdea = data;

                    $scope.localIdea = angular.copy(data);
                }
            );
        };

        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localIdea = {};
                form.$setPristine();
            }
            else {
                $scope.localIdea = $scope.currentIdea;
            }
        };


        $scope.removeIdea = function (idea) {
            ngDialog.openConfirm({
                template: '<div style="height:100px"><p>Are you sure you want to delete idea? <b>' + idea.id + '</b>?</p>' +
                '<div class="pull-right">' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)" style="margin-right: 10px">Yes&nbsp;</button>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                '</button></div></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                planService.deleteIdea(idea.id).then(
                    function () {
                        toaster.success({
                            title: "Idea removed success",
                            body: "Successfully removed idea " + idea.id
                        });

                        loadIdeaList();

                        $scope.createIdea();
                    }
                );

            }, function (value) {
                //cancelled, do nothing
            });
        };

        function loadIdeaList() {
            utilService.startProgressBar();
            planService.getIdeaList().then(function (data) {
                $scope.ideaList = data;
                utilService.completeProgressBar();
            });
        }
    }
})();