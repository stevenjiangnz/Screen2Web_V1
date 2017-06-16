/**
 * Created by steven on 27/06/2016.
 */
(function () {
    "use strict";
    angular.module('screenApp')
        .controller('RuleController', RuleController);

    RuleController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'ngDialog'];

    function RuleController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                            utilService, shareService, tickerService, analysisService, ngDialog) {
        var vm = this;

        activate();

        function activate() {
            vm.isloading = true;
            $scope.detailMode = "new";
            loadRuleList();
        }

        $scope.createRule = function () {
            $scope.detailMode = "new";
            $scope.localRule = null;
        };

        $scope.updateRule = function (rule) {
            $scope.detailMode = "update";
            $scope.currentRule = rule;
            $scope.localRule = angular.copy(rule);
        };

        $scope.removeRule = function (rule) {
            ngDialog.openConfirm({
                template: '<div style="height:100px"><p>Are you sure you want to delete rule <b>' + rule.id + '</b>?</p>' +
                '<div class="pull-right">' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)" style="margin-right: 10px">Yes&nbsp;</button>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                '</button></div></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                analysisService.deleteRule(rule.id).then(
                    function () {
                        loadRuleList();

                        toaster.success({
                            title: "Rule removed success",
                            body: "Successfully removed rule " + rule.name
                        });

                        $scope.createRule();
                    }
                );
            }, function (value) {
                //cancelled, do nothing
            });

        };


        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localRule = null;
                form.$setPristine();
            }
            else {
                $scope.localRule = $scope.currentRule;
            }

        };

        $scope.submitRule = function (form) {
            if(customValidation()){
                // reset the
                if($scope.localRule.type=='formula'){
                    $scope.localRule.assembly = null;
                }else{
                    $scope.localRule.formula = null;
                }

                if ($scope.detailMode == 'new') {
                    analysisService.addRule($scope.localRule).then(
                        function (newRule) {
                            $scope.ruleList.push(newRule);

                            toaster.success({
                                title: "New rule created success",
                                body: "Successfully created new rule " + newRule.name
                            });

                            $scope.cancel(form);
                        }
                    );
                }
                else {
                    analysisService.updateRule($scope.localRule).then(
                        function (data) {
                            utilService.copyObject(data, $scope.currentRule);

                            toaster.success({
                                title: "Rule update success",
                                body: "Successfully updated rule " + data.name
                            });
                        }
                    );
                }
            }
        };

        function customValidation(){

            if($scope.localRule.type=='formula' && !$scope.localRule.formula)
            {
                toaster.error({
                    title: "Validation Error",
                    body: "Formula is required"
                });
                return false;
            }

            if($scope.localRule.type=='assembly' && !$scope.localRule.assembly)
            {
                toaster.error({
                    title: "Validation Error",
                    body: "Assembly is required"
                });
                return false;
            }

            return true;

        }

        function loadRuleList() {
            analysisService.getRuleList().then(function (data) {
                vm.isloading = false;
                $scope.ruleList = data;
            });
        }
    }
})();