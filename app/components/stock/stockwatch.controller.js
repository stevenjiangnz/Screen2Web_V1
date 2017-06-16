/**
 * Created by steven on 14/05/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('StockWatchController', StockWatchController);

    StockWatchController.$inject = ['$scope', '$q', '$state', '$rootScope', 'toaster', '$timeout',
        'utilService', 'shareService', 'tickerService', 'analysisService','tradeService'];

    function StockWatchController($scope, $q, $state, $rootScope, toaster, $timeout,
                                  utilService, shareService, tickerService, analysisService, tradeService) {
        $scope.watchList = [];

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();
        }

        $scope.ShowWatchList = function() {
            $scope.currentZone = tradeService.getCurrentZone();
            var zoneId = null;
            if($scope.currentZone)
                zoneId = $scope.currentZone.id;

            if ($scope.watchList.length > 0) {
                LoadWatchListForStock();
            }
            else {
                analysisService.getWatchListByZone(zoneId).then(
                    function (data) {

                        $scope.watchList = data;
                        LoadWatchListForStock();
                    }
                );
            }
        };

        function LoadWatchListForStock() {
            analysisService.getWatchListByShare($scope.currentShare.id).then(
                function (data)
                {
                    for(var i=0; i<$scope.watchList.length; i++)
                    {
                        var cwatch = $scope.watchList[i];

                        cwatch.ticked = false;

                        for(var j=0; j< data.length;j++)
                        {
                            if(cwatch.id == data[j])
                            {
                                cwatch.ticked = true;
                            }
                        }
                    }
                }
            );
        }

        $scope.setWatchListShare = function (watch) {
            if(watch.ticked)
            {
                analysisService.addWatchListShare(watch.id, $scope.currentShare.id).then(
                    function(){
                        toaster.success({
                            title: "Add share to watch list success",
                            body: "Successfully add share ( " + $scope.currentShare.symbol + ') to watch list (' + watch.name + ')'
                        });
                    }
                );
            }
            else
            {
                analysisService.removeWatchListShare(watch.id, $scope.currentShare.id).then(
                    function(){
                        toaster.success({
                            title: "Remove share to watch list success",
                            body: "Successfully remove share ( " + $scope.currentShare.symbol + ') from watch list (' + watch.name + ')'
                        });
                    }
                );
            }

        };

        function getWatchList() {
            var deferred = $q.defer();

            analysisService.getWatchList().then(
                function (data) {

                    deferred.resolve(data);
                },
                function (err) {
                    deferred.reject(err);
                }
            );

            return deferred.promise;
        }
    }
})();