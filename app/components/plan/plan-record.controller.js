/**
 * Created by steven on 7/11/2016.
 */
(function () {
    "use strict";

    angular.module('screenApp')
        .controller('PlanRecordController', PlanRecordController);

    PlanRecordController.$inject = ['$scope', '$state', '$rootScope', 'toaster', '$timeout', 'appSettings',
        'utilService','dataService', 'shareService', 'tickerService', 'tradeService', 'planService', 'ngDialog',
        '$http', 'Upload'];

    function PlanRecordController($scope, $state, $rootScope, toaster, $timeout, appSettings,
                                utilService, dataService, shareService, tickerService, tradeService, planService,
                                  ngDialog, $http, Upload) {
        var vm = this;

        activate();

        function activate() {
            setItemSize();

            $scope.currentZone = tradeService.getCurrentZone();
            vm.isloading = true;
            $scope.detailMode = "new";

            loadRecordList();
        }

        $scope.createRecord = function () {
            $scope.detailMode = "new";
            $scope.localRecord = {};
        };

        function setItemSize()
        {
            var itemSizeKey = "PlanRecordItemSize";
            var itemSize = dataService.getFromLocalRepository(itemSizeKey);

            $scope.$watch('itemSize', function (newValue, oldValue) {
                if(newValue)
                {
                    dataService.saveToLocalRepository(itemSizeKey, $scope.itemSize);

                    loadRecordList();
                }
            });

            if(itemSize)
            {
                $scope.itemSize = itemSize;
            }
            else
            {
                $scope.itemSize = '100';
                dataService.saveToLocalRepository(itemSizeKey, $scope.itemSize);
            }
        }


        $scope.submitRecord = function (form) {
            if ($scope.currentZone) {
                $scope.localRecord.zoneId = $scope.currentZone.id;
            }
            else {
                $scope.localRecord.zoneId = null;
            }


            var formData = {formObj : $scope.localRecord};

            $scope.upload = Upload.upload({
                url: appSettings.baseServiceUrl + '/api/record/uploadrecord',
                method: "POST",
                data: { formData: formData},
                headers: {'enctype': 'multipart/form-data'}
            }).success(function (data, status, headers, config) {
                toaster.success({
                    title: "Record add success",
                    body: "Successfully added record "
                });
                loadRecordList();
                $scope.cancel();
            }).error(function (data, status, headers, config) {
                console.log(data);
            });
        };

        $scope.cancel = function (form) {
            if ($scope.detailMode == "new") {
                $scope.localRecord = {};

                if(form)
                {
                    form.$setPristine();
                }
            }
        };


        $scope.removeRecord = function (rec) {
            console.log("remove record ", rec);

            ngDialog.openConfirm({
                template: '<div style="height:100px"><p>Are you sure you want to delete record? <b>' + rec.id + '</b>?</p>' +
                '<div class="pull-right">' +
                '<button type="button" class="btn btn-primary" ng-click="confirm(1)" style="margin-right: 10px">Yes&nbsp;</button>' +
                '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                '</button></div></div>',
                plain: true,
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                planService.deleteRecord(rec.id).then(
                    function () {
                        toaster.success({
                            title: "Record removed success",
                            body: "Successfully removed record " + rec.id
                        });

                        loadRecordList();

                        $scope.cancel();
                    }
                );

            }, function (value) {
                //cancelled, do nothing
            });
        };

        function loadRecordList() {
            var zoneId = null;
            if ($scope.currentZone) {
                zoneId = $scope.currentZone.id;
            }
            utilService.startProgressBar();

            planService.getRecordList(zoneId, $scope.itemSize).then(function (data) {
                vm.isloading = false;
                $scope.recordList = data;

                utilService.completeProgressBar();
            });
        }

        $scope.downloadRecord = function(rec){
            var path = appSettings.baseServiceUrl + '/api/record/download?id=' + rec.id;
            $scope.downloadFile(path, rec.fileName);
        };

        // Based on an implementation here: web.student.tuwien.ac.at/~e0427417/jsdownload.html
        $scope.downloadFile = function(httpPath, downloadFileName) {
            // Use an arraybuffer
            $http.get(httpPath, { responseType: 'arraybuffer' })
                .success( function(data, status, headers) {

                    var octetStreamMime = 'application/octet-stream';
                    var success = false;

                    // Get the headers
                    headers = headers();

                    // Get the filename from the x-filename header or default to "download.bin"
                    //var filename = headers['x-filename'] || 'download.bin';
                    var filename = downloadFileName;

                    // Determine the content type from the header or default to "application/octet-stream"
                    var contentType = headers['content-type'] || octetStreamMime;

                    try
                    {
                        // Try using msSaveBlob if supported
                        console.log("Trying saveBlob method ...");
                        var blob = new Blob([data], { type: contentType });
                        if(navigator.msSaveBlob)
                            navigator.msSaveBlob(blob, filename);
                        else {
                            // Try using other saveBlob implementations, if available
                            var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                            if(saveBlob === undefined) throw "Not supported";
                            saveBlob(blob, filename);
                        }
                        console.log("saveBlob succeeded");
                        success = true;
                    } catch(ex)
                    {
                        console.log("saveBlob method failed with the following exception:");
                        console.log(ex);
                    }

                    if(!success)
                    {
                        // Get the blob url creator
                        var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                        if(urlCreator)
                        {
                            // Try to use a download link
                            var link = document.createElement('a');
                            if('download' in link)
                            {
                                // Try to simulate a click
                                try
                                {
                                    // Prepare a blob URL
                                    console.log("Trying download link method with simulated click ...");
                                    var blob = new Blob([data], { type: contentType });
                                    var url = urlCreator.createObjectURL(blob);
                                    link.setAttribute('href', url);

                                    // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                                    link.setAttribute("download", filename);

                                    // Simulate clicking the download link
                                    var event = document.createEvent('MouseEvents');
                                    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                    link.dispatchEvent(event);
                                    console.log("Download link method with simulated click succeeded");
                                    success = true;



                                } catch(ex) {
                                    console.log("Download link method with simulated click failed with the following exception:");
                                    console.log(ex);
                                }
                            }

                            if(!success)
                            {
                                // Fallback to window.location method
                                try
                                {
                                    // Prepare a blob URL
                                    // Use application/octet-stream when using window.location to force download
                                    console.log("Trying download link method with window.location ...");
                                    var blob = new Blob([data], { type: octetStreamMime });
                                    var url = urlCreator.createObjectURL(blob);
                                    window.location = url;
                                    console.log("Download link method with window.location succeeded");
                                    success = true;
                                } catch(ex) {
                                    console.log("Download link method with window.location failed with the following exception:");
                                    console.log(ex);
                                }
                            }

                        }
                    }

                    if(!success)
                    {
                        // Fallback to window.open method
                        console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                        window.open(httpPath, '_blank', '');
                    }
                })
                .error(function(data, status) {
                    console.log("Request failed with status: " + status);

                    // Optionally write the error out to scope
                    $scope.errorDetails = "Request failed with status: " + status;
                });
        };

    }
})();
