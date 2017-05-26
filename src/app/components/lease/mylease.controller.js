/**
 * Created by guankai on 26/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('MyleaseController', MyleaseController);

    /** @ngInject */
    function MyleaseController($stateParams, ApiServer, MapService, toastr, $state, $timeout, $interval) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        vm.mapSize = {"width": width + 'px', "height": height + 'px'};

        var map = MapService.map_init("dashboard_map", "terrain");
        var markers = []
        var circles = []

        function getContainerInfo() {
            ApiServer.getContainerOverviewInfo(function (response) {
                var containers = response.data

                markers = R.compose(
                    R.map(MapService.addMarker(map, "container")),
                    R.map(R.prop("position"))
                )(containers)

            }, function (err) {
                console.log("Get Container Info Failed", err);
            });
        }


        getContainerInfo();
        // var timer = $interval(function(){
        //     getContainerInfo();
        // },5000, 500);

    }

})();