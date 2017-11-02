/**
 * Created by xianZJ on 2017/10/25.
 */
(function () {
    'use strict';
    angular.module('smart_container').controller('PredictionDecisionController', PredictionDecisionController);

    /** @ngInject */
    function PredictionDecisionController($scope, ApiServer, MapService, $interval) {
        var vm = this;
        /* jshint validthis: true */
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var containers = [];
        var markers = [];
        // Shanghai as center for the map
        var mapCenter = {lat: 31.2891, lng: 121.4648};
        vm.mapSize = {"width": width + 'px', "height": height + 'px'};

        var map = MapService.map_init("map-canvas", mapCenter, "terrain");

        // 鼠标绘图工具
        var overlay = undefined;

        drawingManagerInit(map)

        var heatmap = new HeatmapOverlay(map,
            {
                // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                "radius": 2,
                "maxOpacity": 1,
                // scales the radius based on map zoom
                "scaleRadius": true,
                // if set to false the heatmap uses the global maximum for colorization
                // if activated: uses the data maximum within the current map boundaries
                //   (there will always be a red spot with useLocalExtremas true)
                "useLocalExtrema": true,
                // which field name in your data represents the latitude - default "lat"
                latField: 'lat',
                // which field name in your data represents the longitude - default "lng"
                lngField: 'lng',
                // which field name in your data represents the data value - default "value"
                valueField: 'count'
            }
        );

        var randomIn = function (min, max, intager) {
            min = min || 0;
            max = max || 1;
            intager = intager || 0;
            var temp = min + Math.random() * (max - min);
            return temp.toFixed(intager)
        };

        var dict = {};
        var data = [];
        for (var i = 0; i < 1000; i++) {
            dict = {};
            dict['lat'] = randomIn(-90, 90, 4);
            dict['lng'] = randomIn(-180, 180, 4);
            dict['count'] = randomIn(0, 1000, 0);
            data.push(dict);
        }
        var testData = {
            max: 1000,
            data: data
        };

        setTimeout(function () {
            heatmap.setData(testData);
        }, 100)

        function drawingManagerInit(map) {
            var styleOptions = {
                // fillColor: '#ffff00',
                fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                fillOpacity: 0.6,
                strokeWeight: 3,
                clickable: false,
                editable: true,
                strokeColor: "red",    //边线颜色。
                strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                strokeStyle: 'solid', //边线的样式，solid或dashed。
                zIndex: 1
            }

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.null,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['marker', 'circle', /*'polygon', 'polyline',*/ 'rectangle']
                },
                circleOptions: styleOptions,
                rectangleOptions: styleOptions
            });
            drawingManager.setMap(map);

            google.maps.event.addListener(drawingManager, 'circlecomplete', function (circle) {
                var radius = circle.getRadius();
                var center = circle.getCenter();
                var bounds = circle.getBounds();

                updateMarker(bounds);
            });

            google.maps.event.addListener(drawingManager, 'rectanglecomplete', function (rectangle) {
                var bounds = rectangle.getBounds();
                updateMarker(bounds)
            });

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
                overlay = event.overlay;

                if (!R.isNil(overlay)) {
                    setTimeout(function () {
                        overlay.setMap(null)
                    }, 500)
                }

            });
        }

        $scope.updateMarker = function(bounds) {
            var remainContainer = [{
                "title": "东海",
                "detail": "",
                fillColor:"red",
                "position":
                {
                    "lng": 122.289718, "lat": 30.027183
                }
            }];

            clearMarker();

            markers = R.compose(
                R.map(MapService.addMarker(map, "redBox")),
                R.map(R.prop("position"))
            )(remainContainer)

        };

        function clearMarker() {
            markers.map(function (marker) {
                marker.setMap(null)
            })
            markers = []
        }

        var getData = function () {
            vm.pDData = ApiServer.getPredictionDecisionData()
        };

        getData();
    };
})()