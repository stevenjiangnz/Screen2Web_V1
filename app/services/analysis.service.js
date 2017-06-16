/**
 * Created by steven on 2/05/2016.
 */
(function () {
    'use strict';
    var app = angular.module('screenApp');

    app.factory('analysisService', analysisService);

    analysisService.$inject = ['$http', '$timeout', '$q', '$rootScope', 'dataService', 'appSettings'];
    function analysisService($http, $timeout, $q, $rootScope, dataService, appSettings) {
        var analysisServiceFactory = {};

        // Get watch list all
        var _getWatchList = function(){
            var deferred = $q.defer();
            var watchList;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/watch'
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    watchList = data.data;
                    deferred.resolve(watchList);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        // Get watch list by zone
        var _getWatchListByZone = function(zoneId){
            var deferred = $q.defer();
            var watchList;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/watch/getbyzone?zoneid=' + zoneId
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    watchList = data.data;
                    deferred.resolve(watchList);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        function _createWatch(watch) {
            var deferred = $q.defer();
            var watchReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/watch',
                data: watch
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    watchReturned = data.data;
                    deferred.resolve(watchReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateWatch(watch) {
            var deferred = $q.defer();
            var watchReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/watch',
                data: watch
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    watchReturned = data.data;
                    deferred.resolve(watchReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteWatch(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/watch?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }


        var _getWatchListDetail = function(watchId){
            var deferred = $q.defer();
            var watchListDetail;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/watch/watchdetail/' + watchId
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    watchListDetail = data.data;
                    deferred.resolve(watchListDetail);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        var _getWatchListById = function(watchId)
        {
            var deferred = $q.defer();
            var watchListDetail;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/watch/' + watchId
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    watchListDetail = data.data;
                    deferred.resolve(watchListDetail);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        function _addWatchListShare(watchId, shareList) {
            var deferred = $q.defer();
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/watch/addshare?watchid=' + watchId + '&sharelist=' +shareList,
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve();
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _addWatchListShareBatch(watchId, shareArray) {
            var deferred = $q.defer();
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/watch/addsharebatch?watchid=' + watchId,
                data: shareArray
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data.data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _removeWatchListShareBatch(watchId, shareArray) {
            var deferred = $q.defer();
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/watch/removesharebatch?watchid=' + watchId,
                data: shareArray
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data.data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _removeWatchListShare(watchId, shareList) {
            var deferred = $q.defer();
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/watch/removeshare?watchid=' + watchId + '&sharelist=' +shareList,
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve();
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        var _getWatchListByShare = function(shareId){
            var deferred = $q.defer();
            var watchListDetail;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/watch/getbyshare/' + shareId
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    watchListDetail = data.data;
                    deferred.resolve(watchListDetail);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

/*
        function _getNotesByShareDate(shareId, tradingDate)
        {
            if (!shareId)
                shareId = 0;

            if(!tradingDate)
                tradingDate = 0;

            var deferred = $q.defer();
            var watchListDetail;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/note?shareid=' + shareId + '&tradingdate=' + tradingDate
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    watchListDetail = data.data;
                    deferred.resolve(watchListDetail);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }
*/

        function _getNotesByShareZone(shareId, zoneId)
        {
            if (!shareId)
                shareId = 0;

            if(!zoneId)
                zoneId = 0;

            var deferred = $q.defer();
            var watchListDetail;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/note/getbysharezone?shareid=' + shareId + '&zoneid=' + zoneId
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    watchListDetail = data.data;
                    deferred.resolve(watchListDetail);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _addNote(noteObj)
        {
            var deferred = $q.defer();
            var noteReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/note',
                data: noteObj
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    noteReturned = data.data;
                    deferred.resolve(noteReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteNote(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/note?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        var _getFunctoidList = function(){
            var deferred = $q.defer();
            var fList;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/functoid'
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    fList = data.data;
                    deferred.resolve(fList);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        function _addFunctoid(funcObj)
        {
            var deferred = $q.defer();
            var funcReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/functoid',
                data: funcObj
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    funcReturned = data.data;
                    deferred.resolve(funcReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateFunctoid(funcObj) {
            var deferred = $q.defer();
            var funcReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/functoid',
                data: funcObj
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    funcReturned = data.data;
                    deferred.resolve(funcReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteFunctoid(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/functoid?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        var _getRuleList = function(){
            var deferred = $q.defer();
            var fList;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/rule'
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    fList = data.data;
                    deferred.resolve(fList);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        function _addRule(rule)
        {
            var deferred = $q.defer();
            var ruleReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/rule',
                data: rule
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    ruleReturned = data.data;
                    deferred.resolve(ruleReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateRule(rule) {
            var deferred = $q.defer();
            var ruleReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/rule',
                data: rule
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    ruleReturned = data.data;
                    deferred.resolve(ruleReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteRule(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/rule?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        var _getScanList = function(){
            var deferred = $q.defer();
            var fList;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/scan'
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    fList = data.data;
                    deferred.resolve(fList);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };


        var _getRuleByScan = function(scanId){
            var deferred = $q.defer();
            var fList;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/scan/' + scanId + '/rule'
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    fList = data.data;
                    deferred.resolve(fList);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        function _addScan(scan)
        {
            var deferred = $q.defer();
            var scanReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/scan',
                data: scan
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    scanReturned = data.data;
                    deferred.resolve(scanReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateScan(scan) {
            var deferred = $q.defer();
            var scanReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/scan',
                data: scan
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    scanReturned = data.data;
                    deferred.resolve(scanReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteScan(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/scan?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        var _runScan = function(scanId){
            var deferred = $q.defer();
            var fList;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/scan/run?id=' + scanId
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    fList = data.data;
                    deferred.resolve(fList);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        var _getAlertByShareZone = function(shareId, zoneId){
            var deferred = $q.defer();
            var fList;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/alert/getbysharezone?shareid=' + shareId + '&zoneId=' + zoneId
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    fList = data.data;
                    deferred.resolve(fList);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        var _getAlertByZone = function(zoneId){
            var deferred = $q.defer();
            var fList;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/alert/getbyzone?zoneId=' + zoneId
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    fList = data.data;
                    deferred.resolve(fList);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        function _addAlert(alert)
        {
            var deferred = $q.defer();
            var alertReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/alert',
                data: alert
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    alertReturned = data.data;
                    deferred.resolve(alertReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteAlert(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/alert?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateAlert(alert) {
            var deferred = $q.defer();
            var alertReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/alert',
                data: alert
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    alertReturned = data.data;
                    deferred.resolve(alertReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _verifyAlert(alert) {
            var deferred = $q.defer();
            var result;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/alert/verify',
                data: alert
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    result = data.data;
                    deferred.resolve(result);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        // Get daily scan list by zone
        var _getDailyScanListByZone = function(zoneId){
            var deferred = $q.defer();
            var dailScanList;
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/dailyscan/getbyzone?zoneid=' + zoneId
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    dailScanList = data.data;
                    deferred.resolve(dailScanList);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        function _addDailyScan(scan)
        {
            var deferred = $q.defer();
            var scanReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/dailyscan',
                data: scan
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    scanReturned = data.data;
                    deferred.resolve(scanReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteDailyScan(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/dailyscan?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateDailyScan(dailyScan) {
            var deferred = $q.defer();
            var dailyScanReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/dailyscan',
                data: dailyScan
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    dailyScanReturned = data.data;
                    deferred.resolve(dailyScanReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        analysisServiceFactory.getWatchList = _getWatchList;
        analysisServiceFactory.getWatchListByZone = _getWatchListByZone;
        analysisServiceFactory.createWatch = _createWatch;
        analysisServiceFactory.updateWatch = _updateWatch;
        analysisServiceFactory.deleteWatch = _deleteWatch;
        analysisServiceFactory.getWatchListDetail = _getWatchListDetail;
        analysisServiceFactory.addWatchListShare = _addWatchListShare;
        analysisServiceFactory.addWatchListShareBatch = _addWatchListShareBatch;
        analysisServiceFactory.removeWatchListShare = _removeWatchListShare;
        analysisServiceFactory.removeWatchListShareBatch = _removeWatchListShareBatch;
        analysisServiceFactory.getWatchListByShare = _getWatchListByShare;
        analysisServiceFactory.getWatchListById = _getWatchListById;

        analysisServiceFactory.getNotesByShareZone = _getNotesByShareZone;
        analysisServiceFactory.addNote = _addNote;
        analysisServiceFactory.deleteNote = _deleteNote;

        analysisServiceFactory.getFunctoidList = _getFunctoidList;
        analysisServiceFactory.addFunctoid = _addFunctoid;
        analysisServiceFactory.updateFunctoid = _updateFunctoid;
        analysisServiceFactory.deleteFunctoid = _deleteFunctoid;

        analysisServiceFactory.getRuleList = _getRuleList;
        analysisServiceFactory.addRule = _addRule;
        analysisServiceFactory.updateRule = _updateRule;
        analysisServiceFactory.deleteRule = _deleteRule;
        analysisServiceFactory.getRuleByScan = _getRuleByScan;

        analysisServiceFactory.getScanList = _getScanList;
        analysisServiceFactory.addScan = _addScan;
        analysisServiceFactory.updateScan = _updateScan;
        analysisServiceFactory.deleteScan = _deleteScan;
        analysisServiceFactory.runScan = _runScan;

        analysisServiceFactory.getAlertByShareZone = _getAlertByShareZone;
        analysisServiceFactory.getAlertByZone = _getAlertByZone;
        analysisServiceFactory.addAlert = _addAlert;
        analysisServiceFactory.deleteAlert = _deleteAlert;
        analysisServiceFactory.updateAlert = _updateAlert;
        analysisServiceFactory.verifyAlert = _verifyAlert;

        analysisServiceFactory.getDailyScanListByZone = _getDailyScanListByZone;
        analysisServiceFactory.addDailyScan = _addDailyScan;
        analysisServiceFactory.deleteDailyScan = _deleteDailyScan;
        analysisServiceFactory.updateDailyScan = _updateDailyScan;

        return analysisServiceFactory;
    }
})();