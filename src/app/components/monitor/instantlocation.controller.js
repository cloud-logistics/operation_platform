/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('InstantlocationController', InstantlocationController);

    /** @ngInject */
    function InstantlocationController($stateParams,ApiServer,MapService,toastr,$state,$timeout,constdata, $interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        vm.queryParams = {
          containerId : $stateParams.containerId || constdata.defaultContainerId
        };

        var mapCenter = {lat: 31.2891, lng: 121.4648};

        var map = MapService.map_init("instantlocation", mapCenter, "terrain", 4);

        // 鼠标绘图工具
        var overlay = undefined;
        var currentPositionMarker = undefined;
        var infowindow = undefined;

        vm.getInstantlocationInfo = getInstantlocationInfo

        $scope.validationCheck = function(){
            var flag = true;
            if(!$scope.btnClicked){
                return flag;
            }
            if(!vm.queryParams.containerId){
                $scope.containerId_class = " areaRequire ";
                flag = false;
                $scope.isContainerIdInvalida = false;
            }else if(!constdata['validation']['id'].test(vm.queryParams.containerId)){
                flag = false;
                $scope.isContainerIdInvalida = true;
                $scope.containerId_class = " invalida-area "
            }else{
                $scope.isContainerIdInvalida = false;
                $scope.containerId_class = "";
            }
            return flag;
        };


        getInstantlocationInfo(true);

        function getInstantlocationInfo(isNotFromClick) {
            if(!isNotFromClick){
                $scope.btnClicked = true;
            }
            if(!$scope.validationCheck()){
                console.log("校验失败.");
                return;
            }
            ApiServer.getInstantlocationInfo(vm.queryParams, function (response) {
                var bounds = new google.maps.LatLngBounds();
                var containerInfo = response.data.containerInfo;
                var startPosition = response.data.startPosition;
                var currentPosition = response.data.currentPosition;
                var currentLocationName = response.data.currentLocationName;
                var endPosition = response.data.endPosition;

                if(R.equals({lng:0, lat:0}, currentPosition)){
                    console.log("position: 0,0")
                    currentPositionMarker = MapService.addMarker(map)(currentPosition,{notTranslate:true});
                    infoWindow(map, currentPositionMarker, "当前搜索的云箱位置信息不正确，请查看详情");
                } else {
                    currentPositionMarker = MapService.addMarker(map)(currentPosition,{notTranslate:true});
                    google.maps.event.addListener(currentPositionMarker, 'click', function (event) {
                        infoWindow(map, currentPositionMarker, "当前位置: " + currentLocationName);
                    });
                    infoWindow(map, currentPositionMarker, "当前位置: " + currentLocationName);

                    bounds.extend(currentPositionMarker.getPosition());
                    map.fitBounds(bounds);
                }

            },function (err) {
                console.log("Get Historyview Info Failed", err);
            });
        }

        function infoWindow(map, marker, content) {
          if(!R.isNil(infowindow)){
              infowindow.close();
          }
          infowindow = new google.maps.InfoWindow({
            content: content
          });

          infowindow.open(map, marker);
        }

        function direction(startPointLatlng, endPointLatlng) {
          var directionsDisplay = new google.maps.DirectionsRenderer();
          var directionsService = new google.maps.DirectionsService();
          var control = document.getElementById('floating-panel');

          directionsDisplay.setMap(map);
          var request = {
            origin: startPointLatlng,
            destination: endPointLatlng,
            travelMode: 'DRIVING'
          };
          directionsService.route(request, function(result, status) {
            if (status == 'OK') {
              directionsDisplay.setDirections(result);
            }
          });
        }
    }
})();
