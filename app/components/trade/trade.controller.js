/**
 * Created by steven on 17/07/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('TradeController', TradeController);

    TradeController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings', '$window',
        '$interval', 'utilService', 'shareService', 'tickerService', 'tradeService', 'dataService'];

    function TradeController($scope, $state, $rootScope, toaster, $timeout, appSettings, $window,
                              $interval, utilService, shareService, tickerService, tradeService, dataService) {
        var vm = this;

        activate();

        function activate() {
            initData();
        }

        function initData() {
            //Refresh the page when env has changed
            $interval(function(){
                var currentZone = tradeService.getCurrentZone();
                var currentAccount = tradeService.getCurrentAccount();

                if(currentZone.id != dataService.appStates.currentZone.id ||
                    currentZone.tradingDate != dataService.appStates.currentZone.tradingDate ||
                    currentAccount.id !== dataService.appStates.currentAccount.id)
                {

                    dataService.appStates = {
                        'currentZone': currentZone,
                        'currentAccount': currentAccount
                    };

                    $window.location.reload();
                }
            }, 1000);
        }
    }
})();

