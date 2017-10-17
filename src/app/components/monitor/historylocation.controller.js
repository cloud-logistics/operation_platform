/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('HistorylocationController', HistorylocationController);

    /** @ngInject */
    function HistorylocationController($stateParams, constdata, ApiServer,MapService,toastr,$state,$timeout,$interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var histories = [];
        var routes = [];
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};
        var mapCenter = {lat: 31.2891, lng: 121.4648};

        var map = MapService.map_init("histotylocation", mapCenter, "terrain", 4);

        console.log($stateParams);

        vm.getHistorylocationInfo = getHistorylocationInfo

        vm.queryParams = {
            containerId: $stateParams.containerId || constdata.defaultContainerId,
            startTime: moment(new Date()),
            endTime: moment(new Date())
        };

        // 鼠标绘图工具
        var overlay = undefined;

        vm.getHistorylocationInfo = getHistorylocationInfo;

        getHistorylocationInfo()

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
                console.log(histories);

                routes = histories.map(function (route) {
                  var startPointLatlng = route.start.position
                  var endPointLatlng = route.end.position

                  //var startPointMarker = MapService.addMarker(map)(route.start.position)
                  //var endPointMarker = MapService.addMarker(map)(route.end.position)
                  console.log(route.start.locationName);

                  //infoWindow(map, startPointMarker, "起点: " + route.start.locationName)

                  //infoWindow(map, endPointMarker, "终点: " + route.end.locationName)

                  bounds.extend(startPointLatlng);
                  bounds.extend(endPointLatlng);

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
