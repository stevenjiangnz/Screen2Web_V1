(function () {
    "use strict";

    angular.module('screenApp')
        .controller('AccountProfileController', AccountProfileController);

    AccountProfileController.$inject = ['$scope', '$q', '$state', '$rootScope', 'toaster', '$timeout',
        'utilService', 'shareService', 'tickerService', 'indicatorService', 'tradeService'];

    function AccountProfileController($scope, $q, $state, $rootScope, toaster, $timeout,
                                      utilService, shareService, tickerService, indicatorService,tradeService) {

        var vm = this;
        var zoneId = null;
        var accountId = null;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();
            if ($scope.currentZone) {
                zoneId = $scope.currentZone.id;
            }

            $scope.currentAccount = tradeService.getCurrentAccount();
            if ($scope.currentAccount) {
                accountId = $scope.currentAccount.id;
            }

            loadAccountSummary();
        }

        function loadAccountSummary() {
            utilService.startProgressBar();
            tradeService.getAccountSummary(accountId).then(function (data) {
                vm.isloading = false;

                $scope.accountSummary = data;
                utilService.completeProgressBar();
            });
        }

    }
})();