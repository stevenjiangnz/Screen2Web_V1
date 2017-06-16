(function () {
    "use strict";

    angular.module('screenApp')
        .controller('PlanController', PlanController);

    PlanController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService'];

    function PlanController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                            utilService, shareService, tickerService) {
        var vm = this;
    }
})();