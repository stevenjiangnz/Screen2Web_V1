/**
 * Created by steven on 14/08/2016.
 */
/**
 * Created by steven on 28/05/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('AnalysisAlertController', AnalysisAlertController);

    AnalysisAlertController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'tradeService'];

    function AnalysisAlertController($scope, $state, $rootScope, toaster, $timeout,
                                    utilService, shareService, tickerService, analysisService, tradeService) {

        var zoneId = null;
        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();

            if($scope.currentZone)
                zoneId = $scope.currentZone.id;

            loadShareList();

            initCreate();
        }

        function initCreate(){
            $scope.currentAlert = {};
            $scope.localAlert = {};
            $scope.localAlert.isActive = true;

            $scope.detailMode = 'create';
            $scope.alertFormExpanded = true;
        }

        $scope.showAlertList = function () {
            $scope.alertList = null;
            analysisService.getAlertByShareZone($scope.currentShare.id, zoneId).then(function(data){
                $scope.alertList = data;
            });

            initCreate();
        };

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

        function loadShareList() {
            shareService.getShareList(false).then(function (data) {
                var activeShareList = _.filter(data, function (share) {
                    return share.isActive;
                });

                $scope.optionShareList = activeShareList;

                if($scope.currentShare){
                    var currentShare = _.where($scope.optionShareList, {id:$scope.currentShare.id});

                    if (currentShare && currentShare.length > 0)
                    {
                        $scope.$broadcast('angucomplete-alt:changeInput', 'inputShare', currentShare[0]);
                    }
                }

            });
        }

        $scope.updateAlert = function (alert) {
            $scope.detailMode = "update";
            $scope.currentAlert = alert;
            $scope.localAlert = angular.copy(alert);


            var currentShare = _.where($scope.optionShareList, {id:alert.shareId});
            if (currentShare && currentShare.length > 0)
            {
                $scope.$broadcast('angucomplete-alt:changeInput', 'inputShare', currentShare[0]);
            }

            $scope.verifyResult = null;
        };

        $scope.createAlert = function (form) {
            form.$setPristine();
            initCreate();
        };

        $scope.cancel = function (form) {
            if ($scope.detailMode === 'create') {
                form.$setPristine();
                $scope.localAlert = {};
            }
            else {
                $scope.localAlert = angular.copy($scope.currentAlert);
            }
        };

        $scope.submitAlert = function(form) {
            utilService.startProgressBar();

            if($scope.selectedShare && $scope.selectedShare.originalObject)
            {
                $scope.localAlert.shareId = $scope.selectedShare.originalObject.id;
            }

            if(zoneId)
            {
                $scope.localAlert.zoneId = zoneId;
            }

            if ($scope.detailMode == 'create') {
                analysisService.addAlert($scope.localAlert).then(
                    function (newAlert) {
                        if($scope.currentShare) {
                            $scope.alertList.push(newAlert);
                        }

                        if($scope.alertCreated)
                        {
                            $scope.alertCreated({alert: newAlert});
                        }

                        toaster.success({
                            title: "New alert created success",
                            body: "Successfully created new alert " + newAlert.id
                        });

                        $scope.cancel(form);
                        utilService.completeProgressBar();
                    }
                );
            }
            else{
                analysisService.updateAlert($scope.localAlert).then(
                    function (alert) {

                        if($scope.alertUpdated)
                        {
                            $scope.alertUpdated({alert: alert});
                        }

                        toaster.success({
                            title: "New alert update success",
                            body: "Successfully updated alert " + alert.id
                        });
                        var a =  _.findWhere($scope.alertList, {id: alert.id});

                        utilService.copyObject(alert,a);

                        utilService.completeProgressBar();
                    }
                );
            }
        };

        $scope.verifyAlert = function(form) {
            utilService.startProgressBar();
            analysisService.verifyAlert($scope.localAlert).then(
                function (result) {
                    console.log("verification result", result);
                    $scope.verifyResult = result;

                    toaster.success({
                        title: "Alert verification success",
                        body: "Successfully verify alert " + $scope.localAlert.id
                    });

                    utilService.completeProgressBar();
                }
            );
        };

        $scope.deleteAlert = function (alert){
            analysisService.deleteAlert(alert.id).then(
                function(data)
                {
                    $scope.alertList = _.without($scope.alertList, _.findWhere($scope.alertList, {id: alert.id}));

                    if($scope.alertDeleted)
                    {
                        $scope.alertDeleted({alert: alert});
                    }

                    toaster.success({
                        title: "Delete alert success",
                        body: "Successfully delete alert for the current share."
                    });

                    if(alert.id == $scope.currentAlert.id)
                    {
                        initCreate();
                    }

                },
                function(err)
                {
                    toaster.error({
                        title: "Delete alert fail",
                        body: "Fail to delete alert for the current share."
                    });
                }
            );
        }
    }
})();
