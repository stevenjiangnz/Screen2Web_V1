/**
 * Created by steven on 22/10/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('TradeReviewController', TradeReviewController);

    TradeReviewController.$inject = ['$scope', '$q', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService', 'shareService', 'tickerService', 'indicatorService','tradeService'];

    function TradeReviewController($scope, $q, $state, $rootScope, toaster, $timeout, appSettings,
                                       utilService, shareService, tickerService, indicatorService,tradeService) {
        var vm = this;
        var zoneId = null;
        var accountId = null;

        activate();

        function activate() {
            $scope.tinymceOptions = appSettings.editorSettings;
        }

        $scope.displayPositionReview = function(positionId)
        {
            utilService.startProgressBar();
            tradeService.getPositionReview(positionId).then(function (data) {
                vm.isloading = false;
                $scope.currentReview = data;
                $scope.localReview = {};
                utilService.copyObject($scope.currentReview,$scope.localReview);

                prepareObjectFromService();

                utilService.completeProgressBar();

                $scope.reviewFormExpanded = true;
            });
        };

        $scope.cancel = function (form) {
            $scope.localReview = $scope.currentReview;
            prepareObjectFromService();
        };

        $scope.submitReview = function()
        {
            utilService.startProgressBar();
            prepareObjectForService();

            tradeService.updateReview($scope.localReview).then(function(data){
                $scope.displayPositionReview(data.tradePositionId);

                toaster.success({
                    title: "Update review success",
                    body: "Successfully update review for Position (" + data.tradePositionId + ")"
                });

                utilService.completeProgressBar();
            });
        };

        function prepareObjectForService(){
            $scope.localReview.isDirectionCorrect = toBoolean($scope.localReview.isDirectionCorrectTemp);
            $scope.localReview.isReverse = toBoolean($scope.localReview.isReverseTemp);
            $scope.localReview.isAddSize = toBoolean($scope.localReview.isAddSizeTemp);
            $scope.localReview.isStopTriggered = toBoolean($scope.localReview.isStopTriggeredTemp);
            $scope.localReview.isLimitTriggered = toBoolean($scope.localReview.isLimitTriggeredTemp);
            $scope.localReview.isExitBBTriggered = toBoolean($scope.localReview.isExitBBTriggeredTemp);
        }

        function prepareObjectFromService(){
            $scope.localReview.isDirectionCorrectTemp = fromBoolean($scope.localReview.isDirectionCorrect);
            $scope.localReview.isReverseTemp = fromBoolean($scope.localReview.isReverse);
            $scope.localReview.isAddSizeTemp = fromBoolean($scope.localReview.isAddSize);
            $scope.localReview.isStopTriggeredTemp = fromBoolean($scope.localReview.isStopTriggered);
            $scope.localReview.isLimitTriggeredTemp = fromBoolean($scope.localReview.isLimitTriggered);
            $scope.localReview.isExitBBTriggeredTemp = fromBoolean($scope.localReview.isExitBBTriggered);
        }

        function toBoolean(input)
        {
            if(input === 'unknown')
                return null;

            if(input === 'yes')
                return true;

            if(input === 'no')
                return false;
        }

        function fromBoolean(input)
        {
            if(input === null)
                return 'unknown';

            if(input === true)
                return 'yes';

            if(input === false)
                return 'no';
        }
    }
})();