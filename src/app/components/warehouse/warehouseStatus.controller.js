/**
 * Created by xianZJ on 2017/10/17.
 */
var showStatus = function (id) {
    var dom = document.getElementById("whTable");
    var scope = angular.element(dom).scope();
    scope['getBoxbysite'](id, function () {
        switchRecord(false);
        switchStatus(true);
    })
};

var showRecord = function (id) {
    var dom = document.getElementById("whTable");
    var scope = angular.element(dom).scope();
    scope['getSiteStream'](id, function () {
        switchRecord(true);
        switchStatus(false);
    })
};

var switchStatus = function (isShow) {
    if (isShow) {
        $("#whTable").show();
        $(".infoMask1").show();
    } else {
        $("#whTable").hide();
        $(".infoMask1").hide();
    }
};
var switchRecord = function (isShow) {
    if (isShow) {
        $("#whHistory").show();
        $(".infoMask2").show();
    } else {
        $("#whHistory").hide();
        $(".infoMask2").hide();
    }
};
(function () {
    angular.module('smart_container').controller('WarehouseStatusController', WarehouseStatusController);

    /** @ngInject */
    function WarehouseStatusController($scope, ApiServer, MapService, $interval) {
        var vm = this;
        var markers = [];
        var infoWindows = [];
        var map;
        vm.stateMenu = {
            'in': "入库",
            'out': "出库"
        };

        var initMap = function () {
            var width = document.body.clientWidth;
            var height = document.body.clientHeight;
            var mapCenter = {lat: 39.26, lng: 115.25};
            vm.mapSize = {"width": width + 'px', "height": height + 'px'};
            map = MapService.map_init("warehouseStatus_map", mapCenter, "terrain",4);
        };

        var getSitesInfo = function () {
            ApiServer.getAllsites(1, function (response) {
                markers = R.compose(
                    R.map(addMarkerWithInfo),
                    R.path(["data", "data", "results"])
                )(response);
            }, function (err) {
                console.log("Get Container Info Failed", err);
            });
        };

        $scope.getBoxbysite = function (id, callback) {
            if (id) {
                localStorage.setItem("siteId", id);
            } else {
                if (localStorage.getItem('siteId')) {
                    id = localStorage.getItem('siteId')
                } else {
                    console.log("仓库ID不能为空。");
                    return;
                }
            }
            ApiServer.getBoxbysite({
                "id":id,
                "limit": $scope.conf.itemsPerPage,
                "offset": ($scope.conf.currentPage - 1) * $scope.conf.itemsPerPage,
                "success": function (response) {
                    vm.whStatusData = response.data.data.results;
                    $scope.conf.totalItems = response.data.data.count;
                    if (callback) {
                        callback()
                    }
                },
                "error": function (err) {
                    console.log("Get Stream Info Failed", err);
                }
            });
        }

        $scope.getSiteStream = function (id, callback) {

            ApiServer.getSiteStream(id, function (response) {
                vm.recordList = response.data.siteHistory.reverse();
                console.log(response.data.siteHistory);
                ApiServer.getBoxbysite({
                    "id":id,
                    "limit": $scope.conf.itemsPerPage,
                    "offset": ($scope.conf.currentPage - 1) * $scope.conf.itemsPerPage,
                    "success": function (response) {
                        $scope.conf.totalItems = response.data.data.count;
                        if (callback) {
                            callback()
                        }
                    },
                    "error": function (err) {
                        console.log("Get Stream Info Failed", err);
                    }
                });
            }, function (err) {
                console.log("Get Stream Info Failed", err);
            });
        };

        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
            }
        };

        function clearMarker() {
            markers.map(function (marker) {
                marker.setMap(null)
            })
            markers = []
        }

        initMap();
        getSitesInfo();

        function addMarkerWithInfo(siteInfo) {
            var position = {
                lat: parseFloat(siteInfo.latitude),
                lng: parseFloat(siteInfo.longitude)
            };

            function showStatusHandler() {
                console.log(siteInfo.site_code);
            }

            var marker = MapService.addMarker(map, "warehouse")(position,{notTranslate:true})
            var content = "<div class='wh_map'>" +
                "<span class='wh_map_infowindow_name'>" + siteInfo.site_code  + "号仓库" + "</span><br/>" +
                "<span class='wh_map_infowindow_address'>" + "地址：" + siteInfo.location + "</span><br/>" +
                "<span class='wh_map_infowindow_btn1' onclick='showStatus(\"" + siteInfo.id + "\")'>在库云箱</span>" +
                "<span class='wh_map_infowindow_btn2' onclick='showRecord(\"" + siteInfo.id + "\")'>云箱出入记录</span>" +
                "</div>"

            var infowindow = new google.maps.InfoWindow(
                {
                    content: content
                });

            infoWindows = R.append(infowindow)(infoWindows);

            google.maps.event.addListener(marker, 'click', function (event) {
                R.map(function (item) {
                    item.close();
                })(infoWindows);

                infowindow.open(map, marker);
            });

            return marker;
        }

        $scope.$watchGroup(['conf.currentPage', 'conf.itemsPerPage'], function () {
            $scope.getBoxbysite();
        })
    }
})();
