/**
 * Created by steven on 24/02/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$state', '$rootScope', 'authService','toaster'];
    function LoginController($scope, $state, $rootScope, authService, toaster) {
        var vm = this;

        vm.message = null;
        vm.login = login;
        vm.cancel = cancel;
        vm.dataLoading = false;

        activate();

        function activate(){

        }

        function login() {
            var loginData = {
                username: vm.username,
                password:vm.password,
                grant_type:'password'
            };

            vm.dataLoading = true;
            authService.login(loginData).then(function(response){
                vm.dataloading = false;
                $state.go('home');
            },
                function(err) {
                    $scope.form.$setPristine();
                    vm.dataLoading = false;
                    vm.message = err.error_description;
                    vm.username = null;
                    vm.password = null;
            });
        }

        function cancel(){
            $scope.form.$setPristine();
            vm.dataLoading = false;
            vm.message = null;
            vm.username = null;
            vm.password = null;
        }
    }
})();