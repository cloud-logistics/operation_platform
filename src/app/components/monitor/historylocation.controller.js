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
        var heatmap = undefined;

        console.log($stateParams);

        vm.getHistorylocationInfo = getHistorylocationInfo

        vm.queryParams = {
            containerId: $stateParams.containerId || constdata.defaultContainerId,
            start_time: moment(new Date()),
            end_time: moment(new Date())
        };

        // 鼠标绘图工具
        var overlay = undefined;

        vm.getHistorylocationInfo = getHistorylocationInfo;

        getHistorylocationInfo()

        function getHistorylocationInfo() {
            var start_time = vm.queryParams.start_time.valueOf().toString().slice(0,10);
            var end_time = vm.queryParams.end_time.valueOf().toString().slice(0,10);
          
            var queryParams = {
                containerId: vm.queryParams.containerId,
                start_time: start_time,
                end_time: end_time
            }

            ApiServer.getHistorypath(queryParams, function (response) {
                var bounds = new google.maps.LatLngBounds();

                var histData = R.map(function(item){
                    var lng = parseFloat(item.longitude);
                    var lat = parseFloat(item.latitude);
                    var item = new google.maps.LatLng(lat, lng);
                    return item;
                })(response.data.path);

                heatmap = new google.maps.visualization.HeatmapLayer({
                  data: histData,
                  map: map
                });

                histData.map(function (item) {
                  bounds.extend(item);
                })

                map.fitBounds(bounds);

            },function (err) {
                console.log("Get Historyview Info Failed", err);
            });
        }

        function getData(){
          var res = {
              "status": "OK",
              "msg": "get history path success",
              "path": [
                  {
                      "timestamp": 1510628670,
                      "longitude": "114.053531",
                      "latitude": "22.533053"
                  },
                  {
                      "timestamp": 1510629270,
                      "longitude": "114.053531",
                      "latitude": "22.533053"
                  },
                  {
                      "timestamp": 1510629870,
                      "longitude": "114.053531",
                      "latitude": "22.533053"
                  },
                  {
                      "timestamp": 1510630470,
                      "longitude": "114.053531",
                      "latitude": "22.533053"
                  },
                  {
                      "timestamp": 1510631070,
                      "longitude": "114.053531",
                      "latitude": "22.533053"
                  },
                  {
                      "timestamp": 1510631670,
                      "longitude": "114.053531",
                      "latitude": "22.533053"
                  },
                  {
                      "timestamp": 1510632270,
                      "longitude": "114.053531",
                      "latitude": "22.533053"
                  },
                  {
                      "timestamp": 1510632870,
                      "longitude": "114.053531",
                      "latitude": "22.533053"
                  }
              ]
          }

          return res;
        }

    }

})();
