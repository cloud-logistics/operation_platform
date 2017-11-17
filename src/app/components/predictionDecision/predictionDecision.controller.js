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

        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems:0,
            pagesLength: 15,
            pagePreEnabled:false,
            pageNextEnabled:false,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
            }
        };
        
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

        var setHeatmap = function(){
            ApiServer.getDistribution({
                data:"",
                success:function(res){
                    console.log("res = ",res.data);
                    var max = 0;
                    var data = _.map(res.data.sites,function(item){
                        max = item.box_num < max ? max : item.box_num;
                        return{
                           "lng":item.longitude,
                            "lat":item.latitude,
                            count:item.box_num
                        }
                    });
                    heatmap.setData({
                        max:max,
                        data:data
                    });
                    heatmap = new google.maps.visualization.HeatmapLayer({
                        data: histData,
                        map: map
                    });

                    histData.map(function (item) {
                        bounds.extend(item);
                    })

                    map.fitBounds(bounds);
                },
                error:function(err){
                    console.log("获取仓库分布失败.");
                }
            })
        };
        setHeatmap();

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
            console.log("bounds",bounds);
            var remainContainer = [{
                "title": "",
                "detail": "",
                "position":
                {
                    "lng": bounds['oPoint'].lng,
                    "lat": bounds['oPoint'].lat
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

        $scope.getData = function (flag) {
            if(flag == 1){
                $scope.conf.currentPage++;
            }else if(flag == -1){
                $scope.conf.currentPage--;
            }
            ApiServer.getDispatchData({
                data:{
                    limit:$scope.conf.itemsPerPage,
                    offset:($scope.conf.currentPage - 1)*$scope.conf.itemsPerPage
                },
                success:function(res){
                    console.log("res = ",res.data.data);
                    var menu = {
                        "undispatch":"待调度",
                        "dispatch":"进行中"
                    };
                    vm.pDData = _.map(res.data.data.results,function(item){
                        return {
                            oPoint:{
                                lng:item.start.longitude,
                                lat:item.start.latitude
                            },
                            tPoint:{
                                lng:item.finish.longitude,
                                lat:item.finish.latitude
                            },
                            status:menu[item.status],
                            oAddress:item.start.location,
                            count:item.count,
                            tAddress:item.finish.location,
                        }
                    });
                    $scope.conf.currentPage = (res.data.data.offset / res.data.data.limit) + 1;
                    $scope.conf.pagePreEnabled =  $scope.conf.currentPage > 1;
                    $scope.conf.pageNextEnabled = (res.data.data.count  / res.data.data.limit) > $scope.conf.currentPage;

                    console.log(vm.pDData)
                },
                error:function(res){
                    console.log("获取调度信息失败 = ",res);
                }
            })
        };

        $scope.getData();
    };
})();
