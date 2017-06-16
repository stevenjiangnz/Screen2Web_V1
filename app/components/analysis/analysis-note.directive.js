/**
 * Created by steven on 28/05/2016.
 */
(function () {
    'use strict';

    var app = angular.module('screenApp');

    app.directive('analysisNote', function () {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                noteInput: '='
            },
            templateUrl: 'app/components/analysis/partial-analysis-note.html',
            controller: 'AnalysisNoteController',
            link: function (scope, element, attrs) {
                scope.$watch('noteInput', function (newValue, oldValue) {
                    if (newValue) {
                        scope.input = newValue;
                        scope.displayNotesForShare(newValue);
                    }
                });
            }
        };
    });
})();
