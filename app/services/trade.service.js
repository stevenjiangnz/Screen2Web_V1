(function () {
    'use strict';
    var app = angular.module('screenApp');

    app.factory('tradeService', tradeService);

    tradeService.$inject = ['$http', '$timeout', '$q', '$rootScope', 'dataService', 'appSettings', 'utilService'];
    function tradeService($http, $timeout, $q, $rootScope, dataService, appSettings, utilService) {
        var tradeServiceFactory = {};

        function _getZoneList()
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/zone'
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getNextDayZone(zoneId)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/zone/nextdayzone?zoneid=' + zoneId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _addZone(zone)
        {
            var deferred = $q.defer();
            var scanReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/zone',
                data: zone
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    scanReturned = data.data;
                    deferred.resolve(scanReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteZone(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/zone?id=' + id
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

        function _updateZone(zone) {
            var deferred = $q.defer();
            var zoneReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/zone',
                data: zone
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    zoneReturned = data.data;
                    deferred.resolve(zoneReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getCurrentZone(){
            return dataService.getFromLocalRepository(appSettings.zoneKey);
        }

        function _getCurrentAccount(){
            return dataService.getFromLocalRepository(appSettings.accountKey);
        }

        function _getBrokerList()
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/broker'
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _addBroker(broker)
        {
            var deferred = $q.defer();
            var brokerReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/broker',
                data: broker
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    brokerReturned = data.data;
                    deferred.resolve(brokerReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateBroker(broker) {
            var deferred = $q.defer();
            var brokerReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/broker',
                data: broker
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    brokerReturned = data.data;
                    deferred.resolve(brokerReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteBroker(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/broker?id=' + id
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


        function _getAccountList(zoneId)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeaccount/getbyzone?zoneId=' + zoneId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _addAccount(account)
        {
            var deferred = $q.defer();
            var accountReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/tradeaccount',
                data: account
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    accountReturned = data.data;
                    deferred.resolve(accountReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateAccount(account) {
            var deferred = $q.defer();
            var accountReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/tradeaccount',
                data: account
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    accountReturned = data.data;
                    deferred.resolve(accountReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteAccount(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/tradeaccount?id=' + id
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    deferred.resolve(data);
                }else
                {
                    deferred.reject("error in deleting account.");
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getOrderList()
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeorder'
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getOrderListByAccount(accountId, size)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeorder/getbyaccount?accountid=' + accountId + "&size=" + size
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getOrderListByAccountStatus(accountId, status)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeorder/getbyaccountstatus?accountid=' + accountId + "&status=" + status
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _addOrder(order)
        {
            var deferred = $q.defer();
            var orderReturned;
            var config = {
                method: 'PUT',
                url: appSettings.baseServiceUrl + '/api/tradeorder',
                data: order
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    orderReturned = data.data;
                    deferred.resolve(orderReturned);
                }
                else if(data.status >= 400)
                {
                    deferred.reject(data.data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _deleteOrder(id) {
            var deferred = $q.defer();
            var config = {
                method: 'DELETE',
                url: appSettings.baseServiceUrl + '/api/tradeorder?id=' + id
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

        function _updateOrder(order) {
            var deferred = $q.defer();
            var orderReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/tradeorder',
                data: order
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    orderReturned = data.data;
                    deferred.resolve(orderReturned);
                }
                else if(data.status >= 400)
                {
                    deferred.reject(data.data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _transferFund(accountId, operation, amount) {
            var deferred = $q.defer();
            var balanceReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/tradeaccount/transferfund?accountid=' + accountId + '&operation=' + operation + '&amount=' + amount
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    balanceReturned = data.data;
                    deferred.resolve(balanceReturned);
                }
                else if (data.status >= 200){
                    deferred.reject(data.data);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getAccountBalanceJourneyList(accountId, size)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeaccount/accountbalancejourney?accountid=' + accountId + '&size=' + size
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }


        function _getPositionSummaryListByAccount(accountId, size)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeaccount/positionsummarylist?accountid=' + accountId + '&size=' + size
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getTransactionListByAccount(accountId, size)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeaccount/accounttransaction?accountid=' + accountId + '&size=' + size
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getTransactionById(id)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeaccount/transaction?id=' + id
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getPositionListByAccount(accountId)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeaccount/accountposition?accountid=' + accountId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getOutstandingPositionListByAccount(accountId)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeaccount/accountoutstandingposition?accountid=' + accountId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getAccountSummary(accountId)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeaccount/accountsummary?accountid=' + accountId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updatePosition(position) {
            var deferred = $q.defer();
            var positionReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/tradeorder/updateposition',
                data: position
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    positionReturned = data.data;
                    deferred.resolve(positionReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _getPositionReview(positionId)
        {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appSettings.baseServiceUrl + '/api/tradeorder/tradereview?positionid=' + positionId
            };

            $http(config).then(function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                console.log(error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function _updateReview(review) {
            var deferred = $q.defer();
            var reviewReturned;
            var config = {
                method: 'POST',
                url: appSettings.baseServiceUrl + '/api/tradeorder/tradereview',
                data: review
            };

            $http(config).then(function (data) {
                if (data.status == 200) {
                    reviewReturned = data.data;
                    deferred.resolve(reviewReturned);
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        tradeServiceFactory.getZoneList = _getZoneList;
        tradeServiceFactory.getNextDayZone = _getNextDayZone;
        tradeServiceFactory.addZone = _addZone;
        tradeServiceFactory.deleteZone = _deleteZone;
        tradeServiceFactory.updateZone = _updateZone;
        tradeServiceFactory.getCurrentZone = _getCurrentZone;
        tradeServiceFactory.getCurrentAccount = _getCurrentAccount;

        tradeServiceFactory.getBrokerList = _getBrokerList;
        tradeServiceFactory.addBroker = _addBroker;
        tradeServiceFactory.updateBroker = _updateBroker;
        tradeServiceFactory.deleteBroker = _deleteBroker;

        tradeServiceFactory.getAccountList = _getAccountList;
        tradeServiceFactory.addAccount = _addAccount;
        tradeServiceFactory.updateAccount = _updateAccount;
        tradeServiceFactory.deleteAccount = _deleteAccount;

        tradeServiceFactory.getOrderList = _getOrderList;
        tradeServiceFactory.getOrderListByAccount = _getOrderListByAccount;
        tradeServiceFactory.getOrderListByAccountStatus = _getOrderListByAccountStatus;
        tradeServiceFactory.addOrder = _addOrder;
        tradeServiceFactory.deleteOrder = _deleteOrder;
        tradeServiceFactory.updateOrder = _updateOrder;

        tradeServiceFactory.transferFund = _transferFund;
        tradeServiceFactory.getAccountBalanceJourneyList = _getAccountBalanceJourneyList;
        tradeServiceFactory.getPositionSummaryListByAccount = _getPositionSummaryListByAccount;
        tradeServiceFactory.getTransactionListByAccount = _getTransactionListByAccount;
        tradeServiceFactory.getTransactionById = _getTransactionById;
        tradeServiceFactory.getPositionListByAccount = _getPositionListByAccount;
        tradeServiceFactory.getOutstandingPositionListByAccount = _getOutstandingPositionListByAccount;
        tradeServiceFactory.getAccountSummary = _getAccountSummary;

        tradeServiceFactory.updatePosition = _updatePosition;
        tradeServiceFactory.getPositionReview = _getPositionReview;
        tradeServiceFactory.updateReview = _updateReview;

        return tradeServiceFactory;
    }
})();