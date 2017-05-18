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
          getMapPointFromAddress: getMapPointFromAddress,
          getPointFromAddress: getPointFromAddress,
          addMarker: addMarker,
          addMainlandRouteCurve: addMainlandRouteCurve,
          addOceanRouteCurve: addOceanRouteCurve,
          addLine: addLine,
          addPolyline: addPolyline,
          addCurve: addCurve,
          addPoint: addPoint,
          addCircle: addCircle,

        };

        var mapIcons = {
            container: "images/container.png",
            satelite: "images/satelite.png"
        }

        return service;

        ////////////信息

        function map_init(id) {
            // 百度地图API功能
            var map = new BMap.Map(id,{minZoom:3,maxZoom:14});    // 创建Map实例
            // var  mapStyle = constdate.map.mapStyle;
            var  mapStyle = { 
                    features: ["road", "building","water","land"],//隐藏地图上的poi
                    style : "light"  //设置地图风格为高端黑
                }
            map.setMapStyle(mapStyle)
            map.centerAndZoom("上海",3);      // 初始化地图,用城市名设置地图中心点
            map.enableScrollWheelZoom(false);     //开启鼠标滚轮缩放
            // 创建地址解析器实例
            var goe = new BMap.Geocoder();
            //点击地图，获取经纬度坐标
            map.addEventListener("click",function (e) {
                var ll = e.point.lng+","+e.point.lat;
                console.log(ll);
            });



            var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
            map.addControl(top_right_navigation);
            map.addControl(new BMap.OverviewMapControl());
            map.addControl(new BMap.MapTypeControl());

            return {
              map: map,
              geo: goe
            }
        }


        //通过地址获取经纬度
        function getMapPointFromAddress(address,successHandler) {
            if (address.indexOf('-') !== -1){
                var addresses = address.split('-');
                var city = addresses[0];
                var detail = addresses[1];
                getPointFromAddress(city,detail,function (point) {
                    successHandler(point);
                })
            }
        }
        function getPointFromAddress(city,detail,successHandler) {//北京市 北京市海淀区上地10街10号
            myGeo.getPoint(detail, function(point){
                successHandler(point);
            }, city);
        }
        // 编写自定义函数,创建标注
        function addMarker(map){
            return function (point) {
              var marker = new BMap.Marker(point);
              map.addOverlay(marker);
            }
        }
        function addMainlandRouteCurve(map, info1,info2,handler,color) {
            if (color){
                addCurve(info1,info2,handler,color,4);
            }else{
                addCurve(info1,info2,handler,"#27c24c",4);
            }
        }
        function addOceanRouteCurve(map, info1,info2,handler,color) {
            if (color){
                addCurve(map, info1,info2,handler,color,4);
            }else{
                addCurve(map, info1,info2,handler,"#23b7e5",4);
            }
        }
        //向地图中添加线函数
        function addLine(map, color, points) {
            var plPoints;
            if (color){
                plPoints = [{style:"solid",weight:4,color:color,opacity:0.6,points:points}];
            }else{
                plPoints = [{style:"solid",weight:4,color:"#f00",opacity:0.6,points:points}];
            }
            addPolyline(plPoints);
        }
        function addPolyline(map, plPoints){
            for(var i=0;i<plPoints.length;i++){

                var json = plPoints[i];
                var points = [];
                for(var j=0;j<json.points.length;j++){
                    var p1 = json.points[j].latitude;
                    var p2 = json.points[j].longitude;
                    points.push(new BMap.Point(p1,p2));
                }
                var line = new BMap.Polyline(points,{strokeStyle:json.style,strokeWeight:json.weight,strokeColor:json.color,strokeOpacity:json.opacity});
                map.addOverlay(line);
            }
        }
        function addCurve(map, info1,info2,handler,color,weight) {
            var p1 = new BMap.Point(info1.latitude,info1.longitude);
            var p2 = new BMap.Point(info2.latitude,info2.longitude);
            var points = [p1, p2];
            var curve = new BMapLib.CurveLine(points, {strokeColor:color, strokeWeight:weight, strokeOpacity:0.7}); //创建弧线对象
            map.addOverlay(curve); //添加到地图中
            curve.addEventListener("click",function () {
                handler();
            });
        }
        function addPoint(map, jump, type) {
            return function (info) {
                var pt = new BMap.Point(info.latitude, info.longitude);
                var marker;
                var icon = mapIcons[type];

                if (!icon) {
                    icon = "images/container.png"
                }

                var myIcon = new BMap.Icon(icon, new BMap.Size(36,36));
                marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
                // marker = new BMap.Marker(pt);

                map.addOverlay(marker);
                if (jump){
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                }

                var opts = {
                    width : 200,     // 信息窗口宽度
                    height: 70,     // 信息窗口高度
                    title : info.title
                }
                var infoWindow = new BMap.InfoWindow(info.detail, opts);  // 创建信息窗口对象
                marker.addEventListener("click", function(){
                    map.openInfoWindow(infoWindow,pt); //开启信息窗口
                });

                if (info.message){
                    addTip(map, info);
                }
            }
        }
        function addCircle(map) {
            return function (info) {
              var pt = new BMap.Point(info.latitude, info.longitude);
              var circle = new BMap.Circle(pt,500000,{strokeColor:"red", strokeWeight:2, strokeOpacity:0.5}); //创建圆
              map.addOverlay(circle);
            }
        }
        function addTip(map, info) {
            var pt = new BMap.Point(info.latitude, info.longitude);
            var opts = {
                position : pt,    // 指定文本标注所在的地理位置
                offset   : new BMap.Size(20, -20)    //设置文本偏移量
            }
            var label = new BMap.Label(' ' + info.message, opts);  // 创建文本标注对象
            label.setStyle({
                color : "green",
                fontSize : "12px",
                height : "20px",
                border:"none",
                padding:'0',
                lineHeight : "20px",
                fontFamily:"微软雅黑"
            });
            map.addOverlay(label);
        }



    }

})();
