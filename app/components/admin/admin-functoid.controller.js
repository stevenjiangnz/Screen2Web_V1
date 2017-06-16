/**
 * Created by steven on 1/05/2016.
 */
(function () {
    "use strict";
    angular.module('screenApp')
        .controller('AdminFunctoidController', AdminFunctoidController);

    AdminFunctoidController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'analysisService', 'ngDialog'];


    function AdminFunctoidController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                                     utilService, shareService, tickerService, analysisService, ngDialog) {
        var vm = this;
        activate();

        function activate() {
            $scope.detailMode = "new";
            getFunctoidList();
        }

        function getFunctoidList(){
            analysisService.getFunctoidList().then(function(data){
                $scope.functoidList = data;
            });
        }

        $scope.cancel = function(form)
        {
            if($scope.detailMode == "new")
            {
                $scope.localFunc = null;
                form.$setPristine();
            }
            else{
                $scope.localFunc = $scope.currentFunctoid;
            }

        };

        $scope.createFunctoid = function(){
            $scope.detailMode = "new";
            $scope.localFunc = null;
        };

        $scope.removeFunctoid = function(func){
            analysisService.deleteFunctoid(func.id).then(
                function(){
                    $scope.functoidList.pop(func);

                    toaster.success({
                        title: "Functoid removed success",
                        body: "Successfully removed functoid " + func.name
                    });

                    $scope.createFunctoid();
                }
            );
        };

        $scope.updateFunctoid = function(func){
            $scope.detailMode = "update";
            $scope.currentFunctoid = func;
            $scope.localFunc = angular.copy(func);
        };

        $scope.submitNewFunctoid = function(form)
        {
            if($scope.detailMode == 'new')
            {
                analysisService.addFunctoid($scope.localFunc).then(
                    function(newFunc){
                        $scope.functoidList.push(newFunc);

                        toaster.success({
                            title: "New functoid created success",
                            body: "Successfully created new functoid " + newFunc.name
                        });

                        $scope.cancel(form);
                    }
                );
            }
            else
            {
                analysisService.updateFunctoid($scope.localFunc).then(
                    function(data){
                        utilService.copyObject(data, $scope.currentFunctoid);

                        toaster.success({
                            title: "Functoid update success",
                            body: "Successfully updated functoid " + data.name
                        });

                    }
                );
            }

        };
    }
})();