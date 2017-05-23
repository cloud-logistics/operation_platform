/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('InstantlocationController', InstantlocationController);

    /** @ngInject */
    function InstantlocationController($stateParams,ApiServer,MapService,toastr,$state,$timeout,$interval) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        var map = MapService.map_init("instantlocation", "terrain", 4);

        // 鼠标绘图工具
        var overlay = undefined;

        var geocoder = new google.maps.Geocoder;

        getInstantlocationInfo();
        // var timer = $interval(function(){
        //     getInstantlocationInfo();
        // },5000, 500);

        function getInstantlocationInfo() {
            var queryParams = {
              containerId: "123",
              startTime:"111",
              endTime: "321"
            }
            ApiServer.getInstantlocationInfo(queryParams, function (response) {
                var bounds = new google.maps.LatLngBounds();
                var containerInfo = response.data.containerInfo
                var startPosition = response.data.startPosition
                var currentPosition = response.data.currentPosition
                var endPosition = response.data.endPosition

                console.log(response.data);

                var startPositionMarker = MapService.addMarker(map)(startPosition)
                var currentPositionMarker = MapService.addMarker(map)(currentPosition)
                var endPositionMarker = MapService.addMarker(map)(startPosition)


                geocoder.geocode({'location': currentPosition}, function(results, status){
                  if(!R.isNil(results)) {
                    infoWindow(map, currentPositionMarker, "当前点: " + R.head(results).formatted_address)
                  }
                })

                bounds.extend(startPositionMarker.getPosition());
                bounds.extend(currentPositionMarker.getPosition());
                bounds.extend(endPositionMarker.getPosition());

                direction(startPosition, currentPosition)
                direction(currentPosition, endPosition)

                map.fitBounds(bounds);

            },function (err) {
                console.log("Get Historyview Info Failed", err);
            });
        }

        function infoWindow(map, marker, content) {
          var infowindow = new google.maps.InfoWindow({
            content: content
          });

          infowindow.open(map, marker);
        }

        function direction(startPointLatlng, endPointLatlng) {
          var directionsDisplay = new google.maps.DirectionsRenderer();
          var directionsService = new google.maps.DirectionsService();

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
