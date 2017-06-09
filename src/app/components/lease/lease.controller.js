/**
 * Created by guankai on 25/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('LeaseController', LeaseController);

    /** @ngInject */
    function LeaseController($stateParams, ApiServer, MapService, toastr, $state, $timeout, $interval, $scope) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        vm.mapSize = {"width": width + 'px', "height": height + 'px'};

        var map = MapService.map_init("dashboard_map", "terrain");
        var markers = []
        var circles = []
        vm.containers = [];

        $scope.showDetail = false;
        $scope.checkDetail = checkDetail
        $scope.detailIdx = 0;

        function getOnLeaseContainers() {
            ApiServer.getOnLeaseContainers(function (response) {
                vm.containers = response.data.containersonlease;

                markers = R.compose(
                    R.map(MapService.addMarker(map, "container")),
                    R.map(R.prop("position"))
                )(vm.containers)

                vm.containers = parseLocation(vm.containers)

            }, function (err) {
                console.log("Get Container Info Failed", err);
            });
        }

        function parseLocation(initialContainers) {
            var containersAfterParse = R.map(function(container){
                var locationName = undefined;

                MapService.geoCodePosition(container.position)
                .then(function(results){
                    if(!R.isNil(results)){
                        locationName = R.head(results).formatted_address
                        console.log(locationName);
                    } else {
                        locationName = "未找到地名"
                        console.log(locationName);
                    }

                    container.locationName = locationName
                })
                .catch(function(status){
                    // alert(status)
                    console.log(status);
                })
                return container
            })(initialContainers)

            return containersAfterParse;
        }

        function checkDetail(idx) {
            $scope.detailIdx = idx;
            $scope.showDetail = true;
        }


        getOnLeaseContainers();
        var timer = $interval(function(){
            getOnLeaseContainers();
        },50000, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });
    }

})();