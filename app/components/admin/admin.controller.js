/**
 * Created by steven on 11/03/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout',
        'utilService', 'shareService', 'tickerService'];

    function AdminController($scope, $state, $rootScope, toaster, $timeout,
                             utilService, shareService, tickerService) {
        var vm = this;
        vm.shareList = [];
        vm.isloading = false;
        vm.currentShare = null;
        vm.currentShareInfo = null;
        vm.mainMode = "list";
        vm.detailMode = 'view';
        vm.dtOptions = {
            "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
            "deferRender": true,
            aoColumnDefs: [
                {
                    aTargets: 7,
                    bSortable: true
                }
            ]
        };

        vm.marketList = [];
        vm.chartOptions = null;
        vm.chart = null;

        //vm.dtColumnDefs = {};
        vm.selectShare = selectShare;
        vm.selectChart = selectChart;
        vm.formatIsActive = formatIsActive;
        vm.shareUpdated = shareUpdated;
        vm.createShare = createShare;
        vm.shareCreated = shareCreated;

        activate();

        function activate() {

            vm.isloading = true;

            getShareList();

            if ($rootScope.marketList) {
                vm.marketList = $rootScope.marketList;
            } else {
                getMarketList();
            }

        }

        function createShare() {
            vm.detailMode = 'create';
        }

        function shareCreated(share) {

            vm.shareList.push(share);
        }

        function shareUpdated(share) {
            $timeout(function () {
                utilService.copyObject(share, vm.currentShare);
            }, 0);
        }

        function getShareInfo(shareID) {
            vm.currentShareInfo = null;

            if (shareID && shareID > 0) {
                shareService.getShareInfo(shareID).then(
                    function (data) {
                        vm.currentShareInfo = data;
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            }
        }

        function getMarketList() {
            shareService.getMarketList().then(
                function (data) {
                    vm.marketList = data;
                    $rootScope.marketList = vm.marketList;
                },
                function (err) {
                    console.log(err);
                }
            );
        }


        function getShareList() {
            shareService.getShareList(true).then(
                function (data) {
                    vm.isloading = false;
                    vm.shareList = data;
                    $rootScope.shareList = vm.shareList;


                    if (vm.shareList.length > 0) {
                        vm.currentShare = vm.shareList[0];
                        getShareInfo(vm.currentShare.id);
                    }
                },
                function (err) {
                    vm.isloading = false;
                    console.log(err);
                }
            );
        }

        function selectShare(share) {
            if (vm.detailMode == 'create') {
                vm.detailMode = 'view';
            }

            vm.currentShare = share;
            getShareInfo(vm.currentShare.id);
        }

        function selectChart(share) {
            vm.mainMode = "chart";

            vm.selectShare(share);

            tickerService.getTickerList(share.id).then(
                function (dataReturn) {
                    var data =dataReturn.tickerList;
                    var ohlc = [];
                    var volume = [];
                    var dataLength = data.length;
                    var groupingUnits =
                        [[
                            'week',                         // unit name
                            [1]                             // allowed multiples
                        ], [
                            'month',
                            [1, 2, 3, 4, 5, 6]
                        ]];
                    for (var i = 0; i < dataLength; i += 1) {
                        ohlc.push([
                            data[i].jsTicks, // the date
                            data[i].open, // open
                            data[i].high, // high
                            data[i].low, // low
                            data[i].close // close
                        ]);

                        volume.push([
                            data[i].jsTicks, // the date
                            data[i].volumn // the volume
                        ]);
                    }

                    vm.chartOptions = {
                        rangeSelector: {
                            selected: 1
                        },
                        title: {
                            text: ""
                        },
                        yAxis: [{
                            labels: {
                                align: 'right',
                                x: -3
                            },
                            title: {
                                text: 'OHLC'
                            },
                            height: 300,
                            lineWidth: 1
                        }, {
                            labels: {
                                align: 'right',
                                x: -3
                            },
                            title: {
                                text: 'Volume'
                            },
                            top: 400,
                            height: 120,
                            lineWidth: 1
                        }],
                        series: [{
                            type: 'candlestick',
                            name: 'OCHL',
                            data: ohlc,
                            yAxis: 0,
                            dataGrouping: {
                                units: groupingUnits
                            }
                        },
                            {
                                type: 'column',
                                name: 'Volume',
                                data: volume,
                                yAxis: 1,
                                dataGrouping: {
                                    units: groupingUnits
                                }
                            }],
                        height: 700
                    };
                },
                function (err) {
                    console.log(err);
                }
            );
        }

        function formatIsActive(isActive) {
            var result = 'N';

            if (isActive) {
                result = 'Y';
            }
            return result;
        }
    }
})();

