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

        vm.table = [
            {"name":"状态", width:"20%"},
            {"name":"起始地", width:"30%"},
            {"name":"数量", width:"20%"},
            {"name":"目的地", width:"30%"}
        ];

        var setLine = function (oPoint, tPoint, map,color,width) {
            var path = [oPoint, tPoint];
            flightPath = new google.maps.Polyline({
                path: path,
                strokeColor: color || '#FF0000',
                strokeOpacity: 0.02,
                strokeWeight: width
            });
            flightPath.setMap(map);
        };

        var setMarker = function (bounds) {

            markers.push(MapService.addMarker(map, "redBox")({
                "lng": bounds['oPoint'].lng,
                "lat": bounds['oPoint'].lat
            },{draggable: false,notTranslate:true}))
            markers.push(MapService.addMarker(map, "transparent")({
                "lng": bounds['tPoint'].lng,
                "lat": bounds['tPoint'].lat
            },{draggable: false,notTranslate:true}))
        };

        var setText = function(opt){
            var boxText = document.createElement("div");
            boxText.id = opt.id;
            boxText.style.cssText = "padding:2px;border: 1px solid "+ opt.borderColor +";color:" + opt.color +"; background: "+ opt.bgColor +";";
            boxText.innerHTML = opt.text;

            var ib = new InfoBox({
                content: boxText
                ,disableAutoPan: false
                ,maxWidth: 0
                ,pixelOffset: opt.offset ? new google.maps.Size(opt.offset.x,opt.offset.y) : new google.maps.Size(0, 0)
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
            infoList.push(ib);
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
            //setLine(data.oPoint, data.tPoint, map);
            setText({
                bgColor:"#FD4C30",
                color:"white",
                borderColor:"black",
                id:"oPlace",
                text :data.oAddress,
                marker:markers[0]
            });
            setText({
                bgColor:"#3737E7",
                color:"white",
                borderColor:"black",
                id:"tPlace",
                text :data.tAddress,
                marker:markers[1]
            });
            setText({
                bgColor:"white",
                color:"#FC1D1F",
                borderColor:"#F9262D",
                id:"transportCount",
                text :data.count,
                offset:{
                   x:0,
                   y:-60
                },
                marker:markers[0]
            });
            drawEllipse(data.oPoint,data.tPoint,5000,"#FD4C30","#3737E7")
        };

        function clearMarker() {
            markers.map(function (marker) {
                marker.setMap(null)
            })
            markers = [];
            if(document.getElementById("oPlace")){
                document.getElementById("oPlace").remove();
            }
            if(document.getElementById("tPlace")){
                document.getElementById("tPlace").remove();
            }
            if(document.getElementById("transportCount")){
                document.getElementById("transportCount").remove();
            }
            infoList = [];
            if (flightPath) {
                flightPath.setPath([]);
            }
        }


        var parseColor = function (hexStr) {
            return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
        };

        // zero-pad 1 digit to 2
        var pad = function (s) {
            return (s.length === 1) ? '0' + s : s;
        };

        var gradientColors = function (start, end, steps, gamma) {
                var i, j, ms, me, output = [], so = [];
                gamma = gamma || 1;
                var normalize = function (channel) {
                    return Math.pow(channel / 255, gamma);
                };
                start = parseColor(start).map(normalize);
                end = parseColor(end).map(normalize);
                for (i = 0; i < steps; i++) {
                    ms = i / (steps - 1);
                    me = 1 - ms;
                    for (j = 0; j < 3; j++) {
                        so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
                    }
                    output.push('#' + so.join(''));
                }
                return output;
            };


        //椭圆的参数方程
        function drawEllipse(a,b,len,sColor,eColor){
            console.log("a = ",a)
            console.log("b = ",b)
            var points = [];
            var thetaMin;
            var lngCenter;
            var latCenter;
            var A = Math.abs(a.lat - b.lat);
            var B = Math.abs(a.lng - b.lng);
            if(a.lng < b.lng && a.lat > b.lat){ //第一象限
                thetaMin  = 0;
                lngCenter = a.lng;
                latCenter = b.lat;
            }else if(a.lng < b.lng && a.lat < b.lat){//第四象限
                thetaMin  = 3*Math.PI/2;
                lngCenter = a.lng;
                latCenter = b.lat;
            }else if(a.lng > b.lng && a.lat > b.lat){//第二象限
                thetaMin  = Math.PI/2;
                lngCenter = a.lng;
                latCenter = b.lat;
            }else if(a.lng > b.lng && a.lat < b.lat){//第三象限
                thetaMin  = Math.PI;
                lngCenter = b.lng;
                latCenter = b.lat;
            }
            var colorArray = gradientColors(sColor,eColor,len);
            for(var s = 0;s <= len;s++){
                points.push({
                    "lng":lngCenter + B*Math.cos(thetaMin +  Math.PI/(2*len)*s),
                    "lat":latCenter + A*Math.sin(thetaMin + Math.PI/(2*len)*s),
                    "color":colorArray[s]
                })
            }
            for(var s = 0;s < len;s++){
                setLine(points[s],points[s+1],map,points[s].color,Math.floor(s/20)*0.1+1);
            }
        };

        //判断查询页码是否在1-totalPage里面
        var isCPValid = function(currentPage,totalCount){
            return currentPage >= 1 && currentPage <=  Math.ceil(totalCount/10);
        };
        $scope.queryPageChange = function(e){
            if(e.keyCode == 8){
                return;
            }
            $scope.jumpPageNum = parseInt(($scope.jumpPageNum + "").replace(/[^0-9]/g, ''));
            if ($scope.jumpPageNum !== '' && isCPValid($scope.jumpPageNum,$scope.conf.totalItems)) {

            }else{
                $scope.jumpPageNum =   Math.ceil($scope.conf.totalItems/10);

            }
        };

        $scope.getData = function (flag) {
            if (flag == 1) {
                $scope.conf.currentPage++;
            } else if (flag == -1) {
                $scope.conf.currentPage--;
            }else{
                $scope.conf.currentPage = $scope.jumpPageNum || 1;
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
                    $scope.conf.currentPage = parseInt(res.data.data.offset / res.data.data.limit) + 1;
                    $scope.conf.totalPage = parseInt(res.data.data.count / res.data.data.limit) + 1;
                    $scope.conf.totalItems = res.data.data.count;
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
