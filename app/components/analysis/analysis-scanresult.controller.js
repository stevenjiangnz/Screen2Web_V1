/**
 * Created by steven on 9/07/2016.
 */
(function () {
    "use strict";
    angular.module('screenApp')
        .controller('ScanResultController', ScanResultController);

    ScanResultController.$inject = ['$scope', '$state', '$stateParams', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'ngDialog'];

    function ScanResultController($scope, $state, $stateParams, $rootScope, toaster, $timeout, appSettings,
                                  utilService, shareService, tickerService, analysisService, ngDialog) {
        var vm = this;

        activate();

        function activate() {
            vm.isloading = true;

            vm.matchList = [];
            vm.displayList = [];

            if ($stateParams.mode == 'run') {
                vm.scanId = $stateParams.scanid;

                loadScanResult(vm.scanId);
            }

            analysisService.getRuleByScan(vm.scanId).then(
                function (data) {
                    vm.rule = data;

                }
            );

        }

        function loadScanResult(scanId) {
            utilService.startProgressBar();
            analysisService.runScan(scanId).then(
                function (data) {
                    populateMatchList(data);

                    vm.isloading = false;
                    utilService.completeProgressBar();
                }
            );
        }

        $scope.displayMatch = function (match) {
            $scope.currentMatch = match;

            tickerService.getVerificationList(match.shareId, match.tradingDate, 21).then(
                function (data) {

                    console.log($scope.currentMatch);
                    $scope.verificationList = data;

                    _.each($scope.verificationList, function (value) {
                        value.diff = (value.close - $scope.currentMatch.close) * 100 / $scope.currentMatch.close;
                        value.diffh = (value.high - $scope.currentMatch.close) * 100 / $scope.currentMatch.close;
                        value.diffl = (value.low - $scope.currentMatch.close) * 100 / $scope.currentMatch.close;
                    });

                }
            );
        };

        $scope.displayMatchChart = function (shareId, tradingDate) {
            var setting = {};
            var flags = [];

            _.each(vm.matchList, function (data) {
                if (data.shareId == shareId) {
                    flags.push(data.tradingDate);
                }
            });

            var start = null;
            var end = null;

            if (flags.length) {
                start = flags[0];
                end = flags[flags.length - 1];
            }

            setting.scanResult = {
                shareId:shareId,
                flagType: vm.rule.type,
                selectedTrading: tradingDate,
                flags: flags,
                start: start,
                end: end
            };

            var url = $state.href('stock', {shareId: shareId, setting: JSON.stringify(setting.scanResult)});

            window.open(url, 'sharechart');
        };

        function populateMatchList(data) {
            console.log("list: ", data);
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    vm.matchList.push({
                        shareId: data[i].matchIndicator.shareId,
                        tradingDate: data[i].matchIndicator.tradingDate,
                        open: data[i].matchIndicator.open,
                        close: data[i].matchIndicator.close,
                        high: data[i].matchIndicator.high,
                        low: data[i].matchIndicator.low,
                        volumn: data[i].matchIndicator.volumn,
                        maxGain: data[i].verification.maxGain,
                        maxLoss: data[i].verification.maxLoss,
                        hasProfitted: data[i].verification.hasProfitted,
                        ma5p: data[i].verification.mA5PeakDay,
                        ma10p: data[i].verification.mA10PeakDay,
                        ma5b: data[i].verification.mA5BottomDay,
                        ma10b: data[i].verification.mA10BottomDay,
                        profitDay: data[i].verification.profitDay,
                        stopDay: data[i].verification.stopDay,
                        gainDay: data[i].verification.maxGainDay,
                        lossDay: data[i].verification.maxLossDay,
                        day1Diff: data[i].verification.day1Diff,
                        day3Diff: data[i].verification.day3Diff
                    })
                }
            }

            vm.listDisplay = vm.matchList;
        }
    }
})();
