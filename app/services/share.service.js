/**
 * Created by steven on 11/03/2016.
 */
(function () {
    'use strict';
    var app = angular.module('screenApp');
    var SHARE_LIST_KEY = 'SHARE_LIST';

    app.factory('shareService', shareService);

    shareService.$inject = ['$http', '$timeout', '$q', '$rootScope', 'dataService', 'appSettings'];
    function shareService($http, $timeout, $q, $rootScope, dataService, appSettings) {
        var shareServiceFactory = {};

        function _getShareList(forceReload) {
            var deferred = $q.defer();
            var shareList;

            if(!forceReload)
            {
                shareList = dataService.getFromLocalRepository(SHARE_LIST_KEY);
            }

            if (shareList) {
                $timeout(function () {
                        deferred.resolve(shareList);
                    },
                    100);
            }
            else {
                var config = {
                    method: 'GET',
                    url: appSettings.baseServiceUrl + '/api/share'
                };

                $http(config).then(function (data) {
                    shareList = data.data;

                    dataService.saveToLocalRepository(SHARE_LIST_KEY, shareList);

                    deferred.resolve(shareList);
                }, function (error) {
                    console.log(error);
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        }

        function _getMarketList(forceReload) {
            var deferred = $q.defer();
            var marketList;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/market'
            };

            $http(config).then(function (data) {
                marketList = data.data;
                deferred.resolve(marketList);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getShareInfo(shareID) {
            var deferred = $q.defer();
            var shareInfo;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/shareinfo/getbyshareid/' + shareID
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    shareInfo = data.data;
                    deferred.resolve(shareInfo);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _createShare(share) {
            var deferred = $q.defer();
            var shareReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/share',
                data: share
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    shareReturned = data.data;

                    dataService.saveToLocalRepository(SHARE_LIST_KEY, null);
                    deferred.resolve(shareReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _createShareInfo(shareInfo) {
            var deferred = $q.defer();
            var shareInfoReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/shareinfo',
                data: shareInfo
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    shareInfoReturned = data.data;
                    deferred.resolve(shareInfoReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateShare(share) {
            var deferred = $q.defer();
            var shareReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/share',
                data: share
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    shareReturned = data.data;

                    dataService.saveToLocalRepository(SHARE_LIST_KEY, null);
                    deferred.resolve(shareReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateShareInfo(shareInfo) {
            var deferred = $q.defer();
            var shareInfoReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/shareinfo',
                data: shareInfo
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    shareInfoReturned = data.data;

                    deferred.resolve(shareInfoReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _searchShareDaily(tradingDate) {
            var deferred = $q.defer();
            var shareInfo;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/share/search/' + tradingDate
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    shareInfo = data.data;
                    deferred.resolve(shareInfo);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _searchShareByWatch(watchid, tradingDate, reverse) {
            var deferred = $q.defer();
            var shareInfo;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/share/searchbywatch?watchid=' + watchid + '&tradingdate=' + tradingDate + '&reverse=' + reverse
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    shareInfo = data.data;
                    deferred.resolve(shareInfo);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _searchShareByAlert(tradingDate, force, zoneId) {
            var deferred = $q.defer();
            var shareInfo;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/share/searchalert?tradingdate=' + tradingDate + '&force=' + force + '&zoneid=' + zoneId
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    shareInfo = data.data;
                    deferred.resolve(shareInfo);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _searchShareByDailyScan(tradingDate, dailyScanId, force) {
            var deferred = $q.defer();
            var shareInfo;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/share/searchbydailyscan?tradingdate=' + tradingDate + '&dailyscanid=' + dailyScanId  + '&force=' + force
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    shareInfo = data.data;
                    deferred.resolve(shareInfo);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getShareDailyLatest() {
            var deferred = $q.defer();
            var shareInfo;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/share/search/latest'
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    shareInfo = data.data;
                    deferred.resolve(shareInfo);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getShareListByZone(zoneId) {
            var deferred = $q.defer();
            var shareInfo;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/share/getstocklistbyzone?zoneid=' + zoneId
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    shareInfo = data.data;
                    deferred.resolve(shareInfo);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }


        shareServiceFactory.getShareList = _getShareList;
        shareServiceFactory.getMarketList = _getMarketList;
        shareServiceFactory.getShareInfo = _getShareInfo;
        shareServiceFactory.updateShare = _updateShare;
        shareServiceFactory.createShare = _createShare;
        shareServiceFactory.updateShareInfo = _updateShareInfo;
        shareServiceFactory.createShareInfo = _createShareInfo;
        shareServiceFactory.searchShareDaily  = _searchShareDaily;
        shareServiceFactory.searchShareByWatch  = _searchShareByWatch;
        shareServiceFactory.searchShareByAlert  = _searchShareByAlert;
        shareServiceFactory.searchShareByDailyScan  = _searchShareByDailyScan;
        shareServiceFactory.getShareDailyLatest = _getShareDailyLatest;
        shareServiceFactory.getShareListByZone = _getShareListByZone;

        return shareServiceFactory;
    }


})();