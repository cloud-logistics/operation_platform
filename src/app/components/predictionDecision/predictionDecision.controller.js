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
        var infoList = [];
        // Shanghai as center for the map
        var mapCenter = {lat: 31.2891, lng: 121.4648};
        vm.mapSize = {"width": width + 'px', "height": height + 'px'};

        var map = MapService.map_init("prediction-map", mapCenter, "terrain");

        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            pagesLength: 15,
            pagePreEnabled: false,
            pageNextEnabled: false,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
            }
        };

        // 鼠标绘图工具
        var overlay = undefined;

        var heatmap = undefined;
        var flightPath;
        var setHeatmap = function () {
            ApiServer.getDistribution({
                data: "",
                success: function (res) {
                    var bounds = new google.maps.LatLngBounds();

                    var histData = R.map(function (item) {
                        var lng = parseFloat(item.longitude);
                        var lat = parseFloat(item.latitude);
                        var res = {
                            location: new google.maps.LatLng(lat, lng),
                            weight: item.box_num
                        };
                        return res;
                    })(res.data.sites);
                    console.log(histData);

                    heatmap = new google.maps.visualization.HeatmapLayer({
                        data: histData,
                        radius: 20,
                        map: map
                    });

                    histData.map(function (item) {
                        bounds.extend(item.location);
                    })

                    map.fitBounds(bounds);
                },
                error: function (err) {
                    console.log("获取仓库分布失败.");
                }
            })
        };
        setHeatmap();

        var setLine = function (oPoint, tPoint, map) {
            var path = [oPoint, tPoint];
            console.log('path  = ', path);
            flightPath = new google.maps.Polyline({
                path: path,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            flightPath.setMap(map);
        };

        var setMarker = function (bounds) {

            markers.push(MapService.addMarker(map, "redBox")({
                "lng": bounds['oPoint'].lng,
                "lat": bounds['oPoint'].lat
            },{draggable: false,notTranslate:true}))
            markers.push(MapService.addMarker(map, "redBox")({
                "lng": bounds['tPoint'].lng,
                "lat": bounds['tPoint'].lat
            },{draggable: false,notTranslate:true}))
        };

        var setText = function(opt){
            var boxText = document.createElement("div");
            boxText.style.cssText = "border: 1px solid black;color:white; background: "+ opt.color +";";
            boxText.innerHTML = opt.text;

            var ib = new InfoBox({
                content: boxText
                ,disableAutoPan: false
                ,maxWidth: 0
                ,pixelOffset: new google.maps.Size(0, 0)
                ,zIndex: null
                ,boxStyle: {
                    opacity: 1
                    ,width: "auto"
                }
                ,closeBoxMargin: "0px 0px 0px 0px"
                ,closeBoxURL: ""
                ,infoBoxClearance: new google.maps.Size(1, 1)
                ,isHidden: false
                ,pane: "floatPane"
                ,enableEventPropagation: false
            });
            ib.open(map, opt.marker);
        };

        $scope.updateMarker = function (bounds) {
            console.log("bounds", bounds);
            var data = _.clone(bounds);
            for (var s in data.oPoint) {
                data.oPoint[s] = parseFloat(data.oPoint[s]);
            }
            for (var s in bounds.tPoint) {
                data.tPoint[s] = parseFloat(data.tPoint[s]);
            }
            clearMarker();
            setMarker(_.clone(data));
            setLine(data.oPoint, data.tPoint, map);
            setText({
                color:"#FD4C30",
                text :data.oAddress,
                marker:markers[0]
            });
            setText({
                color:"#3737E7",
                text :data.tAddress,
                marker:markers[1]
            });
        };

        function clearMarker() {
            markers.map(function (marker) {
                marker.setMap(null)
            })
            markers = [];
            if (flightPath) {
                flightPath.setPath([]);
            }
        }

        $scope.getData = function (flag) {
            if (flag == 1) {
                $scope.conf.currentPage++;
            } else if (flag == -1) {
                $scope.conf.currentPage--;
            }
            ApiServer.getDispatchData({
                data: {
                    limit: $scope.conf.itemsPerPage,
                    offset: ($scope.conf.currentPage - 1) * $scope.conf.itemsPerPage
                },
                success: function (res) {
                    console.log("res = ", res.data.data);
                    //res.data.data.results = res.data.data.results.concat(res.data.data.results).concat(res.data.data.results)
                    var menu = {
                        "undispatch": "待调度",
                        "dispatching": "调度中",
                        "dispatched": "已完成"
                    };
                    var colorMenu = {
                        "undispatch": "to",
                        "dispatching": "ing",
                        "dispatched": "ed"
                    }
                    vm.pDData = _.map(res.data.data.results, function (item) {
                        return {
                            oPoint: {
                                lng: item.start.longitude,
                                lat: item.start.latitude
                            },
                            tPoint: {
                                lng: item.finish.longitude,
                                lat: item.finish.latitude
                            },
                            status: menu[item.status],
                            table_status_class:"table_status_" + colorMenu[item.status],
                            table_count_class:"table_count_" + colorMenu[item.status],
                            table_bottomLine_class:"table_bottomLine_" + colorMenu[item.status],
                            table_bottomTriangle_class:"table_bottomTriangle_" + colorMenu[item.status],
                            oAddress: item.start.site_code,
                            count: item.count,
                            tAddress: item.finish.site_code,
                        }
                    });
                    $scope.conf.currentPage = (res.data.data.offset / res.data.data.limit) + 1;
                    $scope.conf.pagePreEnabled = $scope.conf.currentPage > 1;
                    $scope.conf.pageNextEnabled = (res.data.data.count / res.data.data.limit) > $scope.conf.currentPage;

                    console.log(vm.pDData)
                },
                error: function (res) {
                    console.log("获取调度信息失败 = ", res);
                }
            })
        };

        $scope.getData();
    };
})();
