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

        var map = MapService.map_init("satellite_overview", "satellite");
        var markers = []
        var circles = []

        //创建航线，航线是固定的。。。出于保密原因，先这样

        function getSateliteInfo() {
            ApiServer.getSateliteInfo(function (response) {
                var satellites = response.data

                markers = R.compose(
                    R.map(MapService.addMarker(map, "satellite")),
                    R.map(R.prop("position"))
                )(satellites)

                circles = R.compose(
                    R.map(MapService.addCircle(map)),
                    R.map(R.prop("position"))
                )(satellites)

            },function (err) {
                console.log("Get Satelite Info Failed", err);
            });
        }

        getSateliteInfo();
        // var timer = $interval(function(){
        //     getSateliteInfo();
        // },5000, 500);

    }

})();
