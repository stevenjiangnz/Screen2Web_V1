/**
 * Created by steven on 17/03/2016.
 */
(function(){
    'use strict';
    var app = angular.module('screenApp');

    app.factory('dataService', dataService);

    dataService.$inject = ['localStorageService', 'appSettings'];
    function dataService(localStorageService, appSettings) {

        var dataServiceFactory = {};

        var _appStates = {};

        function _clearLocalRepository(){
            for ( var i = 0, len = localStorage.length; i < len; ++i ) {
                if(localStorage.key(i) && localStorage.key(i).indexOf(appSettings.localRepositoryKeyPrefix) > 0)
                {
                    if(localStorage.key(i) && localStorage.key(i).indexOf('current') < 0)
                    {
                        localStorageService.remove(localStorage.key(i).substring(3));
                    }
                }
            }
        }

        function _getLocalRepositoryKeys(){
            return {
                "ShareList": "ShareList"
            }
        }

        function _saveToLocalRepository(key, obj)
        {
            localStorageService.set(appSettings.localRepositoryKeyPrefix + key, obj);
        }

        function _getFromLocalRepository(key)
        {
            return localStorageService.get(appSettings.localRepositoryKeyPrefix + key);
        }

        dataServiceFactory.clearLocalRepository = _clearLocalRepository;
        dataServiceFactory.getLocalRepositoryKeys = _getLocalRepositoryKeys;
        dataServiceFactory.saveToLocalRepository = _saveToLocalRepository;
        dataServiceFactory.getFromLocalRepository = _getFromLocalRepository;
        dataServiceFactory.appStates = _appStates;

        return dataServiceFactory;
    }
})();