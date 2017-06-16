/**
 * Created by steven on 27/06/2016.
 */
(function () {
    "use strict";
    angular.module('screenApp')
        .controller('AlertListController', AlertListController);

    AlertListController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'ngDialog', 'tradeService'];

    function AlertListController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                            utilService, shareService, tickerService, analysisService, ngDialog,tradeService) {
        var vm = this;
        var zoneId = null;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();

            if($scope.currentZone)
            {
                zoneId = $scope.currentZone.id;
            }

            vm.isloading = true;
            $scope.detailMode = "new";
            loadShareList();
            loadAlertList();
        }



        $scope.updateAlert = function (alert) {

            $scope.currentShare = $scope.getShare(alert.shareId);
        };


        function loadShareList() {
            shareService.getShareList(false).then(function (data) {
                $scope.optionShareList = data;
            });
        }

        // event handler for alert updated in control
        $scope.alertUpdated = function(alert){
            var a = utilService.getObjFromList($scope.alertList, alert.id);

            utilService.copyObject(alert, a);
        };

        // event handler for alert created in control
        $scope.alertCreated = function(alert){
            $scope.alertList.push(alert);
        };

        // event handler for alert deleted in control
        $scope.alertDeleted = function(alert){
            var a = utilService.getObjFromList($scope.alertList, alert.id);
            $scope.alertList = _.without($scope.alertList, a);
        };

        $scope.getShare = function(id)
        {
            var s = _.where($scope.optionShareList, {id:id});

            if(s && s.length ===1)
            {
                return s[0];
            }
            else
            {
                return null;
            }
        };


        function loadAlertList() {
            analysisService.getAlertByZone(zoneId).then(function (data) {
                vm.isloading = false;
                $scope.alertList = data;
            });
        }
    }
})();