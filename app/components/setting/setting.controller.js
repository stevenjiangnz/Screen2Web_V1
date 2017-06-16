/**
 * Created by steven on 12/08/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('SettingController', SettingController);

    SettingController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService'];

    function SettingController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                            utilService, shareService, tickerService) {
        var vm = this;
    }
})();