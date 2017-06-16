(function () {
    'use strict';

    var app = angular.module('screenApp');
    app.directive("compareTo", [function(){
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {
                ngModel.$validators.compareTo = function(modelValue) {
                    var match = modelValue ==scope.otherModelValue;
                    ngModel.$setValidity('compareTo', match);
                    return match;
                };
                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    }]);
})();
