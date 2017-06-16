(function () {
    'use strict';

    angular
        .module('screenApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope', '$location', '$rootScope', 'userService'];
    function RegisterController($scope, $location, $rootScope, userService) {
        var vm = this;

        vm.register = register;
        vm.cancel = cancel;
        vm.messageSuccess;
        vm.message;
        vm.errors;

        function register() {
            vm.dataLoading = true;

            userService.register(vm.user).then(function(response){
                    vm.dataLoading = false;
                    vm.messageSuccess = "User " + vm.user.username + " has been successfully created, a confirmation email has been send to the provided email.";
                    vm.message = null;
                },
                function(err) {
                    vm.dataLoading = false;
                    vm.message = err.message;
                    vm.errors = err.modelState[""];

                    console.log(err);
                });

        }

        function cancel(){
            $scope.form.$setPristine();
            vm.dataLoading = false;
            vm.user = null;
            vm.message =null;
            vm.errors = null;
        }
    }

})();
