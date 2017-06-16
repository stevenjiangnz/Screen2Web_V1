/**
 * Created by steven on 16/04/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('StockChartController', StockChartController);

    StockChartController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'indicatorService'];

    function StockChartController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                                  utilService, shareService, tickerService, indicatorService) {
        var shareId
        var tickers;
        var indicators;
        var groupingUnits;
        var chartOptions;
        var ohlc;
        var close;
        var volume;
        var len;
        var heikinList = [];
        var open_heikinList = [];
        var high_heikinList = [];
        var low_heikinList = [];
        var close_heikinList = [];

        activate();

        function activate() {

            groupingUnits =
                [[
                    'week',                         // unit name
                    [1]                             // allowed multiples
                ], [
                    'month',
                    [1, 2, 3, 4, 5, 6]
                ]];


        }

        $scope.drawChart = drawChart;
        $scope.getColorStyle = getColorStyle;

        function initChartOption() {
            // init chart base option
            chartOptions = {
                rangeSelector: {
                    selected: 1
                },
                title: {
                    text: $scope.setting.title,
                    align: 'center',
                    x: 0,
                    verticalAlign: 'top',
                    y: 10
                },
                xAxis: {
                    type: 'datetime',
                    crosshair: {
                        label: {
                            enabled: true,
                            padding: 8
                        }
                    },
                    opposite:true
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
                    lineWidth: 1,
                    top: 130,
                    crosshair: {
                        label: {
                            enabled: false
                            //padding: 8
                        }
                    }
                }, {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    top: 340,
                    height: 90,
                    lineWidth: 1,
                    offset: -6,
                    opposite: false
                }],
                series: [{
                    type: 'column',
                    name: 'Volume',
                    data: volume,
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },

                    cursor: 'pointer'

                }
                ],
                navigator: {
                    height: 10,
                    top: 90
                },
                tooltip: {
                    enabled: false
                },
                height: 470
            };

            // Add flags into the charts
            addFlags();

            heikinList = [];
            open_heikinList = [];
            high_heikinList = [];
            low_heikinList = [];
            close_heikinList = [];
        }

        function addFlags(){
            var flagData = [];
            if($scope.setting.flags &&$scope.setting.flags.length > 0 &&
                $scope.setting.shareId == $scope.setting.flagShareId)
            {
                // Set the max to position the nav
                chartOptions.xAxis.max = utilService.intToTick($scope.setting.maxDate);

                var type ="+";
                if($scope.setting.flagType == "Sell")
                {
                    type = '-';
                }

                _.each($scope.setting.flags, function(f){
                    flagData.push({
                        x: utilService.intToTick(f),
                        title: type
                    });
                });

                chartOptions.series.push({
                    type: 'flags',
                    name: 'Flags on axis',
                    data: flagData,
                    shape: 'circlepin',
                    fillColor: "#FFD455"
                });

            }
        }

        function drawChart() {


            shareId = $scope.setting.shareId;
            var startDate = $scope.setting.startDate;
            var endDate = $scope.setting.endDate;
            utilService.startProgressBar();

            var indicatorString = getChartSettingInputString();

            tickerService.getTickerList(shareId, startDate, endDate, indicatorString).then(
                function (dataReturn) {
                    tickers = dataReturn.tickerList;
                    indicators = dataReturn.indicators;

                    if(tickers && tickers.length > 0) {
                        prepareData(tickers);

                        displayChartBase(indicators);

                        displayChartTickers();
                    }
                    else{
                        toaster.warning({
                            title: "0 ticker returned",
                            body: "Might need adjust the date range and try again."
                        });
                    }
                    utilService.completeProgressBar();
                },
                function (data) {
                    utilService.completeProgressBar();
                }
            );
        }

        function prepareData(data) {
            len = tickers.length;
            ohlc = [];
            volume = [];
            close = [];

            for (var i = 0; i < len; i += 1) {
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

                close.push([
                    data[i].jsTicks, // the date
                    data[i].high
                ]);

            }
        }


        function displayChartBase(indicators) {
            initChartOption();

            var base = 450;
            var gap = 10;
            var bottom = 20;
            var plotColor = '#bbb';


            for (var k in indicators) {
                var setting = indicatorService.getIndicatorSettingByParameter(k);
                if (setting && setting.ownPane) {

                    var indicatorName = setting.parameter.split(',')[0];

                    switch (indicatorName) {
                        case 'rsi':
                            chartOptions.yAxis.push({
                                id: 'RSI',
                                title: {
                                    text: 'RSI'
                                },
                                min: 0,
                                max: 100,
                                plotLines: [{
                                    value: 30,
                                    color: plotColor,
                                    dashStyle: 'shortdash',
                                    width: 1
                                }, {
                                    value: 70,
                                    color: plotColor,
                                    dashStyle: 'shortdash',
                                    width: 1
                                }],
                                lineWidth: 1,
                                top: base + gap,
                                height: setting.height
                            });

                            chartOptions.height = base + gap + setting.height;

                            base = chartOptions.height;
                            break;
                        case 'adx':
                            if (!getChartOptionyAxisbyId('ADX')) {
                                chartOptions.yAxis.push({
                                    id: 'ADX',
                                    title: {
                                        text: 'ADX'
                                    },
                                    lineWidth: 1,
                                    top: base + gap,
                                    height: setting.height
                                });
                                chartOptions.height = base + gap + setting.height;
                                base = chartOptions.height;
                            }
                            break;
                        case 'macd':
                            if (!getChartOptionyAxisbyId('MACD')) {
                                chartOptions.yAxis.push({
                                    id: 'MACD',
                                    title: {
                                        text: 'MACD'
                                    },
                                    lineWidth: 1,
                                    top: base + gap,
                                    height: setting.height
                                });
                                chartOptions.height = base + gap + setting.height;
                                base = chartOptions.height;
                            }
                            break;
                        case 'heikin':
                            if (!getChartOptionyAxisbyId('HEIKIN')) {
                                chartOptions.yAxis.push({
                                    id: 'HEIKIN',
                                    title: {
                                        text: 'HEIKIN'
                                    },
                                    lineWidth: 1,
                                    top: base + gap,
                                    height: setting.height
                                });
                                chartOptions.height = base + gap + setting.height;
                                base = chartOptions.height;
                            }
                            break;
                        case 'stochastic':
                            if (!getChartOptionyAxisbyId('STOCHASTIC')) {
                                chartOptions.yAxis.push({
                                    id: 'STOCHASTIC',
                                    title: {
                                        text: 'STOCHASTIC'
                                    },
                                    lineWidth: 1,
                                    min: 0,
                                    max: 100,
                                    top: base + gap,
                                    height: setting.height,
                                    plotLines: [{
                                        value: 20,
                                        color: plotColor,
                                        dashStyle: 'shortdash',
                                        width: 1
                                    }, {
                                        value: 80,
                                        color: plotColor,
                                        dashStyle: 'shortdash',
                                        width: 1
                                    }]
                                });
                                chartOptions.height = base + gap + setting.height;
                                base = chartOptions.height;
                            }
                            break;
                        case 'william':
                            if (!getChartOptionyAxisbyId('WILLIAM')) {
                                chartOptions.yAxis.push({
                                    id: 'WILLIAM',
                                    title: {
                                        text: 'WILLIAM'
                                    },
                                    lineWidth: 1,
                                    min: -100,
                                    max: 0,
                                    top: base + gap,
                                    height: setting.height,
                                    plotLines: [{
                                        value: setting.threshold1,
                                        color: plotColor,
                                        dashStyle: 'shortdash',
                                        width: 1
                                    }, {
                                        value: setting.threshold2,
                                        color: plotColor,
                                        dashStyle: 'shortdash',
                                        width: 1
                                    }]
                                });
                                chartOptions.height = base + gap + setting.height;
                                base = chartOptions.height;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }

            chartOptions.height = chartOptions.height + bottom;

            $scope.chartOptions = chartOptions;
        }

        function displayChartTickers() {
            var color = indicatorService.getIndicatorColor("ema20");
            $timeout(function () {
                // add base price
                if ($scope.setting.priceType === "OCHL") {
                    addChartIndicatorSeries('candlestick', 'OCHL', ohlc, null, 0);
                }
                else {
                    color = indicatorService.getIndicatorColorByName("closemain");
                    addChartIndicatorSeries('line', 'Line', close, color, 0);
                }
                displayIndicators(indicators);
            }, 200);

        }

        function displayIndicators(indicators) {
            for (var k in indicators) {
                var setting = indicatorService.getIndicatorSettingByParameter(k);

                if (setting && (!setting.ownPane)) {
                    displayIndicatorChart(k, indicators[k]);
                } else {
                    displayIndicatorChartPane(k, indicators[k], setting);
                }
            }
        }

        function displayIndicatorChartPane(name, indicatorData, setting) {
            var indicatorName = name.split(',')[0];

            switch (indicatorName) {
                case 'rsi':
                    var colorRsi = setting.colorRsi
                    displayIndicator_RSI(name, indicatorData, colorRsi);
                    break;
                case 'adx':
                    var colorAdx = setting.colorAdx;
                    displayIndicator_ADX(name, indicatorData, colorAdx);
                    break;
                case 'adx_di+':
                    var colorPlus = setting.colorDiPlus;
                    displayIndicator_ADX(name, indicatorData, colorPlus);
                    break;
                case 'adx_di-':
                    var colorMinus = setting.colorDiMinus;
                    displayIndicator_ADX(name, indicatorData, colorMinus);
                    break;
                case 'macd':
                    var colorMacd = setting.colorMacd;
                    displayIndicator_MACD(name, indicatorData, colorMacd);
                    break;
                case 'signal_macd':
                    var colorSignal = setting.colorSignal;
                    displayIndicator_MACD(name, indicatorData, colorSignal);
                    break;
                case 'hist_macd':
                    var colorHist = setting.colorHist;
                    displayIndicator_MACD(name, indicatorData, colorHist);
                    break;
                case 'open_heikin':
                    open_heikinList = indicatorData;
                    break;
                case 'high_heikin':
                    high_heikinList = indicatorData;
                    break;
                case 'low_heikin':
                    low_heikinList = indicatorData;
                    break;
                case 'close_heikin':
                    close_heikinList = indicatorData;
                    var len = close_heikinList.length;

                    for (var i = 0; i < len; i++) {
                        heikinList.push([
                            ohlc[i][0],
                            open_heikinList[i],
                            high_heikinList[i],
                            low_heikinList[i],
                            close_heikinList[i]
                        ]);
                    }
                    displayIndicator_HEIKIN(name, heikinList);
                    break;
                case 'stochastic':
                    var kdColor;
                    if (name.indexOf('_k') >= 0) {
                        kdColor = setting.colorK;
                    }
                    else {
                        kdColor = setting.colorD;
                    }
                    displayIndicator_STOCHASTIC(name, indicatorData, kdColor);
                    break;
                case 'william':
                    var colorW = setting.colorWilliam;
                    displayIndicator_WILLIAM(name, indicatorData, colorW);
                    break;
                default:
                    break;
            }
        }

        function displayIndicator_WILLIAM(name, indicatorData, color) {
            var data = [];
            var yAxisIndex;

            for (var i = 0; i < $scope.chart.yAxis.length; i++) {
                var y = getyAxisByID('WILLIAM');
                if (y) {
                    yAxisIndex = y.options.index;
                }
            }
            for (var i = 0; i < indicatorData.length; i++) {
                data.push(
                    [
                        ohlc[i][0], // the date
                        indicatorData[i]
                    ]
                );
            }

            addChartIndicatorSeries('line', name, data, color, yAxisIndex);
        }

        function displayIndicator_STOCHASTIC(name, indicatorData, color) {
            var data = [];
            var yAxisIndex;

            for (var i = 0; i < $scope.chart.yAxis.length; i++) {
                var y = getyAxisByID('STOCHASTIC');
                if (y) {
                    yAxisIndex = y.options.index;
                }
            }
            for (var i = 0; i < indicatorData.length; i++) {
                data.push(
                    [
                        ohlc[i][0], // the date
                        indicatorData[i]
                    ]
                );
            }

            addChartIndicatorSeries('line', name, data, color, yAxisIndex);
        }


        function displayIndicator_HEIKIN(name, indicatorData) {
            var yAxisIndex;

            for (var i = 0; i < $scope.chart.yAxis.length; i++) {
                var y = getyAxisByID('HEIKIN');
                if (y) {
                    yAxisIndex = y.options.index;
                }
            }

            addChartIndicatorSeries('candlestick', name, indicatorData, null, yAxisIndex);
        }

        function displayIndicator_MACD(name, indicatorData, color) {
            var data = [];
            var yAxisIndex;

            for (var i = 0; i < $scope.chart.yAxis.length; i++) {
                var y = getyAxisByID('MACD');
                if (y) {
                    yAxisIndex = y.options.index;
                }
            }
            for (var i = 0; i < indicatorData.length; i++) {
                data.push(
                    [
                        ohlc[i][0], // the date
                        indicatorData[i]
                    ]
                );
            }

            if (name.indexOf('hist') >= 0) {
                addChartIndicatorSeries('column', name, data, color, yAxisIndex);
            }
            else {
                addChartIndicatorSeries('line', name, data, color, yAxisIndex);
            }
        }

        function displayIndicator_RSI(name, indicatorData, color) {
            var data = [];
            var yAxisIndex;

            for (var i = 0; i < $scope.chart.yAxis.length; i++) {
                var y = getyAxisByID('RSI');
                if (y) {
                    yAxisIndex = y.options.index;
                }
            }
            for (var i = 0; i < indicatorData.length; i++) {
                data.push(
                    [
                        ohlc[i][0], // the date
                        indicatorData[i]
                    ]
                );
            }

            addChartIndicatorSeries('line', name, data, color, yAxisIndex);
        }

        function displayIndicator_ADX(name, indicatorData, color) {
            var data = [];
            var yAxisIndex;

            for (var i = 0; i < $scope.chart.yAxis.length; i++) {
                var y = getyAxisByID('ADX');
                if (y) {
                    yAxisIndex = y.options.index;
                }
            }
            for (var i = 0; i < indicatorData.length; i++) {
                data.push(
                    [
                        ohlc[i][0], // the date
                        indicatorData[i]
                    ]
                );
            }

            addChartIndicatorSeries('line', name, data, color, yAxisIndex);
        }

        function getyAxisByID(id) {
            var y = null;

            if ($scope.chart && $scope.chart.yAxis) {
                for (var i = 0; i < $scope.chart.yAxis.length; i++) {
                    if ($scope.chart.yAxis[i].options.id === id) {
                        y = $scope.chart.yAxis[i];
                        break;
                    }
                }
            }
            return y;
        }

        function getChartOptionyAxisbyId(id) {
            var y = null;

            for (var i = 0; i < chartOptions.yAxis.length; i++) {
                if (chartOptions.yAxis[i].id === id) {
                    y = chartOptions.yAxis[i];
                    break;
                }
            }
            return y;
        }

        function displayIndicatorChart(name, indicatorData) {
            var data = [];
            var color;
            for (var i = 0; i < indicatorData.length; i++) {
                data.push(
                    [
                        ohlc[i][0], // the date
                        indicatorData[i]
                    ]
                );
            }

            color = indicatorService.getIndicatorColor(name);
            addChartIndicatorSeries('line', name, data, color, 0);
        }

        function getColorStyle(indicationName) {
            var colorString = indicatorService.getIndicatorColorByName(indicationName);
            return {color: colorString};
        }

        function addChartIndicatorSeries(type, name, data, color, yAxis) {
            $scope.chart.addSeries(
                {
                    type: type,
                    name: name,
                    data: data,
                    yAxis: yAxis,
                    color: color,
                    lineWidth: 1,
                    cursor: 'pointer',
                    events: {
                        click: function (event) {
                            var tick = parseInt(event.point.category)

                            var intDate = utilService.dateToInt(new Date(tick));

                            $scope.$emit('chartIndicatorSelected',
                                {
                                    'shareId': shareId,
                                    'tradingDate' : intDate
                                });
                        }
                    }
                });

        }

        function getChartSettingInputString() {
            var indicatorString = '';
            for (var k in $scope.setting.switch) {
                if ($scope.setting.switch[k]) {
                    if (indicatorString.length == 0) {
                        indicatorString = appSettings.indicatorSettings[k].parameter;
                    }
                    else {
                        indicatorString = indicatorString + '|' + appSettings.indicatorSettings[k].parameter;
                    }
                }
            }

            return indicatorString;
        }
    }
})();