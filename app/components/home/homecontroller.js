/**
 * Created by steven on 24/02/2016.
 */
(function () {
    'use strict';
    angular.module('screenApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$state', '$rootScope', 'authService', '$timeout',
        'toaster','ngProgressFactory'];
    function HomeController($scope, $state, $rootScope, authService, $timeout,
                            toaster, ngProgressFactory) {
        var vm = this;
        //
        //console.log('home here ');
        //
        //blockUI.start();
        //
        //$timeout(function() {
        //    blockUI.stop();
        //}, 2000);

        //toaster.success({title: "title", body:"text1"});
        //vm.ngProgress = ngProgressFactory.createInstance()
        //vm.ngProgress.start();
        //$timeout(function() {
        //    vm.ngProgress.complete();
        //}, 500);
    }

})();