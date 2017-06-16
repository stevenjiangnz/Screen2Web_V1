/**
 * Created by steven on 8/05/2016.
 */
(function () {
    "use strict";
    angular.module('screenApp')
        .controller('AnalysisWatchDetailController', AnalysisWatchDetailController);

    AnalysisWatchDetailController.$inject = ['$scope', '$state', '$rootScope', '$stateParams', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'ngDialog'];

    function AnalysisWatchDetailController($scope, $state, $rootScope, $stateParams, toaster, $timeout, appSettings,
                                           utilService, shareService, tickerService, analysisService, ngDialog) {

        $scope.watchshareList = [];

        activate();

        function activate() {
            $scope.watchId = $stateParams.watchId;

            loadShareList();

            getWatchInfo($scope.watchId);
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

        $scope.selectWatchShare = function (wShare) {
            if (wShare.ticked) {
                var shareSelect = angular.copy(wShare);

                shareSelect.ticked = null;
                $scope.watchSelectedList.push(shareSelect);
            } else {
                $scope.watchSelectedList = _.filter($scope.watchSelectedList, function (o) {
                    return o.id != wShare.id;
                });
            }
        };


        $scope.addShareToWatch = function (share) {
            analysisService.addWatchListShare($scope.watchId, share.originalObject.id).then
            (
                function () {
                    $scope.watchshareList.push(share.originalObject);
                    $scope.$broadcast('angucomplete-alt:clearInput', 'inputShare');

                    toaster.success({
                        title: "Add share into watch success",
                        body: "Successfully add share " + share.originalObject.symbol + " to watch"
                    });
                }
            );
        };

        $scope.removeShareFromWatch = function (share) {
            analysisService.removeWatchListShare($scope.watchId, share.id).then
            (
                function () {
                    $scope.watchshareList.pop(share);
                    $scope.optionShareList.push(share);
                    toaster.success({
                        title: "Remove share from watch success",
                        body: "Successfully remove share " + share.symbol + " from watch"
                    });
                }
            );

        };


        function getWatchInfo(watchId){
            analysisService.getWatchListById(watchId).then(
                function(data){
                    $scope.watchInfo = data;
                }
            );

        }

        function loadShareList() {
            shareService.getShareList(false).then(function (data) {
                var activeShareList = _.filter(data, function (share) {
                    return share.isActive;
                });

                $scope.activeShareList = activeShareList;


                $scope.optionShareList = activeShareList;

                getWatchListDetailFromDB($scope.watchId);
            });
        }

        function getWatchListDetailFromDB(watchId) {
            analysisService.getWatchListDetail(watchId).then(
                function (data) {
                    // get the watchlist detail
                    $scope.watchshareList = _.filter($scope.optionShareList, function (o) {
                        var match = _.filter(data, function (s) {
                            return s.shareId == o.id;
                        });
                        return (match && match.length > 0);
                    });

                    $scope.optionShareList = _.difference($scope.activeShareList, $scope.watchshareList );

                    utilService.completeProgressBar();
                },
                function (err) {
                    console.log(err);
                    utilService.completeProgressBar();
                }
            );
        }

    }
})();
