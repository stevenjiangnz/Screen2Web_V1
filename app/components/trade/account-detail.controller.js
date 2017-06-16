(function () {
    "use strict";
    angular.module('screenApp')
        .controller('AccountDetailController', AccountDetailController);

    AccountDetailController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings', 'dataService',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'tradeService', 'ngDialog'];

    function AccountDetailController($scope, $state, $rootScope, toaster, $timeout, appSettings, dataService,
                               utilService, shareService, tickerService, analysisService, tradeService, ngDialog) {
        var vm = this;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();
            $scope.currentAccount = tradeService.getCurrentAccount();

            $scope.$on('onShowShareDetails', function (event, data) {
                displayShareDetails(data);
            });

            loadShareList();
        }

        function loadShareList(){

            shareService.getShareList(false).then(function (data) {
                vm.shareList = _.filter(data, function (share) {
                    return share.isActive;
                });

            });
        }

        function displayShareDetails(shareId) {
            var result = _.filter(vm.shareList, function (share) {
                return share.id == shareId;
            });

            if (result && result.length >= 1) {
                $scope.currentShare = result[0];
            }
        }

    }
})();