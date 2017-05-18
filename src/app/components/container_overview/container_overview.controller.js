/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('ContainerOverviewController', ContainerOverviewController);

    /** @ngInject */
    function ContainerOverviewController($stateParams,ApiServer,MapService,toastr,$state,$timeout,$interval) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var containers = [];
        var markers = [];
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        var mapInfo = MapService.map_init("container_overview", "terrain");

        // 鼠标绘图工具
        var overlay = undefined;

        drawingManagerInit(mapInfo.map)


        getContainerOverviewInfo();
        var timer = $interval(function(){
            getContainerOverviewInfo();
        },5000, 500);


        function drawingManagerInit (map) {
            var styleOptions = {
                    // fillColor: '#ffff00',
                    // fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                    fillOpacity: 0.6,
                    strokeWeight: 3,
                    clickable: false,
                    editable: true,
                    strokeColor:"red",    //边线颜色。
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

            google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
                var radius = circle.getRadius();
                var center = circle.getCenter();
                var bounds = circle.getBounds();

                updateMarker(bounds);
            });

            google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {
                var bounds = rectangle.getBounds();
                updateMarker(bounds)
            });

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
                if(!R.isNil(overlay)) {
                    overlay.setMap(null)
                }
                overlay = event.overlay;
            });
        }

        function updateMarker(bounds) {
            var remainContainer = containers.filter(function (container) {
                return bounds.contains({
                    lat: container.latitude,
                    lng: container.longitude
                })
            })

            markers.map(function (marker){
                marker.setMap(null)
            })
            markers = []

            markers = remainContainer.map(MapService.addMarker(mapInfo.map))

            alert("此区域有" + R.length(remainContainer) + "个智能云箱");
        }

        function getContainerOverviewInfo() {
            ApiServer.getContainerOverviewInfo(function (response) {
                containers = response.data
                // markers = response.data.map(MapService.addMarker(mapInfo.map))
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

    }

})();
