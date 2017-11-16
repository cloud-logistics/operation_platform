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
          direction: direction,
          geoCodePosition: geoCodePosition
        };

        var mapIcons = {
            'container': "images/icon_box_blue.svg",
            'satellite': "images/satellite3.svg",
            'warehouse': "images/icon_warehouse.svg",
            'redBox': "images/icon_box_red.svg"
        };

        return service;

        ////////////信息

        function map_init(id, center, mapType, zoomLevel) {
            // Create a map object and specify the DOM element for display.
            var map = new google.maps.Map(document.getElementById(id), {
                center: center,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                //mapTypeControl:false,
                //panControl:false,
                //streetViewControl: false,
                //overviewMapControl:false,
                //scaleControl: false,
                //scrollwheel: false,
                disableDefaultUI:true,
                maxZoom: 17,
                minZoom: 2,
                zoom: zoomLevel | 3
            });

            return map
        }

        // 编写自定义函数,创建标注
        function addMarker(map, type){
            return function (position,opt) {
                var adjusted_position = position_adjustment(position)

                console.log(adjusted_position);

                var marker = new google.maps.Marker({
                    map: map,
                    draggable: opt ? opt.draggable || false : false,
                    position: adjusted_position,
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

        function position_adjustment(position) {
            var lat = position.lat;
            var lng = position.lng;
            var newPosition = [];

            var adjusted_position = {}

            lat = do_convert(lat);
            lng = do_convert(lng);

            // https://github.com/wandergis/coordtransform/blob/master/index.js
            newPosition = coordtransform.wgs84togcj02(lng, lat)
            adjusted_position.lng = newPosition[0] 
            adjusted_position.lat = newPosition[1] 

            return adjusted_position
        }

        function do_convert(value) {
            var int_value = Math.floor(value);
            var decimal_value = value - int_value;
            var retVal = undefined;
            retVal = ( decimal_value * 100 / 60 ) + int_value;
            return retVal;
        }
    }
})();
