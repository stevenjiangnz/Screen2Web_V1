/**
 * Created by steven on 21/02/2016.
 */
(function () {
    'use strict'

    var app = angular.module('screenApp', ['ui.router', 'ui.bootstrap', 'ngResource', 'ngFileUpload',
        'LocalStorageModule', 'ngDialog', 'isteven-multi-select', 'ui.tinymce',
        'angular-jwt', 'ngProgress', 'blockUI', 'ngAnimate', 'toaster', 'datatables', 'treeControl',
        'angularUtils.directives.dirPagination', 'rzModule', 'angucomplete-alt']);

    app.service('apiInterceptor', ['$rootScope',
        function ($rootScope) {
            var service = this;

            service.request = function (config) {

                if ($rootScope.authState && $rootScope.authState.isAuthed && $rootScope.authState.authData) {
                    var token = $rootScope.authState.authData.token;

                    config.headers.authorization = 'bearer ' + token;

                    config.headers["Content-Type"] = 'application/json; charset=UTF-8';

                    if(config.headers["enctype"] == 'multipart/form-data')
                    {
                        config.headers["Content-Type"] = undefined;
                    }
                }

                return config;
            };

            service.responseError = function (response) {
                if (response.status === 401) {
                    $rootScope.$broadcast('unauthorized');
                }
                return response;
            };
        }]);


    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'blockUIConfig',
        function ($stateProvider, $urlRouterProvider, $httpProvider, blockUIConfig) {
            $urlRouterProvider.otherwise('/home');
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'app/components/home/partial-home.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('stock', {
                    url: '/stock/{shareId}?setting',
                    templateUrl: 'app/components/stock/partial-stock.html',
                    controller: 'StockController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('stocksearch', {
                    url: '/stocksearch',
                    templateUrl: 'app/components/stock/partial-stocksearch.html',
                    controller: 'StockSearchController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('analysis', {
                    url: '/analysis',
                    templateUrl: 'app/components/analysis/partial-analysis.html',
                    controller: 'AnalysisController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('analysis.watch', {
                    url: '/analysis-watch',
                    templateUrl: 'app/components/analysis/partial-analysis-watch.html',
                    controller: 'AnalysisWatchController',
                    controllerAs: 'watchVm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('analysis.watchdetail', {
                    url: '/analysis-watchdetail/{watchId}',
                    templateUrl: 'app/components/analysis/partial-analysis-watchdetail.html',
                    controller: 'AnalysisWatchDetailController',
                    controllerAs: 'wdVm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('analysis.rule', {
                    url: '/rule',
                    templateUrl: 'app/components/analysis/partial-analysis-rule.html',
                    controller: 'RuleController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('analysis.scan', {
                    url: '/analysis-scan',
                    templateUrl: 'app/components/analysis/partial-analysis-scan.html',
                    controller: 'ScanController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('analysis.alertlist', {
                    url: '/analysis-alertlist',
                    templateUrl: 'app/components/analysis/partial-analysis-alertlist.html',
                    controller: 'AlertListController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('analysis.dailyscan', {
                    url: '/analysis-dailyscan',
                    templateUrl: 'app/components/analysis/partial-analysis-dailyscan.html',
                    controller: 'DailyScanController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('scanresult', {
                    url: '/analysis-scanresult?mode&scanid',
                    templateUrl: 'app/components/analysis/partial-analysis-scanresult.html',
                    controller: 'ScanResultController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/components/login/partial-login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
                })
                .state('trade', {
                    url: '/trade',
                    templateUrl: 'app/components/trade/partial-trade.html',
                    controller: 'TradeController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('trade.zone', {
                    url: '/trade-zone',
                    templateUrl: 'app/components/trade/partial-trade-zone.html',
                    controller: 'ZoneController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('trade.broker', {
                    url: '/trade-broker',
                    templateUrl: 'app/components/trade/partial-trade-broker.html',
                    controller: 'BrokerController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('trade.account', {
                    url: '/trade-account',
                    templateUrl: 'app/components/trade/partial-trade-account.html',
                    controller: 'AccountController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('trade.order', {
                    url: '/trade-order',
                    templateUrl: 'app/components/trade/partial-trade-order.html',
                    controller: 'OrderController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('trade.transaction', {
                    url: '/trade-transaction',
                    templateUrl: 'app/components/trade/partial-trade-transaction.html',
                    controller: 'PositionSummaryController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('trade.accountdetail', {
                    url: '/trade-accountdetail',
                    templateUrl: 'app/components/trade/partial-account-detail.html',
                    controller: 'AccountDetailController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('plan', {
                    url: '/plan',
                    templateUrl: 'app/components/plan/partial-plan.html',
                    //controller: 'PlanController',
                    //controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('plan.list', {
                    url: '/plan-list',
                    templateUrl: 'app/components/plan/partial-plan-plan.html',
                    controller: 'PlanPlanController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('plan.journey', {
                    url: '/plan-journey',
                    templateUrl: 'app/components/plan/partial-plan-journey.html',
                    controller: 'PlanJourneyController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('plan.idea', {
                    url: '/plan-idea',
                    templateUrl: 'app/components/plan/partial-plan-idea.html',
                    controller: 'PlanIdeaController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('plan.record', {
                    url: '/plan-record',
                    templateUrl: 'app/components/plan/partial-plan-record.html',
                    controller: 'PlanRecordController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('setting', {
                    url: '/setting',
                    templateUrl: 'app/components/setting/partial-setting.html',
                    controller: 'SettingController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('setting.list', {
                    url: '/setting-list',
                    templateUrl: 'app/components/setting/partial-setting-list.html',
                    //controller: 'SettingController',
                    //controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true
                    }
                })
                .state('admin', {
                    url: '/admin',
                    templateUrl: 'app/components/admin/partial-admin.html',
                    controller: 'AdminController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true,
                        requiredRole: ['Admin']
                    }
                })
                .state('admin.share', {
                    url: '/share',
                    templateUrl: 'app/components/admin/partial-admin-share.html',
                    access: {
                        requireAuthenticated: true,
                        requiredRole: ['Admin']
                    }
                })
                .state('admin.functoid', {
                    url: '/functoid',
                    templateUrl: 'app/components/admin/partial-admin-functoid.html',
                    controller: 'AdminFunctoidController',
                    controllerAs: 'vm',
                    access: {
                        requireAuthenticated: true,
                        requiredRole: ['Admin']
                    }
                })
                //.state('test', {
                //    url: '/test',
                //    templateUrl: 'app/components/test/partial-test.html',
                //    controller: 'TestController',
                //    controllerAs: 'vm',
                //    access: {
                //        requireAuthenticated: true,
                //        requiredRole: ['Admin']
                //    }
                //})
                .state('noAccess', {
                    url: '/noAccess',
                    template: '<div>You donot have access to that function.</div>'
                })
                .state('register', {
                    url: '/register',
                    templateUrl: 'app/components/login/partial-register.html',
                    controller: 'RegisterController',
                    controllerAs: 'vm'
                })
                .state('emailconfirm', {
                    url: '/emailconfirm',
                    templateUrl: 'app/components/login/partial-emailconfirm.html',
                    controller: 'EmailConfirmController',
                    controllerAs: 'vm'
                });

            $httpProvider.interceptors.push('apiInterceptor');
            blockUIConfig.message = 'Please wait...';
            blockUIConfig.autoBlock = false;
        }]);

    app.run(['$state', '$timeout', '$rootScope', '$interval', 'dataService', 'userService', 'authService', 'tradeService',
        function ($state, $timeout, $rootScope, $interval, dataService, userService, authService, tradeService) {
            $rootScope.authState = dataService.getFromLocalRepository('authState');

            $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {

                if (toState.access != null) {
                    if (toState.access.requireAuthenticated && ($rootScope.authState == null || !$rootScope.authState.isAuthed)) {
                        $timeout(function () {
                            $state.go('login');
                        });
                    } else if (toState.access.requiredRole != null) {
                        var hasPermission = userService.hasPermission(toState.access.requiredRole);

                        if (!hasPermission) {
                            $timeout(function () {
                                authService.logout();
                                $state.go('noAccess');
                            });
                        }
                    }
                }
            });

            var currentZone = tradeService.getCurrentZone();
            var currentAccount = tradeService.getCurrentAccount();

            dataService.appStates = {
                'currentZone': currentZone,
                'currentAccount': currentAccount
            };
        }]);

    setChartOptions();
    function setChartOptions() {
        // Load the fonts
        Highcharts.createElement('link', {
            href: '//fonts.googleapis.com/css?family=Unica+One',
            rel: 'stylesheet',
            type: 'text/css'
        }, null, document.getElementsByTagName('head')[0]);

        Highcharts.theme = {
            colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
            chart: {
                backgroundColor: {
                    linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
                    stops: [
                        [0, '#2a2a2b'],
                        [1, '#3e3e40']
                    ]
                },
                plotBorderColor: '#606063',
                lineWidth: 1
            },

            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                }
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '13px'
                }
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3',
                        fontSize: '13px'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3',
                        fontSize: '13px'
                    }
                }
            },
            yAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3',
                        fontSize: '13px'
                    }
                },
                offset: 30,
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3',
                        fontSize: '13px'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                style: {
                    color: '#000000',
                    fontSize: '14px'
                },
                hideDelay: 0
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        color: '#B0B0B3'
                    },
                    marker: {
                        lineColor: '#333'
                    }
                },
                boxplot: {
                    fillColor: '#505053'
                },
                candlestick: {
                    lineColor: 'white'
                },
                errorbar: {
                    color: 'white'
                }
            },
            legend: {
                itemStyle: {
                    color: '#E0E0E3'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                }
            },
            credits: {
                style: {
                    color: '#666'
                },
                enabled: false
            },


            labels: {
                style: {
                    color: '#707073'
                }
            },

            drilldown: {
                activeAxisLabelStyle: {
                    color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                    color: '#F0F0F3'
                }
            },

            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    theme: {
                        fill: '#505053'
                    }
                }
            },
            // scroll charts
            rangeSelector: {
                buttonTheme: {
                    fill: '#505053',
                    stroke: '#000000',
                    style: {
                        color: '#CCC'
                    },
                    states: {
                        hover: {
                            fill: '#707073',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: '#000003',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                },
                inputBoxBorderColor: '#505053',
                inputStyle: {
                    backgroundColor: '#333',
                    color: 'silver'
                },
                labelStyle: {
                    color: 'silver'
                }
            },

            navigator: {
                handles: {
                    backgroundColor: '#666',
                    borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(255,255,255,0.1)',
                series: {
                    color: '#7798BF',
                    lineColor: '#A6C7ED'
                },
                xAxis: {
                    gridLineColor: '#505053'
                }
            },
            scrollbar: {
                barBackgroundColor: '#808083',
                barBorderColor: '#808083',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: '#606063',
                buttonBorderColor: '#606063',
                rifleColor: '#FFF',
                trackBackgroundColor: '#404043',
                trackBorderColor: '#404043'
            },
            // special colors for some of the
            legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
            background2: '#505053',
            dataLabelsColor: '#B0B0B3',
            textColor: '#C0C0C0',
            contrastTextColor: '#F0F0F3',
            maskColor: 'rgba(255,255,255,0.3)'
        };

        // Apply the theme
        Highcharts.setOptions(Highcharts.theme);
    }
})();