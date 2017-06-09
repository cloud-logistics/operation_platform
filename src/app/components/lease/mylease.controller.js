/**
 * Created by guankai on 26/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('MyleaseController', MyleaseController);

    /** @ngInject */
    function MyleaseController($scope,$stateParams, ApiServer, MapService, toastr, $state, $timeout, $interval, parseLocation) {
        /* jshint validthis: true */
        var vm = this;

        var map = MapService.map_init("mylease_map", "terrain");
        var markers = [];
        vm.containersInfo = {
            mycontainers:{
                detail:[],
                count: 0
            },
            availablecontainers: {
                detail: [],
                count: 0
            }
        }

        function getContainerInfo() {
            ApiServer.getMyContainers(successHandler("mycontainers", myContainersPostProc), failureHandler);

            ApiServer.getAvailableContainers(successHandler("availablecontainers"), failureHandler);
        }

        $scope.mineActive = true;
        $scope.leaseActive = false;
        $scope.refundActive = false;
        $scope.leaseShow = false;
        $scope.refundShow = false;

        $scope.clickMine = function(){
            $scope.mineActive = true;
            $scope.leaseActive = false;
            $scope.refundActive = false;
            $scope.leaseShow = false;

            refreshMarkers(vm.containersInfo.mycontainers.detail);
        };

        $scope.clickLease = function(){
            $scope.leaseActive = true;
            $scope.mineActive = false;
            $scope.refundActive = false;
            $scope.leaseShow = true;
            $scope.refundShow = false;

            refreshMarkers(vm.containersInfo.availablecontainers.detail);
        };

        $scope.clickRefund = function(){
            $scope.leaseActive = false;
            $scope.mineActive = false;
            $scope.refundActive = true;
            $scope.leaseShow = false;
            $scope.refundShow = true;
        }

        function successHandler(key, callback) {
            return function (response) {
                vm.containersInfo[key].detail = R.prop(key)(response.data)
                vm.containersInfo[key].count = vm.containersInfo[key].detail.length
                if(callback !== undefined) {
                    callback()
                }
            }
        }

        function failureHandler(err) {
            console.log("Get Container Info Failed", err);
        }

        function myContainersPostProc() {
            refreshMarkers(vm.containersInfo.mycontainers.detail);

            vm.containersInfo.mycontainers.detail = parseLocation(vm.containersInfo.mycontainers.detail)
        }

        function refreshMarkers(containers) {
            console.log(containers);
            markers.map(function (marker){
                marker.setMap(null)
            })
            markers = []

            markers = R.compose(
                R.map(MapService.addMarker(map, "container")),
                R.map(R.prop("position"))
            )(containers)
        }

        getContainerInfo();
        var timer = $interval(function(){
            getContainerInfo();
        },50000, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });
    }

})();