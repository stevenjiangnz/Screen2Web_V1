/**
 * Created by steven on 25/02/2016.
 */
(function () {
    'use strict';
    var app = angular.module('screenApp');

    app.directive("access", ['userService', function (userService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var makeVisible = function () {
                    element.removeClass('hidden');
                };
                var makeHidden = function () {
                    element.addClass('hidden');
                };


                scope.$watch('$root.authState.isAuthed', function () {

                    var roles = attrs.access.split(',');

                    var hasPermission = userService.hasPermission(roles);

                    if (!hasPermission) {
                        makeHidden();
                    }
                    else {
                        makeVisible();
                    }
                });


            }
        }
    }]);
})();