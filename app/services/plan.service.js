/**
 * Created by steven on 17/08/2016.
 */
(function () {
    'use strict';
    var app = angular.module('screenApp');

    app.factory('planService', planService);

    planService.$inject = ['$http', '$timeout', '$q', '$rootScope', 'dataService', 'appSettings', 'utilService'];
    function planService($http, $timeout, $q, $rootScope, dataService, appSettings, utilService) {
        var planServiceFactory = {};

        function _getJourney(id) {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/journey?id=' + id
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getJourneyList(zoneId) {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/journey/getbyzone?zoneid=' + zoneId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _addJourney(journey) {
            var deferred = $q.defer();
            var journeyReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/journey',
                data: journey
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    journeyReturned = data.data;
                    deferred.resolve(journeyReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateJourney(journey) {
            var deferred = $q.defer();
            var journeyReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/journey',
                data: journey
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    journeyReturned = data.data;
                    deferred.resolve(journeyReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteJourney(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/journey?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }


        function _getPlan(id) {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/plan?id=' + id
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getPlanList(zoneId) {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/plan/getbyzone?zoneid=' + zoneId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _addPlan(plan) {
            var deferred = $q.defer();
            var planReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/plan',
                data: plan
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    planReturned = data.data;
                    deferred.resolve(planReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updatePlan(plan) {
            var deferred = $q.defer();
            var planReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/plan',
                data: plan
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    planReturned = data.data;
                    deferred.resolve(planReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deletePlan(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/plan?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getIdeaList() {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/idea/getlist'
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getIdea(id) {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/idea?id=' + id
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _addIdea(idea) {
            var deferred = $q.defer();
            var ideaReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/idea',
                data: idea
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    ideaReturned = data.data;
                    deferred.resolve(ideaReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateIdea(idea) {
            var deferred = $q.defer();
            var ideaReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/idea',
                data: idea
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    ideaReturned = data.data;
                    deferred.resolve(ideaReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteIdea(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/idea?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getRecordList(zoneId, size) {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/record/getbyzone?zoneid=' + zoneId + '&size=' + size
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _addRecord(record) {
            var deferred = $q.defer();
            var recordReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/record',
                data: record
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    recordReturned = data.data;
                    deferred.resolve(recordReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteRecord(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/record?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        planServiceFactory.getJourneyList = _getJourneyList;
        planServiceFactory.getJourney = _getJourney;
        planServiceFactory.addJourney = _addJourney;
        planServiceFactory.updateJourney = _updateJourney;
        planServiceFactory.deleteJourney = _deleteJourney;

        planServiceFactory.getPlanList = _getPlanList;
        planServiceFactory.getPlan = _getPlan;
        planServiceFactory.addPlan = _addPlan;
        planServiceFactory.updatePlan = _updatePlan;
        planServiceFactory.deletePlan = _deletePlan;

        planServiceFactory.getIdeaList = _getIdeaList;
        planServiceFactory.getIdea = _getIdea;
        planServiceFactory.addIdea = _addIdea;
        planServiceFactory.deleteIdea = _deleteIdea;
        planServiceFactory.updateIdea = _updateIdea;

        planServiceFactory.getRecordList = _getRecordList;
        planServiceFactory.addRecord = _addRecord;
        planServiceFactory.deleteRecord = _deleteRecord;

        return planServiceFactory;
    }
})();