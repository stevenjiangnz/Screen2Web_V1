/**
 * Created by steven on 27/02/2016.
 */
(function () {
    'use strict';

    angular.module('screenApp')
        .controller('EmailConfirmController', EmailConfirmController);

    EmailConfirmController.$inject = ['$location','authService'];
    function EmailConfirmController($location, authService) {
        var vm = this;

        var querystrings = $location.search();


        authService.emailConfirm(querystrings["userId"], querystrings["code"])
            .then(function(){
                vm.messageSuccess = "You account has been successfully activated, click Login to start use the application.";
            },function(){
                vm.messageFail = "Error occurs during activating account.";
            });

        authService.logout();
    }

})();