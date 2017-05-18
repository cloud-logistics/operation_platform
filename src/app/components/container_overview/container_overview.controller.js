/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('ContainerOverviewController', ContainerOverviewController);

    /** @ngInject */
    function ContainerOverviewController($stateParams,ApiServer,MapService,toastr,$state,$timeout,$interval) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        var mapInfo = MapService.map_init("container_overview");

        function getContainerOverviewInfo() {
            ApiServer.getContainerOverviewInfo(function (response) {
                response.data.map(MapService.addPoint(mapInfo.map, false, "container"))
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        getContainerOverviewInfo();
        var timer = $interval(function(){
            getContainerOverviewInfo();
        },5000, 500);

    }

})();
