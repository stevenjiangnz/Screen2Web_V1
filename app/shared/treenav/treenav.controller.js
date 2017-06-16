/**
 * Created by steven on 28/04/2016.
 */
(function () {
    "use strict";

    var app = angular.module('screenApp');

    app.controller('TreeNavController', ['$scope', '$rootScope', '$state', 'authService', '$timeout', TreeNavController]);

    function TreeNavController($scope, $rootScope, $state, authService, $timeout) {
        var treeData = [];

        activate();

        function activate() {

        }

        $scope.displayTree = function (container, data) {
            prepareTreeData(data);

            container.fancytree({
                source: treeData,
                activeVisible: true,
                focusOnSelect: true,
                autoCollapse: true,
                selectMode: 1,
                extensions: ["filter", "childcounter"],
                childcounter: {
                    deep: true,
                    hideZeros: true,
                    hideExpanded: true
                },
                filter: {
                    autoApply: true, // Re-apply last filter if lazy data is loaded
                    counter: true, // Show a badge with number of matching child nodes near parent icons
                    hideExpandedCounter: true, // Hide counter badge, when parent is expanded
                    mode: "hide"  // "dimm": Grayout unmatched nodes, "hide": remove unmatched nodes
                },
                init: function (event, data) {
                    data.tree.activateKey($scope.shareId);
                },
                activate: onNodeActivate
            });
        };

        function onNodeActivate(event, data) {
            if (!data.node.folder) {
                $timeout(
                    function () {
                        $scope.shareId = data.node.key;
                    }
                );
            } else {
                data.node.setExpanded();
            }
        }

        $scope.goFilter = function () {
            $scope.treeContainer.fancytree("getTree").filterNodes(
                function (node) {
                    var match = false;
                    if (node.tooltip) {
                        var tp = node.tooltip.toUpperCase();

                        if (tp.indexOf($scope.filterString.toUpperCase()) >= 0) {
                            match = true;
                        }
                    }
                    return match;
                },
                {
                    autoExpand: true,
                    leavesOnly: true
                });

        };

        $scope.resetFilter = function () {
            $scope.treeContainer.fancytree("getTree").clearFilter();
        };

        $scope.setPreviousNode = function () {
            var node = $scope.treeContainer.fancytree("getActiveNode");

            if (node) {
                var previousNode = node.getPrevSibling()
                $scope.treeContainer.fancytree("getTree").activateKey(previousNode.key);
            }
        };
        $scope.setNextNode = function () {
            var node = $scope.treeContainer.fancytree("getActiveNode");

            if (node) {
                var nextNode = node.getNextSibling()
                $scope.treeContainer.fancytree("getTree").activateKey(nextNode.key);
            }
        };

        function prepareTreeData(shareList) {
            loadIndex(shareList);

            loadStock(shareList);

            loadETF(shareList);

            loadWatch(shareList);

            loadScan(shareList);
        }

        function loadIndex(shareList) {
            var indexData = {
                title: "Index",
                key: "cat.index",
                folder: true,
                children: []
            };

            var shareIndexList = _.filter(shareList, function (share) {
                return share.shareType == 'Index'
            });

            var treeIndexObj = _.groupBy(shareIndexList, function (share) {
                return share.industry;
            });

            for (var k in treeIndexObj) {
                indexData.children.push({
                    'title': k,
                    'key': 'index.' + k,
                    folder: true,
                    'children': getStockNodes(treeIndexObj[k])
                });
            }

            treeData.push(indexData);
        }

        function loadStock(shareList) {
            var stockData = {
                title: "Stock",
                key: "cat.stock",
                folder: true,
                children: []
            };

            var shareStockList = _.filter(shareList, function (share) {
                return share.shareType == 'Stock'
            });

            var treeStockObj = _.groupBy(shareStockList, function (share) {
                return share.sector;
            });

            for (var k in treeStockObj) {
                stockData.children.push({
                    'title': k,
                    'key': 'stock.' + k,
                    folder: true,
                    'children': getStockNodes(treeStockObj[k])
                });
            }

            stockData.children = _.sortBy(stockData.children, 'title');

            treeData.push(stockData);
        }

        function loadETF(shareList) {
            var etfData = {
                title: "ETF",
                key: "cat.etf",
                folder: true,
                children: []
            };

            var shareETFList = _.filter(shareList, function (share) {
                return share.shareType == 'ETF'
            });

            var treeETFObj = _.groupBy(shareETFList, function (share) {
                return share.industry;
            });

            for (var k in treeETFObj) {
                etfData.children.push({
                    'title': k,
                    'key': 'etf.' + k,
                    folder: true,
                    'children': getStockNodes(treeETFObj[k])
                });
            }

            etfData.children = _.sortBy(etfData.children, 'title');

            treeData.push(etfData);
        }


        function loadWatch(shareList) {
            var watchData = {
                title: "Watch List",
                key: "cat.watch",
                folder: true,
                children: []
            };

            treeData.push(watchData);
        }

        function loadScan(shareList) {
            var scanData = {
                title: "Scan",
                key: "cat.scan",
                folder: true,
                children: []
            };

            treeData.push(scanData);
        }


        function getStockNodes(stockList) {
            var stockNodeList = [];

            for (var i = 0; i < stockList.length; i++) {

                stockNodeList.push({
                    title: stockList[i].symbol,
                    key: stockList[i].id,
                    tooltip: stockList[i].symbol + ' - ' + stockList[i].name
                });
            }

            return stockNodeList;
        }

    }

})();