/**
 * Created by steven on 23/03/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('StockController', StockController);

    StockController.$inject = ['$scope', '$state', '$rootScope', '$interval', '$window', '$location', '$timeout', '$stateParams',
        'appSettings', 'sessionState', 'utilService', 'shareService', 'tickerService', 'indicatorService',
        'tradeService', 'dataService'];

    function StockController($scope, $state, $rootScope, $interval, $window, $location, $timeout, $stateParams,
                             appSettings, sessionState, utilService, shareService, tickerService, indicatorService,
                             tradeService, dataService) {
        var vm = this;
        vm.shareList = null;
        vm.treeControlProxy= {};

        $scope.currentShareId = null;

        vm.currentShare = null;

        vm.loadingData = false;
        vm.chartSetting = null;
        vm.chartControl = null;

        $scope.selectedNode = null;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();
            $scope.currentShareId = $stateParams.shareId;

            // input setting for scan in history
            if($stateParams.setting)
            {
                $scope.inputSetting = JSON.parse($stateParams.setting);
            }

            initChartSettings();

            initDataLoad();

            setPageRefresh();

            $scope.$on('chartIndicatorSelected', function (event, data) {
                $timeout(function(){
                    $scope.$broadcast('indicatorClickEvent', data);
                });
            });
        }

        function setPageRefresh()
        {
            $interval(function(){
                var currentZone = tradeService.getCurrentZone();
                var currentAccount = tradeService.getCurrentAccount();

                if(currentZone.id != dataService.appStates.currentZone.id ||
                    currentZone.tradingDate != dataService.appStates.currentZone.tradingDate ||
                    currentAccount.id !== dataService.appStates.currentAccount.id)
                {
                    var absUrl = $location.absUrl();
                    var index = absUrl.indexOf("#");
                    absUrl = absUrl.substring(0, index);

                    dataService.appStates = {
                        'currentZone': currentZone,
                        'currentAccount': currentAccount
                    };

                    $window.location = absUrl + '/#/stock/' + vm.currentShare.id;
                }
            }, 1000);
        }


        function initChartSettings() {
            // Adjust for inputSetting.
            var stockWindow = appSettings.stockDefaultWindow;
            var startDate = utilService.dateToInt(new Date()) - stockWindow;
            var endDate = null;
            var maxDate = null;
            var flags = null;
            var flagType = null;
            var flagShareId = null;

            $scope.currentZone = tradeService.getCurrentZone();
            if($scope.currentZone)
            {
                startDate = $scope.currentZone.tradingDate - stockWindow;
                endDate = $scope.currentZone.tradingDate;
            }


            if ($scope.inputSetting)
            {
                if (($scope.inputSetting.start - 200) < startDate)
                {
                    startDate = $scope.inputSetting.start - 200;
                }
                if($scope.inputSetting.end)
                {
                    maxDate = $scope.inputSetting.end;
                }
                if($scope.inputSetting.flagType)
                {
                    flagType = $scope.inputSetting.flagType;
                }
                if($scope.inputSetting.flags)
                {
                    flags = $scope.inputSetting.flags;
                    flagShareId = $scope.inputSetting.shareId;
                }
            }


            vm.chartSetting = {
                'shareId': null,
                'switch': {
                    'ema20': true,
                    'sma5': true,
                    'sma10': true,
                    'sma50': true,
                    'sma200': true,
                    'bb': true,
                    'adx': true,
                    'macd': true,
                    'heikin':true,
                    'stochastic': true,
                    'rsi': true,
                    'william': true
                },
                'priceType': "OCHL",
                'startDate': startDate,
                'endDate': endDate,
                'maxDate': maxDate,
                'flagType':flagType,
                'flags': flags,
                'flagShareId' : flagShareId,
                'height': 700,
                'title': ""
            };
        }

        function initDataLoad() {
            shareService.getShareList(false).then(function (data) {
                vm.shareList = _.filter(data, function (share) {
                    return share.isActive;
                });
                vm.treeObj = _.groupBy(vm.shareList, function (share) {
                    return share.industry;
                });

                $scope.$watch('currentShareId', function (newValue, oldValue) {
                    if(newValue)
                    {
                        displayStockChart(newValue);
                    }
                });
            });
        }

        function displayStockChart(shareId) {
            var result = _.filter(vm.shareList, function (share) {
                return share.id == shareId;
            });

            if (result && result.length >= 1) {
                vm.currentShare = result[0];
            }

            if(vm.currentShare){
                vm.chartSetting.shareId = shareId;
                vm.chartSetting.title = vm.currentShare.name + ' - ' + vm.currentShare.symbol;
            }
        }
    }
})();