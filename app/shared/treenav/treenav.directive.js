/**
 * Created by steven on 28/04/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('treeNav', function () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'app/shared/treenav/partial-treenav.html',
            controller: 'TreeNavController',
            scope: {
                shareList: '=',
                shareId: '=onSelect',
                control: '='
            },
            link: function (scope, element, attrs) {
                scope.filterString = '';
                scope.treeContainer = $(".nav-tree-container");

                scope.$watch('shareList', function (newValue, oldValue) {
                    if (newValue && newValue.length) {
                        scope.displayTree(scope.treeContainer, newValue);
                    }
                });

                scope.$watch('filterString', function (newValue, oldValue) {
                    if (!newValue && oldValue) {
                        scope.resetFilter();
                    }

                    if(newValue)
                    {
                        scope.goFilter();
                    }
                });

                scope.internalControl = scope.control || {};
                scope.internalControl.setPreviousNode = scope.setPreviousNode;
                scope.internalControl.setNextNode = scope.setNextNode;

            }
        };
    });
})();