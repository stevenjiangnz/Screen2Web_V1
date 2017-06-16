/**
 * Created by steven on 12/03/2016.
 */

(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('shareDetail', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                share: '=',
                shareInfo: '=',
                marketList: '=',
                mode: '=',
                shareUpdated: '&',
                shareCreated: '&'
            },
            link: function ($scope, element, attrs) {
                $scope.$watch('share', function (newValue, oldValue) {
                    if (newValue) {
                        $scope.localShare = angular.copy($scope.share);
                    }
                });
                $scope.$watch('shareInfo', function (newValue, oldValue) {
                    if (newValue) {
                        $scope.localShareInfo = angular.copy($scope.shareInfo);
                    }
                    else {
                        if ($scope.mode == 'edit') {
                            $scope.createShareInfo();
                        }
                    }
                });

                $scope.$watch('mode', function (newValue, oldValue) {
                    if (newValue && newValue == 'create') {
                        $scope.createShare();
                    }

                    if (newValue && newValue == 'edit' &&
                        !($scope.shareInfo && $scope.shareInfo.id > 0)) {
                        $scope.createShareInfo();
                    }
                });
            },
            templateUrl: 'app/shared/share/partial-sharedetail.html',
            controller: 'shareDetailController'
        };
    });
})();
