/**
 * Created by steven on 9/04/2016.
 */
(function () {
    'use strict';
    var app = angular.module('screenApp');

    app.factory('indicatorService', indicatorService);

    indicatorService.$inject = ['$http', '$timeout', '$q', '$rootScope', 'dataService', 'appSettings'];
    function indicatorService($http, $timeout, $q, $rootScope, dataService, appSettings) {
        var indicatorServiceFactory = {};

        function _getSMAList(shareId, period, start, end) {
            var deferred = $q.defer();

            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/indicator/sma?id=' + shareId + '&period=' + period + "&start=" + start + "&end=" + end
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getIndicatorColor(indicator)
        {
            var color = '#ffffff';
            var indicatorSettings = appSettings.indicatorSettings;

            for (var k in indicatorSettings) {
                if(indicatorSettings[k].parameter.indexOf(indicator)>=0)
                {
                    color = indicatorSettings[k].color;
                    break;
                }
            }

            return color;
        }

        function _getIndicatorColorByName(name)
        {
            var color = '#ffffff';
            var indicatorSettings = appSettings.indicatorSettings;

            for (var k in indicatorSettings) {
                if(k==name)
                {
                    color = indicatorSettings[k].color;
                    break;
                }
            }

            return color;
        }

        function _getIndicatorSettingByParameter(param)
        {
            var setting = null;

            var indicatorSettings = appSettings.indicatorSettings;

            for (var k in indicatorSettings) {
                if(indicatorSettings[k].parameter &&
                        param.indexOf(indicatorSettings[k].parameter) >=0)
                {
                    setting = indicatorSettings[k];
                    break;
                }
            }

            return setting;
        }

        function _getIndicatorByDate(shareId, tradingDate)
        {
            var deferred = $q.defer();

            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/indicator/indicator/' + shareId + '/' + tradingDate
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getLatestTradingDate()
        {
            var deferred = $q.defer();

            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/indicator/latesttradingdate'
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getLatestTradingDateByShare(shareId)
        {
            var deferred = $q.defer();

            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/indicator/latesttradingdatebyshare?shareid=' + shareId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        indicatorServiceFactory.getSMAList = _getSMAList;
        indicatorServiceFactory.getIndicatorColor = _getIndicatorColor;
        indicatorServiceFactory.getIndicatorColorByName = _getIndicatorColorByName;
        indicatorServiceFactory.getIndicatorSettingByParameter = _getIndicatorSettingByParameter;
        indicatorServiceFactory.getIndicatorByDate = _getIndicatorByDate;
        indicatorServiceFactory.getLatestTradingDate = _getLatestTradingDate;
        indicatorServiceFactory.getLatestTradingDateByShare = _getLatestTradingDateByShare;

        return indicatorServiceFactory;
    }
})();