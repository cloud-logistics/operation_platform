/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('HistoryviewController', HistoryviewController);

    /** @ngInject */
    function HistoryviewController($stateParams,ApiServer,MapService,toastr,$state,$timeout,$interval) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var histories = [];
        var routes = [];
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        var mapInfo = MapService.map_init("histotyview", "terrain", 4);

        // 鼠标绘图工具
        var overlay = undefined;

        var geocoder = new google.maps.Geocoder;

        getHistoryviewInfo();
        // var timer = $interval(function(){
        //     getHistoryviewInfo();
        // },5000, 500);

        function getHistoryviewInfo() {
            var queryParams = {
              containerId: "123",
              startTime:"111",
              endTime: "321"
            }
            ApiServer.getHistoryviewInfo(queryParams, function (response) {
                var bounds = new google.maps.LatLngBounds();

                histories = response.data

                routes = response.data.map(function (route) {
                  var startPointLatlng = {lat: route.start.position.latitude, lng: route.start.position.longitude}
                  var endPointLatlng = {lat: route.end.position.latitude, lng: route.end.position.longitude}

                  var startPointMarker = MapService.addMarker(mapInfo.map)(route.start.position)
                  var endPointMarker = MapService.addMarker(mapInfo.map)(route.end.position)

                  geocoder.geocode({'location': startPointLatlng}, function(results, status){
                    if(!R.isNil(results)) {
                      infoWindow(mapInfo.map, startPointMarker, "起点: " + R.head(results).formatted_address)
                    }
                  })

                  geocoder.geocode({'location': endPointLatlng}, function(results, status){
                    if(!R.isNil(results)) {
                      infoWindow(mapInfo.map, endPointMarker, "终点: " + R.head(results).formatted_address)
                    }
                  })

                  bounds.extend(startPointMarker.getPosition());
                  bounds.extend(endPointMarker.getPosition());

                  direction(startPointLatlng, endPointLatlng)
                })

                mapInfo.map.fitBounds(bounds);

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

          directionsDisplay.setMap(mapInfo.map);

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
