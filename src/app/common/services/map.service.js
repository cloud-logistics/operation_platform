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
    function MapService(constdata,NetworkService,$q, StorageService,iotUtil,$timeout,$state,toastr) {


        var service = {

          map_init: map_init,
          addMarker: addMarker,
          addCircle: addCircle,
          geoCodePosition: geoCodePosition

        };

        var mapIcons = {
            container: "images/box.svg",
            satellite: "images/satellite3.svg"
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

            return map
        }

        // 编写自定义函数,创建标注
        function addMarker(map, type){
            return function (position) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: position,
                    icon: mapIcons[type],
                });
                return marker
            }
        }
        
        function addCircle(map) {
            return function (position) {
                var circle = new google.maps.Circle({
                    strokeColor: 'white',
                    strokeOpacity: 0.5,
                    strokeWeight: .5,
                    fillColor: 'red',
                    fillOpacity: 0.2,
                    map: map,
                    center: position,
                    radius: 1000000
                });
            }
        }

        function geoCodePosition(position) {
            return $q(function(resolve, reject) {
                var geocoder = new google.maps.Geocoder;

                geocoder.geocode({"location": position}, function(results, status){
                    if(status == google.maps.GeocoderStatus.OK) {
                        resolve(results)
                    } else {
                        reject(status)
                    }
                })
            })
        }

    }

})();
