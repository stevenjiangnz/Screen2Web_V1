/**
 * Created by steven on 5/06/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('StockSearchController', StockSearchController);

    StockSearchController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', '$stateParams',
        'appSettings', 'sessionState', 'utilService', 'shareService', 'tickerService', 'indicatorService',
        'tradeService', 'analysisService',
        'ngProgressFactory', 'ngDialog'];

    function StockSearchController($scope, $state, $rootScope, toaster, $timeout, $stateParams,
                                   appSettings, sessionState, utilService, shareService, tickerService,
                                   indicatorService, tradeService, analysisService,
                                   ngProgressFactory, ngDialog) {
        var vm = this;
        var zoneId = null;

        vm.dataLoading = true;
        $scope.sortType = 'shareId'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();

            if ($scope.currentZone)
                zoneId = $scope.currentZone.id;

            vm.search = {};
            $scope.selectedShares = [];
            $scope.sliderPriceChangeValue = 60;

            $scope.slider = {
                optionsPrice: {
                    onEnd: function (sliderId, modelValue, highValue, pointerType) {
                        $scope.search.priceChange = modelValue;
                        $scope.search.priceChangeHigh = highValue;
                    },
                    floor: -5.0,
                    ceil: 5.0,
                    step: 0.01,
                    minLimit: -5.0,
                    maxLimit: 5.0,
                    precision: 2

                },
                optionsPriceSD: {
                    onEnd: function (sliderId, modelValue, highValue, pointerType) {
                        $scope.search.priceChangeSD = modelValue;
                        $scope.search.priceChangeHighSD = highValue;
                    },
                    floor: -5.0,
                    ceil: 5.0,
                    step: 0.01,
                    minLimit: -5.0,
                    maxLimit: 5.0,
                    precision: 2
                },
                optionsBB: {
                    onEnd: function (sliderId, modelValue, highValue, pointerType) {
                        $scope.search.priceBB = modelValue;
                        $scope.search.priceBBHigh = highValue;
                    },
                    floor: -20,
                    ceil: 120,
                    step: 0.1,
                    minLimit: -20,
                    maxLimit: 120,
                    precision: 1
                },
                optionsEMA20: {
                    onEnd: function (sliderId, modelValue, highValue, pointerType) {
                        $scope.search.priceEMA20 = modelValue;
                        $scope.search.priceEMA20High = highValue;
                    },
                    floor: 90,
                    ceil: 110,
                    step: 0.1,
                    minLimit: 90,
                    maxLimit: 110,
                    precision: 1
                },
                optionsVolumeChange: {
                    onEnd: function (sliderId, modelValue, highValue, pointerType) {
                        $scope.search.volumeChange = modelValue;
                        $scope.search.volumeChangeHigh = highValue;
                    },
                    floor: 50,
                    ceil: 150,
                    step: 0.1,
                    minLimit: 50,
                    maxLimit: 150,
                    precision: 1
                },
                optionsAdxChange: {
                    onEnd: function (sliderId, modelValue, highValue, pointerType) {
                        $scope.search.adxChange = modelValue;
                        $scope.search.adxChangeHigh = highValue;
                    },
                    floor: -50,
                    ceil: 50,
                    step: 0.1,
                    minLimit: -50,
                    maxLimit: 50,
                    precision: 1
                },
                optionsMacdChange: {
                    onEnd: function (sliderId, modelValue, highValue, pointerType) {
                        $scope.search.macdChange = modelValue;
                        $scope.search.macdChangeHigh = highValue;
                    },
                    floor: -50,
                    ceil: 50,
                    step: 0.1,
                    minLimit: -50,
                    maxLimit: 50,
                    precision: 1
                }
            };

            $scope.search = {
                priceChange: $scope.slider.optionsPrice.floor,
                priceChangeHigh: $scope.slider.optionsPrice.ceil,
                priceChangeSD: $scope.slider.optionsPriceSD.floor,
                priceChangeHighSD: $scope.slider.optionsPriceSD.ceil,
                priceBB: $scope.slider.optionsBB.floor,
                priceBBHigh: $scope.slider.optionsBB.ceil,
                priceEMA20: $scope.slider.optionsEMA20.floor,
                priceEMA20High: $scope.slider.optionsEMA20.ceil,
                volumeChange: $scope.slider.optionsVolumeChange.floor,
                volumeChangeHigh: $scope.slider.optionsVolumeChange.ceil,
                adxChange: $scope.slider.optionsAdxChange.floor,
                adxChangeHigh: $scope.slider.optionsAdxChange.ceil,
                macdChange: $scope.slider.optionsMacdChange.floor,
                macdChangeHigh: $scope.slider.optionsMacdChange.ceil
            };

            $scope.addToWatchBatch = function () {
                $scope.addBatchDialog = ngDialog.open({
                    template: 'temp-add-watch.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            };

            $scope.submitAddToWatchBatch = function (watchSelected) {
                var shareIds = [];

                _.each($scope.selectedShares, function (data) {
                    shareIds.push(data.shareId);
                });

                analysisService.addWatchListShareBatch(watchSelected, shareIds).then(function (data) {
                    toaster.success({
                        title: "Add shares to watch list success",
                        body: "Successfully add shares ( " + shareIds.length + ') into watch list.'
                    });

                });
                $scope.addBatchDialog.close();
            };

            $scope.removeFromWatchBatch = function () {
                $scope.addBatchDialog = ngDialog.open({
                    template: 'temp-remove-watch.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            };

            $scope.submitRemoveFromWatchBatch = function (watchSelected) {
                var shareIds = [];

                _.each($scope.selectedShares, function (data) {
                    shareIds.push(data.shareId);
                });

                analysisService.removeWatchListShareBatch(watchSelected, shareIds).then(function (data) {
                    toaster.success({
                        title: "Remove shares from watch list success",
                        body: "Successfully remove shares ( " + shareIds.length + ') from watch list.'
                    });

                });
                $scope.addBatchDialog.close();
            };


            $scope.input = angular.copy($scope.search);
            $scope.$watch('search', function (newValue, oldValue) {
                filterList();
            }, true);

            $scope.$watch('selectAll', function (newValue, oldValue) {
                onSelectAll();
            });

            loadWatchList();
            loadDailyScanList();
        }

        vm.search = {};
        $scope.search.stockSector = {};

        vm.deltVol = function (avg, vol) {
            var deltVal = 0;

            if (avg != 0) {
                deltVal = (vol / avg) * 100;
            }
            return deltVal;
        }

        function onSelectAll() {
            $scope.selectedShares = [];

            if ($scope.selectAll) {
                _.each(vm.listDisplay, function (s) {
                    s.selected = true;
                    $scope.selectedShares.push(s);
                });
            }
            else {
                _.each(vm.listDisplay, function (s) {
                    s.selected = false;
                });
            }
        }

        $scope.selectShare = function (s) {
            var i = _.indexOf($scope.selectedShares, s);
            if (s.selected) {
                if (i < 0) {
                    $scope.selectedShares.push(s);
                }
            }
            else {
                if (i >= 0) {
                    $scope.selectedShares.splice(i, 1);
                }
            }
        };

        function loadWatchList() {
            analysisService.getWatchList().then(function (data) {
                $scope.watchList = data;
            });

            var zoneId = null;
            if ($scope.currentZone)
                zoneId = $scope.currentZone.id;

            analysisService.getWatchListByZone(zoneId).then(
                function (data) {
                    $scope.watchListByZone = data;
                }
            );
        }

        function loadDailyScanList() {
/*            analysisService.getScanList().then(function (data) {
                $scope.scanList = data;
            });*/

            analysisService.getDailyScanListByZone(zoneId).then(function (data) {
                $scope.dailyScanList = data;
            });
        }

        $scope.flagClicked = function (ind) {
            displayDetails(ind);
        };

        $scope.submitSearch = function () {
            utilService.startProgressBar();
            var td = utilService.dateToInt($scope.localSearch.tradingDateObj);

            $scope.localSearch.tradingDate = td;

            if ($scope.localSearch.searchType == 'Stock') {
                if (($scope.currentZone == null) && (td == utilService.dateToInt($scope.tradingDateOptions.maxDate))) {
                    shareService.getShareDailyLatest().then(function (data) {
                        vm.indicatorList = data;
                        vm.dataLoading = false;
                        utilService.completeProgressBar();
                        postSearchProcess();
                    });
                }
                else {
                    shareService.searchShareDaily(td).then(function (data) {
                        vm.indicatorList = data;

                        vm.dataLoading = false;
                        utilService.completeProgressBar();

                        postSearchProcess();
                    });
                }
            }

            if ($scope.localSearch.searchType == 'Watch') {
                if ($scope.localSearch.tradingDate && $scope.localSearch.watchId) {
                    searchWatch();
                }
                else {
                    toaster.warning({
                        title: "Missing Inputs",
                        body: "Trading Date and Watch List are both required"
                    });
                }

                utilService.completeProgressBar();

            }

            if ($scope.localSearch.searchType == 'Alert') {
                searchByAlert();
            }

            if ($scope.localSearch.searchType == 'Scan') {
                searchByScan();
            }
        };

        function searchWatch() {
            shareService.searchShareByWatch($scope.localSearch.watchId,
                $scope.localSearch.tradingDate,
                $scope.localSearch.watchReverse).then(function (data) {
                vm.indicatorList = data;

                vm.dataLoading = false;
                utilService.completeProgressBar();

                postSearchProcess();
            });
        }

        function searchByScan() {
            shareService.searchShareByDailyScan($scope.localSearch.tradingDate,
                $scope.localSearch.scanId,
                $scope.localSearch.scanForce).then(function (data) {
                vm.indicatorList = data;

                vm.dataLoading = false;
                utilService.completeProgressBar();

                postSearchProcess();
            });
        }

        function searchByAlert() {
            shareService.searchShareByAlert($scope.localSearch.tradingDate,
                $scope.localSearch.alertForce, zoneId).then(function (data) {
                vm.indicatorList = data;

                vm.dataLoading = false;
                utilService.completeProgressBar();

                postSearchProcess();
            });
        }


        function postSearchProcess() {

            _.each(vm.indicatorList, function (ind) {
                ind.delt_Vol = vm.deltVol(ind.vol_AVG10, ind.volumn);
                ind.delt_Adx = ind.adX_Plus - ind.adX_Minus;

                ind.flag_Heikin = 0;
                if (ind.heikin_Close > ind.heikin_Open)
                    ind.flag_Heikin = 1;
                if (ind.heikin_Close < ind.heikin_Open)
                    ind.flag_Heikin = -1;

                ind.delt_PriceSD = 0;
                if (ind.open != 0) {
                    ind.delt_PriceSD = ((ind.close - ind.open) / ind.open) * 100;
                }

            });

            filterList();

            getSectorList('Stock');
        }

        function displayDetails(ind) {
            $scope.tradingDate = ind.tradingDate;

            $scope.currentShare = {
                id: ind.shareId,
                symbol: ind.symbol,
                shareType: ind.shareType,
                name: ind.name,
                industry: ind.industry,
                tradingDate: ind.tradingDate
            };
        }

        function filterList() {
            $scope.selectedShares = [];
            var listProcess = angular.copy(vm.indicatorList);

            listProcess = _.where(listProcess, {shareType: $scope.search.shareType});


            if ($scope.search.iscfd) {
                listProcess = _.filter(listProcess, function (ind) {
                    var match = ind.isCfd;
                    return match;
                });
            }


            if ($scope.search.symbol && $scope.search.symbol.length > 0) {
                listProcess = _.filter(listProcess, function (ind) {
                    var match = (ind.symbol.toLowerCase().indexOf($scope.search.symbol.toLowerCase()) > -1) ||
                        (ind.name.toLowerCase().indexOf($scope.search.symbol.toLowerCase()) > -1);
                    return match;
                });
            }

            // filter by sector
            if (!isAllSectorSelected($scope.search.stockSector)) {
                listProcess = _.filter(listProcess, function (ind) {
                    return $scope.search.stockSector[ind.sector];
                });
            }

            // filter by price Change
            if ($scope.search.priceChange != $scope.slider.optionsPrice.floor ||
                $scope.search.priceChangeHigh != $scope.slider.optionsPrice.ceil) {
                listProcess = _.filter(listProcess, function (ind) {
                    var result = ($scope.search.priceChange == $scope.slider.optionsPrice.floor || $scope.search.priceChange <= ind.delt_Price) &&
                        ($scope.search.priceChangeHigh == $scope.slider.optionsPrice.ceil || $scope.search.priceChangeHigh >= ind.delt_Price);

                    if ($scope.search.priceChangeRev) {
                        result = !result;
                    }

                    return result;
                });
            }

            // filter by price Change Sane day
            if ($scope.search.priceChangeSD != $scope.slider.optionsPriceSD.floor ||
                $scope.search.priceChangeHighSD != $scope.slider.optionsPriceSD.ceil) {
                listProcess = _.filter(listProcess, function (ind) {

                    var result = ($scope.search.priceChangeSD == $scope.slider.optionsPriceSD.floor || $scope.search.priceChangeSD <= ind.delt_PriceSD) &&
                        ($scope.search.priceChangeHighSD == $scope.slider.optionsPriceSD.ceil || $scope.search.priceChangeHighSD >= ind.delt_PriceSD);

                    if ($scope.search.priceChangeSDRev) {
                        result = !result;
                    }

                    return result;
                });
            }

            // filter by price BB
            if ($scope.search.priceBB != $scope.slider.optionsBB.floor ||
                $scope.search.priceBBHigh != $scope.slider.optionsBB.ceil) {
                listProcess = _.filter(listProcess, function (ind) {
                    var range = ind.bB_High - ind.bB_Low;

                    var result = ($scope.search.priceBB == $scope.slider.optionsBB.floor || (ind.bB_Low + range * ($scope.search.priceBB / 100)) <= ind.close) &&
                        ($scope.search.priceBBHigh == $scope.slider.optionsBB.ceil || (ind.bB_Low + range * ($scope.search.priceBBHigh / 100)) >= ind.close);

                    if ($scope.search.priceBBRev) {
                        result = !result;
                    }

                    return result;
                });
            }


            // filter by price ema 20
            if ($scope.search.priceEMA20 != $scope.slider.optionsEMA20.floor ||
                $scope.search.priceEMA20High != $scope.slider.optionsEMA20.ceil) {
                listProcess = _.filter(listProcess, function (ind) {
                    var result = ($scope.search.priceEMA20 == $scope.slider.optionsEMA20.floor || $scope.search.priceEMA20 <= (ind.close / ind.emA20) * 100) &&
                        ($scope.search.priceEMA20High == $scope.slider.optionsEMA20.ceil || $scope.search.priceEMA20High >= (ind.close / ind.emA20) * 100);

                    if ($scope.search.priceEMA20Rev) {
                        result = !result;
                    }

                    return result;
                });
            }

            // filter by volume Change
            if ($scope.search.adxChange != $scope.slider.optionsAdxChange.floor ||
                $scope.search.adxChangeHigh != $scope.slider.optionsAdxChange.ceil) {
                listProcess = _.filter(listProcess, function (ind) {
                    var result = ($scope.search.adxChange == $scope.slider.optionsAdxChange.floor || $scope.search.adxChange <= ind.delt_Adx) &&
                        ($scope.search.adxChangeHigh == $scope.slider.optionsAdxChange.ceil || $scope.search.adxChangeHigh >= ind.delt_Adx);

                    if ($scope.search.adxChangeRev) {
                        result = !result;
                    }

                    return result;
                });
            }

            // filter by adx
            if ($scope.search.volumeChange != $scope.slider.optionsVolumeChange.floor ||
                $scope.search.volumeChangeHigh != $scope.slider.optionsVolumeChange.ceil) {
                listProcess = _.filter(listProcess, function (ind) {
                    var result = ($scope.search.volumeChange == $scope.slider.optionsVolumeChange.floor || $scope.search.volumeChange <= ind.delt_Vol) &&
                        ($scope.search.volumeChangeHigh == $scope.slider.optionsVolumeChange.ceil || $scope.search.volumeChangeHigh >= ind.delt_Vol);

                    if ($scope.search.volumeChangeRev) {
                        result = !result;
                    }

                    return result;
                });
            }

            // filter by adx
            if ($scope.search.macdChange != $scope.slider.optionsMacdChange.floor ||
                $scope.search.macdChangeHigh != $scope.slider.optionsMacdChange.ceil) {
                listProcess = _.filter(listProcess, function (ind) {
                    var result = ($scope.search.macdChange == $scope.slider.optionsMacdChange.floor || $scope.search.macdChange <= ind.delt_MACD_Hist) &&
                        ($scope.search.macdChangeHigh == $scope.slider.optionsMacdChange.ceil || $scope.search.macdChangeHigh >= ind.delt_MACD_Hist);

                    if ($scope.search.macdChangeRev) {
                        result = !result;
                    }

                    return result;
                });
            }

            // Check Heikin
            if ($scope.search.HeikinToPositive || $scope.search.HeikinToNegative) {
                listProcess = _.filter(listProcess, function (ind) {
                    var result = false;

                    if ($scope.search.HeikinToPositive) {
                        if (ind.flag_Heikin > 0) {
                            result = true;
                        }
                    }

                    if ($scope.search.HeikinToNegative) {
                        if (ind.flag_Heikin < 0) {
                            result = true;
                        }
                    }

                    return result;
                });
            }

            vm.listDisplay = listProcess;

            $timeout(function () {
                drawSummaryChart();
            }, 100);
        }

        vm.toggleSectorAll = function () {
            var sectors = $scope.search.stockSector
            var tobe = isAllSectorSelected(sectors);

            for (var k in sectors) {
                sectors[k] = !tobe;
            }
        };


        function isAllSectorSelected(sectors) {
            var allSelected = true;
            for (var k in sectors) {
                if (sectors[k] == false) {
                    allSelected = false;
                    break;
                }
            }

            return allSelected;
        }

        function getSectorList(type) {
            var stockList = _.filter(vm.indicatorList, function (ind) {
                return ind.shareType == type;
            });

            var sectorList = _.uniq(stockList, function (x) {
                return x.sector;
            });

            vm.stockSectorList = _.pluck(_.sortBy(sectorList, 'sector'), 'sector');

            _.each(vm.stockSectorList, function (stockSector) {

                $scope.search.stockSector[stockSector] = true;
            });

        }

        function prepareSummaryData() {
            var series = [];
            var sectorList = _.uniq(vm.listDisplay, function (x) {
                return x.sector;
            });

            var sectors = _.pluck(_.sortBy(sectorList, 'sector'), 'sector');

            var bands = ['over 5%', '3% to 5%', '1% to 3%', '0 to 1%', '-1% to 0', '-3% to -1%', '-3% to -5%', 'under -5%'];

            for (var i = 0; i < bands.length; i++) {
                var sectorData = [];
                for (var j = 0; j < sectors.length; j++) {
                    sectorData.push(0);
                }
                series.push({
                    name: bands[i],
                    data: sectorData
                });
            }

            _.each(vm.listDisplay, function (ind) {
                var bIndex = -1;
                var sIndex = -1;

                var priceChange = ind.delt_PriceSD;

                if (priceChange >= 5) {
                    bIndex = 0;
                } else if (priceChange >= 3) {
                    bIndex = 1;
                } else if (priceChange >= 1) {
                    bIndex = 2;
                } else if (priceChange >= -0) {
                    bIndex = 3;
                } else if (priceChange >= -1) {
                    bIndex = 4;
                } else if (priceChange >= -3) {
                    bIndex = 5;
                } else if (priceChange >= -5) {
                    bIndex = 6;
                } else {
                    bIndex = 7;
                }

                sIndex = _.indexOf(sectors, ind.sector);

                series[bIndex].data[sIndex] = series[bIndex].data[sIndex] + 1;
            });

            var result = {
                category: sectors,
                data: series
            };

            return result;
        }


        function drawSummaryChart() {
            var result = prepareSummaryData();

            if (result && result.category && result.category.length > 0) {
                $scope.summaryOptions = {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Price Change Summary'
                    },
                    xAxis: {
                        categories: result.category
                    },
                    yAxis: {
                        min: 0,
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        }
                    },
                    legend: {
                        align: 'right',
                        x: -30,
                        verticalAlign: 'top',
                        y: 25,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                style: {
                                    textShadow: '0 0 3px black'
                                }
                            }
                        }
                    },
                    series: result.data
                };
            }
            $scope.chartControl = {};
        }


        $scope.tradingDateOptions = {
            dateDisabled: false,
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.format = 'yyyy-MM-dd';
        $scope.tradingDateOpen = function () {

            $scope.tradingDatePop.opened = true;
        };

        $scope.tradingDatePop = {
            opened: false
        };

        $timeout(function () {
            getLatestTradingDate();

        }, 100);

        function getLatestTradingDate() {
            $scope.currentZone = tradeService.getCurrentZone();

            if ($scope.currentZone) {
                $scope.localSearch.tradingDateObj = utilService.intToDate($scope.currentZone.tradingDate);
                $scope.tradingDateOptions.maxDate = $scope.localSearch.tradingDateObj;
            }
            else {
                indicatorService.getLatestTradingDate().then(function (data) {
                    $scope.localSearch.tradingDateObj = utilService.intToDate(data);
                    $scope.tradingDateOptions.maxDate = $scope.localSearch.tradingDateObj;
                });
            }
        }
    }
})();