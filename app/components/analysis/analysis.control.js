/**
 * Created by steven on 16/04/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('AnalysisController', AnalysisController);

    AnalysisController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService'];

    function AnalysisController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                                utilService, shareService, tickerService) {
        var vm = this;

        activate();

        function activate() {
            initData();
        }

        function initData() {
        }

    }
})();

