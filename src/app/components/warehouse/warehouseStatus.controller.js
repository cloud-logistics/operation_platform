/**
 * Created by xianZJ on 2017/10/17.
 */

var showStatus = function(id) {
    //getBoxbysite(id);
    switchStatus(true);
    switchRecord(false);
};

var showRecord = function(id) {
    //getSiteStream(id);
    switchRecord(true);
    switchStatus(false);
};

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
        var infoWindows = [];
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
        
        var getBoxbysite = function(id){
            ApiServer.getBoxbysite(id, function(response){
                vm.whStatusData = response.data.data.results;
                console.log(response.data.data.results);
            }, function(err){
                console.log("Get Stream Info Failed", err);
            });
        }

        var getSiteStream = function(id) {
            ApiServer.getSiteStream(id, function(response){
                vm.recordList = response.data.siteHistory;
                console.log(response.data.siteHistory);
            }, function(err){
                console.log("Get Stream Info Failed", err);
            });
        }

        function clearMarker () {
            markers.map(function (marker){
                marker.setMap(null)
            })
            markers = []
        }

        setMap();
        getSitesInfo();
        getSiteStream(1);
        getBoxbysite(1);

        function addMarkerWithInfo (siteInfo) {
            var position = {
                lat: siteInfo.latitude,
                lng: siteInfo.longitude
            }

            function showStatusHandler(){
                console.log(siteInfo.site_code);
            }

            var marker = MapService.addMarker(map, "warehouse")(position)
            var content = "<div class='wh_map'>" +
                "<span class='wh_map_infowindow_name'>" + siteInfo.site_code + "</span><br/>" +
                "<span class='wh_map_infowindow_address'>" + siteInfo.location + "</span><br/>" +
                "<span class='wh_map_infowindow_btn1' onclick='showStatus(\"" + siteInfo.id + "\")'>在库云箱</span>" +
                "<span class='wh_map_infowindow_btn2' onclick='showRecord(\"" + siteInfo.id + "\")'>云箱出入记录</span>" +
                "</div>"

            var infowindow = new google.maps.InfoWindow(
                {
                    content: content
                });

            infoWindows = R.append(infowindow)(infoWindows);

            google.maps.event.addListener(marker, 'click', function (event) {
                R.map(function(item){
                    item.close();
                })(infoWindows);

                infowindow.open(map, marker);
            });

            return marker;
        }

    }
})();
