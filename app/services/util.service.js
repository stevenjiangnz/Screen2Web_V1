/**
 * Created by steven on 18/03/2016.
 */
(function(){
    'use strict';
    var app = angular.module('screenApp');

    app.factory('utilService', utilService);

    utilService.$inject = ['localStorageService','ngProgressFactory', 'appSettings'];
    function utilService(localStorageService, ngProgressFactory, appSettings) {

        var utilServiceFactory = {};
        var progressBar = null;

        function _copyObject(sourceObj, targetObj)
        {
            if(sourceObj)
            {
                for (var k in sourceObj) {
                    targetObj[k] = sourceObj[k];
                }
            }
        }

        function _intToTick(intDate)
        {
            var objDate = _intToDate((intDate));
            return objDate.getTime();
        }

        function _dateToInt(d)
        {
            var intDate=0;

            if(d)
            {
                intDate = d.getFullYear() * 10000 + (d.getMonth() +1) * 100 + d.getDate();
            }

            return intDate;
        }

        function _intToDate(i)
        {
            var returnDate = null;

            if(i>0)
            {
                var iString = i.toString();

                var yearStr = iString.substring(0,4);
                var monthStr = iString.substring(4,6);
                var dayStr = iString.substring(6,8);

                returnDate =  new Date(parseInt(yearStr), parseInt(monthStr) -1, parseInt(dayStr))
            }

            return returnDate;
        }

        function _getProgressBar()
        {
            if (!progressBar)
            {
                progressBar =  ngProgressFactory.createInstance();
            }

            return progressBar;
        }

        function _startProgressBar()
        {
            _getProgressBar().reset();
            _getProgressBar().start();
        }

        function _completeProgressBar()
        {

            _getProgressBar().complete();
        }

        function _getObjFromList(list, id)
        {
            var s = _.where(list, {id:id});

            if(s && s.length ===1)
            {
                return s[0];
            }
            else
            {
                return null;
            }
        }

        utilServiceFactory.copyObject = _copyObject;
        utilServiceFactory.intToTick = _intToTick;
        utilServiceFactory.dateToInt = _dateToInt;
        utilServiceFactory.intToDate = _intToDate;
        utilServiceFactory.getProgressBase = _getProgressBar;
        utilServiceFactory.startProgressBar = _startProgressBar;
        utilServiceFactory.completeProgressBar = _completeProgressBar;
        utilServiceFactory.getObjFromList = _getObjFromList;


        return utilServiceFactory;
    }
})();