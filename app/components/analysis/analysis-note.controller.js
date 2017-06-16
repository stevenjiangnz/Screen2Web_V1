/**
 * Created by steven on 28/05/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('AnalysisNoteController', AnalysisNoteController);

    AnalysisNoteController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout',
        'utilService', 'shareService', 'tickerService', 'analysisService','tradeService'];

    function AnalysisNoteController($scope, $state, $rootScope, toaster, $timeout,
                                    utilService, shareService, tickerService, analysisService,tradeService) {

        var zoneId = null;

        activate();

        function activate() {
            $scope.currentZone = tradeService.getCurrentZone();
            if($scope.currentZone)
                zoneId = $scope.currentZone.id;

            $scope.comment = null;
        }


        $scope.displayNotesForShare = function (input) {
           $scope.noteList = [];

           analysisService.getNotesByShareZone(input.shareId, zoneId).then(
                function(data)
                {
                    $scope.noteList = data;
                }
            );
        };

        $scope.addNote = function (form) {
            var noteObj = {
                'zoneId': zoneId,
                'comment': $scope.comment,
                'shareId': $scope.input.shareId,
                'tradingDate': $scope.input.tradingDate,
                'type': 'ShareNote'
            };

            analysisService.addNote(noteObj).then(
                function(data)
                {
                    toaster.success({
                        title: "Add note success",
                        body: "Successfully add note for the current share."
                    });

                    $scope.comment = null;
                    form.$setPristine();

                    $scope.noteList.splice(0, 0, data);
                },
                function(err)
                {
                    toaster.error({
                        title: "Add note fail",
                        body: "Fail to add note for the current share."
                    });
                }
            );

        };

        $scope.cancelNote = function (form) {
            $scope.comment = null;
            form.$setPristine();
        };

        $scope.deleteNote = function (note){

            analysisService.deleteNote(note.id).then(
                function(data)
                {
                    toaster.success({
                        title: "Delete note success",
                        body: "Successfully delete note for the current share."
                    });

                    $scope.noteList = _.without($scope.noteList, _.findWhere($scope.noteList, {id: note.id}));
                },
                function(err)
                {
                    toaster.error({
                        title: "Delete note fail",
                        body: "Fail to delete note for the current share."
                    });
                }
            );
        }
    }
})();