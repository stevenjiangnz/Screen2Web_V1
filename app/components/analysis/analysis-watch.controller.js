/**
 * Created by steven on 1/05/2016.
 */
(function () {
    "use strict";
    angular.module('screenApp')
        .controller('AnalysisWatchController', AnalysisWatchController);

    AnalysisWatchController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'ngDialog', 'tradeService'];

    function AnalysisWatchController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                                     utilService, shareService, tickerService, analysisService, ngDialog, tradeService) {
        var watchVm = this;
        var currentWatch = {};
        watchVm.watch = {};

        activate();

        function activate() {
            init();

            $timeout(function(){
                watchVm.createWatch();
            },100);

            getWatchList();
        }

        function init() {
            $scope.currentZone = tradeService.getCurrentZone();

            watchVm.dtOptions = {
                "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
                "deferRender": true,
                aoColumnDefs: [
                    {
                        aTargets: 4,
                        bSortable: false
                    }
                ],
                "order": [[ 1, "asc" ]]
            };

            watchVm.detailMode = 'none';
        }

        watchVm.createWatch = function () {
            currentWatch = {};
            watchVm.watch = {};

            watchVm.detailMode = 'create';
        };

        watchVm.updateWatch = function (watch) {
            watchVm.detailMode = 'update';
            currentWatch = watch;
            watchVm.watch = angular.copy(watch);
        };

        watchVm.deleteWatch = function (watch) {
            ngDialog.openConfirm({
                template: '<div style="height:100px"><p>Are you sure you want to delete watch <b>' + watch.id + '</b>?</p>' +
                '<div class="pull-right">' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)">Yes&nbsp;</button>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                '</button></div></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                analysisService.deleteWatch(watch.id).then(function (data) {

                    utilService.copyObject()
                    toaster.success({
                        title: "Delete watch success",
                        body: "Successfully delete watch of " + watch.name
                    });
                });

                watchVm.watchList = _.without(watchVm.watchList, _.findWhere(watchVm.watchList, {id: watch.id}));

                if (currentWatch.id === watch.id) {
                    currentWatch = null;
                    watchVm.detailMode = "none";
                }

            }, function (value) {
                //cancelled, do nothing
            });
        };


        watchVm.submitWatch = function (form) {
            if($scope.currentZone){
                watchVm.watch.zoneId = $scope.currentZone.id;
            }
            else{
                watchVm.watch.zoneId = null;
            }

            if (watchVm.detailMode === 'create') {
                analysisService.createWatch(watchVm.watch).then(function (data) {
                    watchVm.watchList.push(data);

                    toaster.success({
                        title: "Create watch success",
                        body: "Successfully create watch of " + watchVm.watch.name
                    });

                    form.$setPristine();
                    watchVm.watch = null;
                });
            }else {
                analysisService.updateWatch(watchVm.watch).then(function (data) {
                    utilService.copyObject(data, currentWatch);
                    toaster.success({
                        title: "Update watch success",
                        body: "Successfully update watch of " + watchVm.watch.name
                    });
                })
            }
        };

        watchVm.cancelWatch = function (form) {
            if (watchVm.detailMode === 'create') {
                form.$setPristine();
                watchVm.watch = null;
            }
            else {
                watchVm.watch = angular.copy(currentWatch);
            }
        };

        function getWatchList() {
            // Get watch by zone
            var zoneId = null;
            if($scope.currentZone)
                zoneId = $scope.currentZone.id;

            analysisService.getWatchListByZone(zoneId).then(
                function (data) {
                    watchVm.watchList = data;
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