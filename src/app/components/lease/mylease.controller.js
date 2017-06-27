/**
 * Created by guankai on 26/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('MyleaseController', MyleaseController);

    /** @ngInject */
    function MyleaseController($scope,$stateParams, ApiServer, MapService, toastr, $state, $timeout, $interval) {
        /* jshint validthis: true */
        var vm = this;

        var mapCenter = {lat: 31.2891, lng: 121.4648};

        var map = MapService.map_init("mylease_map", mapCenter, "terrain");
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

        vm.selectedContainer = undefined;
        vm.requestLease = requestLease;
        vm.returnContainer = returnContainer;
        vm.requestParams = {
            containerType : "标准云箱",
            startTime:1495597347299,
            endTime:1495597347299
        };
        $scope.modalInput = false

        $scope.toggleModal = function() {
            $scope.modalInput = true;
        }

        function returnContainer(containerId) {
            var params = {
                containerId : containerId
            }
            console.log("Return containerId: ", containerId);
            ApiServer.returnContainer(params, function(response){
                getContainerInfo()
                console.log(response);
            }, function(err){
                console.log("Return error: ", err);
            })
        }

        function requestLease() {
            console.log(vm.requestParams);
            ApiServer.requestLease(vm.requestParams, function(response){
                // update container status
                getContainerInfo()
                console.log(response);
            }, function(err){
                $scope.modalInput = true;
                console.log("requestLease failed", err);
            })
        }

        function getContainerInfo() {
            ApiServer.getMyContainers(successHandler("mycontainers", myContainersPostProc), failureHandler);

            ApiServer.getAvailableContainers(successHandler("availablecontainers"), failureHandler);
        }

        $scope.mineActive = true;
        $scope.leaseActive = false;
        $scope.refundActive = false;
        $scope.mineShow = true;
        $scope.leaseShow = false;
        $scope.refundShow = false;

        $scope.clickMine = function(){
            $scope.mineActive = true;
            $scope.leaseActive = false;
            $scope.refundActive = false;
            $scope.leaseShow = false;
            $scope.mineShow = true;

            refreshMarkers(vm.containersInfo.mycontainers.detail);
        };

        $scope.clickLease = function(){
            $scope.leaseActive = true;
            $scope.mineActive = false;
            $scope.refundActive = false;
            $scope.mineShow = false;
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
                console.log(response.data);
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

            // default value
            vm.selectedContainer = vm.containersInfo.mycontainers.detail[0];
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

            function add_listener(i) {
                return function(e) {
                    checkDetail(containers, i)
                }
            }

            for( var i = 0; i < markers.length; i++) {
                markers[i].addListener('click', add_listener(i))
            }
        }


        function checkDetail(containers, idx) {
            $scope.detailIdx = idx;
            $scope.showDetail = true;

            vm.selectedContainer = containers[idx];

            console.log(vm.selectedContainer);
            console.log($scope.showDetail);
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
