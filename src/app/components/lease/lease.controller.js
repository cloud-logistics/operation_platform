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
        vm.markers = []
        var circles = []
        vm.containers = [];
        vm.selectedContainer = undefined;

        $scope.showDetail = false;
        $scope.checkDetail = checkDetail
        $scope.detailIdx = 0;

        function getOnLeaseContainers() {
            ApiServer.getOnLeaseContainers(function (response) {
                vm.containers = response.data.containersonlease;

                vm.markers = R.compose(
                    R.map(MapService.addMarker(map, "container")),
                    R.map(R.prop("position"))
                )(vm.containers)

                function add_listener(i) {
                    return function(e) {
                        checkDetail(i)
                    }
                }

                for( var i = 0; i < vm.markers.length; i++) {
                    vm.markers[i].addListener('click', add_listener(i));
                }

            }, function (err) {
                console.log("Get Container Info Failed", err);
            });
        }

        function checkDetail(idx) {
            $scope.detailIdx = idx;
            vm.selectedContainer = vm.containers[idx];
            $scope.showDetail = true;

            console.log(vm.selectedContainer);
            console.log($scope.showDetail);
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