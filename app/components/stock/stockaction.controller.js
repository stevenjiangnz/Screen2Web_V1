/**
 * Created by steven on 27/03/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('StockActionController', StockActionController);

    StockActionController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout',
        'utilService', 'shareService', 'tickerService', 'indicatorService','tradeService'];

    function StockActionController($scope, $state, $rootScope, toaster, $timeout,
                                 utilService, shareService, tickerService,
                                   indicatorService, tradeService) {

        var zoneId;
        $scope.currentStockInfo;
        $scope.getStockInfo = getStockInfo;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();
            if($scope.currentZone)
                zoneId = $scope.currentZone.id;
        }

        $scope.$on("indicatorClickEvent", function(event,data){
            $scope.activeActionPanel = "indicator";
            $scope.indicatorInput = data;
            $scope.noteInput = data;
        });

        $scope.getTickerByDate = function(share)
        {
            if(share.id)
            {
                if(zoneId){
                    $scope.indicatorInput ={
                        shareId: share.id,
                        tradingDate: $scope.currentZone.tradingDate
                    };

                    $scope.noteInput = {
                        shareId: share.id,
                        tradingDate: $scope.currentZone.tradingDate
                    };
                }else{
                    indicatorService.getLatestTradingDateByShare(share.id).then(function (data) {
                        $scope.indicatorInput ={
                            shareId: share.id,
                            tradingDate: data
                        };

                        $scope.noteInput = {
                            shareId: share.id,
                            tradingDate: data
                        };
                    });
                }
            }
        };

        function getStockInfo(shareId)
        {
            $scope.currentShareInfo = null;

            if (shareId && shareId > 0) {
                shareService.getShareInfo(shareId).then(
                    function (data) {
                        $scope.currentShareInfo = data;
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            }

        }
    }
})();