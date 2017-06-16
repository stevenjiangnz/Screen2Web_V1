/**
 * Created by steven on 20/03/2016.
 */
(function () {
    'use strict';
    var app = angular.module('screenApp');

    app.factory('tickerService', tickerService);

    tickerService.$inject = ['$http', '$timeout', '$q', '$rootScope', 'dataService', 'appSettings'];
    function tickerService($http, $timeout, $q, $rootScope, dataService, appSettings) {
        var tickerServiceFactory = {};


        function _getLatestTicker(shareId)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/ticker/getlatest/' + shareId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getLatestTickerByZone(shareId, zoneId)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/ticker/getlatestbyzone?shareid=' + shareId + '&zoneid=' + zoneId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }


        function _getNextTickerByZone(shareId, zoneId)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/ticker/getnextbyzone?shareid=' + shareId + '&zoneid=' + zoneId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getTickerByDate(shareId, tradingDate)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/ticker/gettickerbydate?shareid=' + shareId + '&tradingdate=' + tradingDate
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getTickerList(shareId, start, end, indicatorString) {
            var startDate;
            var endDate = 0;
            var deferred = $q.defer();

            if (start) {
                startDate = start;
            }

            if (end) {
                endDate = end;
            }

            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/ticker?id=' + shareId + '&start=' + startDate + '&end=' + endDate + '&indicator=' + indicatorString
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }


        function _getVerificationList(shareId, tradingDate, count) {
            var deferred = $q.defer();

            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/ticker/getverificationlist?shareid=' + shareId + '&tradingdate=' + tradingDate + '&count=' + count
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _refreshHistoryTickers(shareId){
            var deferred = $q.defer();

            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/ticker/refreshhistory/' + shareId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        tickerServiceFactory.getTickerList = _getTickerList;
        tickerServiceFactory.refreshHistoryTickers = _refreshHistoryTickers;
        tickerServiceFactory.getLatestTicker = _getLatestTicker;
        tickerServiceFactory.getVerificationList =_getVerificationList;
        tickerServiceFactory.getTickerByDate =_getTickerByDate;
        tickerServiceFactory.getLatestTickerByZone = _getLatestTickerByZone;
        tickerServiceFactory.getNextTickerByZone = _getNextTickerByZone;

        return tickerServiceFactory;
    }
})();