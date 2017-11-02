/**
 * Created by xianZJ on 2017/10/17.
 */

var switchStatus = function(isShow){
    if(isShow){
        $("#whTable").show();
    }else{
        $("#whTable").hide();
    }
};
var switchRecord = function(isShow){
    if(isShow){
        $("#whHistory").show();
    }else{
        $("#whHistory").hide();
    }
};

(function () {
    angular.module('smart_container').controller('WarehouseStatusController', WarehouseStatusController);

    /** @ngInject */
    function WarehouseStatusController($scope, ApiServer, MapService, $interval) {
        var vm = this;
        var markers = [];
        var map;
        vm.stateMenu = {
            'in':"入库",
            'out':"出库"
        };
        var setMap = function(){
            var width = document.body.clientWidth;
            var height = document.body.clientHeight;
            var mapCenter = {lat: 31.2891, lng: 121.4648};
            vm.mapSize = {"width": width + 'px', "height": height + 'px'};
            map = MapService.map_init("warehouseStatus_map", mapCenter, "terrain");
        };


        var getContainerInfo = function () {
            ApiServer.getContainerOverviewInfo(function (response) {
                var containers = response.data;
                markers = R.compose(
                    R.map(MapService.addMarker(map, "warehouse")),
                    R.map(R.prop("position"))
                )(containers)
                _.map(markers, function (item) {
                    var infowindow = new google.maps.InfoWindow(
                        {
                            content: "<div class='wh_map'>" +
                            "<span class='wh_map_infowindow_name'>XXX号仓库</span><br/>" +
                            "<span class='wh_map_infowindow_address'>地址: 中国陕西省西安市环普产业园E座6F</span><br/>" +
                            "<span class='wh_map_infowindow_btn1' onclick='switchStatus(true)'>在库云箱</span>" +
                            "<span class='wh_map_infowindow_btn2' onclick='switchRecord(true)'>云箱出入记录</span>" +
                            "</div>"
                        });
                    google.maps.event.addListener(item, 'click', function (event) {
                        infowindow.open(map, item);
                    });
                })
                console.log("markers = ", markers)
            }, function (err) {
                console.log("Get Container Info Failed", err);
            });
        };

        function clearMarker () {
            markers.map(function (marker){
                marker.setMap(null)
            })
            markers = []
        }

        var getCloudBoxStatusData = function () {
            vm.whStatusData = ApiServer.getCloudBoxData();
        };

        var getCloudBoxInOutRecord = function(){
            vm.recordList = ApiServer.getCloudBoxInOutRecord();
        };

        setMap();
        getContainerInfo();
        getCloudBoxStatusData();
        getCloudBoxInOutRecord();
    }
})();