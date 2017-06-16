/**
 * Created by steven on 12/03/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.controller('shareDetailController', ['$scope', '$rootScope', 'blockUI', 'toaster', '$timeout',
        'ngProgressFactory', 'utilService', 'shareService','tickerService',
        function ($scope, $rootScope, blockUI, toaster, $timeout, ngProgressFactory,
                  utilService, shareService, tickerService) {
            var ngProgress = ngProgressFactory.createInstance();
            $scope.submitShare = submitShare;
            $scope.submitShareInfo = submitShareInfo;
            $scope.cancelShare = cancelShare;
            $scope.cancelShareInfo = cancelShareInfo;
            $scope.createShare = createShare;
            $scope.createShareInfo = createShareInfo;
            $scope.refreshHistory = refreshHistory;

            activate();
            function activate() {
            }

            function createShareInfo() {
                $scope.shareInfo = {};
                $scope.shareInfo.id = -1;
            }

            function createShare() {
                $scope.share = {};
                $scope.share.id = -1;
                $scope.share.shareType = "Stock";
            }

            function submitShare() {
                blockUI.start();
                if ($scope.localShare.id > 0) {
                    shareService.updateShare($scope.localShare).then(function (data) {
                        $scope.shareUpdated({share: $scope.localShare});
                        toaster.success({
                            title: "Update Success",
                            body: "Successfully update the share " + data.symbol
                        });
                        blockUI.stop();
                    });
                } else {
                    shareService.createShare($scope.localShare).then(function (data) {
                        utilService.copyObject(data, $scope.localShare);
                        $scope.createShareInfo();
                        $scope.shareCreated({share: data});
                        toaster.success({
                            title: "Create Success",
                            body: "Successfully create the share " + data.symbol
                        });
                        blockUI.stop();
                    });
                }
            }

            function submitShareInfo() {
                blockUI.start();
                if ($scope.localShareInfo && $scope.localShareInfo.id > 0) {
                    shareService.updateShareInfo($scope.localShareInfo).then(function (data) {
                        utilService.copyObject($scope.localShareInfo, $scope.shareInfo);
                        toaster.success({
                            title: "Update Success",
                            body: "Successfully update the share info " + data.id
                        });
                        blockUI.stop();
                    });
                }
                else {
                    $scope.localShareInfo.shareId = $scope.localShare.id;

                    shareService.createShareInfo($scope.localShareInfo).then(function (data) {
                        utilService.copyObject(data, $scope.localShareInfo);
                        utilService.copyObject(data, $scope.shareInfo);
                        toaster.success({
                            title: "Create Success",
                            body: "Successfully create the share info " + data.symbol
                        });
                        blockUI.stop();
                    }, function (err) {
                        console.log(err);
                    });

                }
            }

            function refreshHistory() {
                blockUI.start();
                ngProgress.start();
                tickerService.refreshHistoryTickers($scope.localShare.id).then(
                    function(){
                        toaster.success({
                            title: "Refresh Success",
                            body: "Successfully refresh history tickers for share " + $scope.localShare.symbol
                        });
                        ngProgress.complete();
                        blockUI.stop();
                    },
                    function(err){
                        blockUI.stop();
                        ngProgress.complete();
                        console.log(err);
                    }
                );
            }

            function cancelShare() {
                $scope.localShare = angular.copy($scope.share);
            }

            function cancelShareInfo() {
                $scope.localShareInfo = angular.copy($scope.shareInfo);
            }
        }]);
})();
