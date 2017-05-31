/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('HistorylocationController', HistorylocationController);

    /** @ngInject */
    function HistorylocationController($stateParams,ApiServer,MapService,toastr,$state,$timeout,$interval) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var histories = [];
        var routes = [];
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        var map = MapService.map_init("histotylocation", "terrain", 4);

        console.log($stateParams);

        vm.queryParams = R.compose(
          R.when(
            R.compose(R.equals(""), R.prop("startTime")),
            R.omit(["startTime"])
          ),
          R.when(
            R.compose(R.equals(""), R.prop("endTime")),
            R.omit(["endTime"])
          )
        )($stateParams);

        // 鼠标绘图工具
        var overlay = undefined;

        var geocoder = new google.maps.Geocoder;

        vm.getHistorylocationInfo = getHistorylocationInfo;

        getHistorylocationInfo();
        // var timer = $interval(function(){
        //     getHistorylocationInfo();
        // },5000, 500);

        function getHistorylocationInfo() {
            var transformations = {
                startTime: R.compose(R.toString, Date.parse),
                endTime: R.compose(R.toString, Date.parse)
            };
            var queryParams = R.evolve(transformations)(vm.queryParams)

            console.log(queryParams);

            ApiServer.getHistorylocationInfo(queryParams, function (response) {
                var bounds = new google.maps.LatLngBounds();

                histories = response.data.containerhistory

                routes = histories.map(function (route) {
                  var startPointLatlng = route.start.position
                  var endPointLatlng = route.end.position

                  var startPointMarker = MapService.addMarker(map)(route.start.position)
                  var endPointMarker = MapService.addMarker(map)(route.end.position)

                  geocoder.geocode({'location': startPointLatlng}, function(results, status){
                    if(!R.isNil(results)) {
                      infoWindow(map, startPointMarker, "起点: " + R.head(results).formatted_address)
                    }
                  })

                  geocoder.geocode({'location': endPointLatlng}, function(results, status){
                    if(!R.isNil(results)) {
                      infoWindow(map, endPointMarker, "终点: " + R.head(results).formatted_address)
                    }
                  })

                  bounds.extend(startPointMarker.getPosition());
                  bounds.extend(endPointMarker.getPosition());

                  direction(startPointLatlng, endPointLatlng)
                })

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
