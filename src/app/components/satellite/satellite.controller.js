/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('SatelliteController', SatelliteController);

    /** @ngInject */
    function SatelliteController($stateParams,ApiServer,MapService,toastr,$state,$timeout,$interval) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        var mapInfo = MapService.map_init("satellite_overview", "satellite");

        //创建航线，航线是固定的。。。出于保密原因，先这样

        function getSateliteInfo() {
            ApiServer.getSateliteInfo(function (response) {
                response.data.map(MapService.addMarker(mapInfo.map))
                response.data.map(MapService.addCircle(mapInfo.map))
            },function (err) {
                console.log("Get Satelite Info Failed", err);
            });
        }

        getSateliteInfo();
        var timer = $interval(function(){
            getSateliteInfo();
        },5000, 500);

    }

})();
