/**
 * Created by Otherplayer on 2016/12/12.
 */

(function () {
    'use strict';


    /**
     *
     * facotry是一个单例,它返回一个包含service成员的对象。
     * 注：所有的Angular services都是单例，这意味着每个injector都只有一个实例化的service。
     *
     */
    angular
        .module('smart_container')
        .factory('MapService', MapService);

    /** @ngInject */
    function MapService(constdata,NetworkService,StorageService,iotUtil,$timeout,$state,toastr) {


        var service = {

          map_init: map_init,
          addMarker: addMarker,
          addCircle: addCircle,

        };

        var mapIcons = {
            container: "images/container.png",
            satellite: "images/satellite.png"
        }

        return service;

        ////////////信息

        function map_init(id, mapType, zoomLevel) {
            // Create a map object and specify the DOM element for display.
            var map = new google.maps.Map(document.getElementById(id), {
                center: {lat: 31.2891, lng: 121.4648},
                mapTypeId: mapType,
                scrollwheel: true,
                zoom: zoomLevel | 3
            });

            return {
              map: map,
              geo: null
            }
        }

        // 编写自定义函数,创建标注
        function addMarker(map, type){
            return function (point) {
                var latLng = new google.maps.LatLng(point.latitude, point.longitude)
                var marker = new google.maps.Marker({
                    map: map,
                    position: latLng,
                    icon: mapIcons[type],
                    title: point.title,
                });
                return marker
            }
        }
        
        function addCircle(map) {
            return function (point) {
                var latLng = new google.maps.LatLng(point.latitude, point.longitude)
                var circle = new google.maps.Circle({
                    strokeColor: 'white',
                    strokeOpacity: 0.5,
                    strokeWeight: .5,
                    fillColor: 'red',
                    fillOpacity: 0.2,
                    map: map,
                    center: latLng,
                    radius: 1000000
                });
            }
        }

    }

})();
