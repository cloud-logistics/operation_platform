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
        };

        /***************自定义叠加层，可作为站点显示在地图上******************/
        function MyMarker(map, options) {
            // Now initialize all properties.
            this.latlng = options.latlng; //设置图标的位置
            this.image_ = options.image;  //设置图标的图片
            this.labelText = options.labelText || '标记';
            this.labelClass = options.labelClass || 'shadow';//设置文字的样式
            this.clickFun = options.clickFun ;//注册点击事件
            //    this.labelOffset = options.labelOffset || new google.maps.Size(8, -33);
            this.map_ = map;

            this.div_ = null;
            // Explicitly call setMap() on this overlay
            this.setMap(map);
        }
        MyMarker.prototype = new google.maps.OverlayView();
        //初始化图标
        MyMarker.prototype.onAdd = function() {
            // Note: an overlay's receipt of onAdd() indicates that
            // the map's panes are now available for attaching
            // the overlay to the map via the DOM.
            // Create the DIV and set some basic attributes.
            var div = document.createElement('DIV'); //创建存放图片和文字的div
            div.style.border = "none";
            div.style.borderWidth = "0px";
            div.style.position = "absolute";
            div.style.cursor = "hand";
            div.onclick = this.clickFun ||function(){};//注册click事件，没有定义就为空函数
            // Create an IMG element and attach it to the DIV.
            var img = document.createElement("img"); //创建图片元素
            img.src = this.image_;
            img.style.width = "100%";
            img.style.height = "100%";
            //初始化文字标签
            var label = document.createElement('div');//创建文字标签
            label.className = this.labelClass;
            label.innerHTML = this.labelText;
            label.style.position = 'absolute';
            label.style.width = '200px';
            //  label.style.fontWeight = "bold";
            label.style.textAlign = 'left';
            label.style.padding = "2px";
            label.style.fontSize = "10px";
            //  label.style.fontFamily = "Courier New";

            div.appendChild(img);
            div.appendChild(label);

            this.div_ = div;
            // We add an overlay to a map via one of the map's panes.
            // We'll add this overlay to the overlayImage pane.
            var panes = this.getPanes();
            panes.overlayLayer.appendChild(div);
        }
        //绘制图标，主要用于控制图标的位置
        MyMarker.prototype.draw = function() {
            // Size and position the overlay. We use a southwest and northeast
            // position of the overlay to peg it to the correct position and size.
            // We need to retrieve the projection from this overlay to do this.
            var overlayProjection = this.getProjection();
            // Retrieve the southwest and northeast coordinates of this overlay
            // in latlngs and convert them to pixels coordinates.
            // We'll use these coordinates to resize the DIV.
            var position = overlayProjection.fromLatLngToDivPixel(this.latlng);   //将地理坐标转换成屏幕坐标
            //  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
            // Resize the image's DIV to fit the indicated dimensions.
            var div = this.div_;
            div.style.left =position.x-5 + 'px';
            div.style.top  =position.y-5 + 'px';
            //控制图标的大小
            div.style.width = '10px';
            div.style.height ='10px';
        }
        MyMarker.prototype.onRemove = function() {
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
        }

        //Note that the visibility property must be a string enclosed in quotes
        MyMarker.prototype.hide = function() {
            if (this.div_) {
                this.div_.style.visibility = "hidden";
            }
        }
        MyMarker.prototype.show = function() {
            if (this.div_) {
                this.div_.style.visibility = "visible";
            }
        }
        //显示或隐藏图标
        MyMarker.prototype.toggle = function() {
            if (this.div_) {
                if (this.div_.style.visibility == "hidden") {
                    this.show();
                } else {
                    this.hide();
                }
            }
        }

        var setText = function(bounds){
            overlay = new MyMarker(map,{
                latlng:new google.maps.LatLng(0, -180),
                image:"images/a0.jpg",
                clickFun:function(){
                    alert(2);
                }
            });
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
            setText(_.clone(data));
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
