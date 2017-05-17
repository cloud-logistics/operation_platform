/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('SateliteController', SateliteController);

    /** @ngInject */
    function SateliteController($stateParams,ApiServer,toastr,$state, constdate, $timeout,$interval) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        var myGeo = null;

        //创建航线，航线是固定的。。。出于保密原因，先这样

        map_init()

        function getSateliteInfo() {

            ApiServer.getSateliteInfo(function (response) {
                console.log(response.data);

                var sh1 = {title:'上海',detail:'虹口区运输点',latitude:121.506683,longitude:31.272362};
                var sh2 = {title:'上海',detail:'昆山区运输点',latitude:120.985235,longitude:31.392286};
                var sh3 = {title:'上海',detail:'嘉定区运输点',latitude:121.270393,longitude:31.383408};
                var sh4 = {title:'上海',detail:'普陀区运输点',latitude:121.401474,longitude:31.256064};
                var sh5 = {title:'上海',detail:'青浦区运输点',latitude:121.130113,longitude:31.158217};
                var sh6 = {title:'上海',detail:'松江区运输点',latitude:121.237048,longitude:31.038487};
                var sh7 = {title:'上海',detail:'闵行区运输点',latitude:121.385376,longitude:31.120632};
                var sh8 = {title:'上海',detail:'浦东新区运输点',latitude:121.547502,longitude:31.227412};
                var sh9 = {title:'上海',detail:'奉贤区运输点',latitude:121.480812,longitude:30.924554};
                var sh10 = {title:'上海',detail:'金山区运输点',latitude:121.346282,longitude:30.748927};
                var sh11 = {title:'上海',detail:'平湖区运输点',latitude:121.021454,longitude:30.683853};
                var sh11 = {title:'上海',detail:'宝山区运输点',latitude:121.504958,longitude:31.398204};


                var shs = [sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8,sh9,sh10,sh11];
                shs.forEach(function (s) {
                    addPoint(s, false, p);
                })
            },function (err) {

            });
        }

        getSateliteInfo();
        var timer = $interval(function(){
            getSateliteInfo();
        },5000, 500);



        function map_init() {
            // 百度地图API功能
            var map = new BMap.Map("sitelite_overview",{minZoom:3,maxZoom:14});    // 创建Map实例
            var  mapStyle = constdate.map.mapStyle;
            map.setMapStyle(mapStyle)
            map.centerAndZoom("上海",3);      // 初始化地图,用城市名设置地图中心点
            map.enableScrollWheelZoom(false);     //开启鼠标滚轮缩放
            // 创建地址解析器实例
            myGeo = new BMap.Geocoder();
            //点击地图，获取经纬度坐标
            map.addEventListener("click",function (e) {
                var ll = e.point.lng+","+e.point.lat;
                console.log(ll);
            });



            var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
            map.addControl(top_right_navigation);
            map.addControl(new BMap.OverviewMapControl());
            map.addControl(new BMap.MapTypeControl()); 
        }

        function gotoOrder() {
            if (roleType === 'cargoagent'){
                $state.go('app.goodorder');
            }else if (roleType === 'carrier'){
                $state.go('app.carorder');
            }else if (roleType === 'shipper'){
                $state.go('app.shiporder');
            }else{
                $state.go('app.userorder');
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
        function addMarker(point){
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
        }
        function addMainlandRouteCurve(info1,info2,handler,color) {
            if (color){
                addCurve(info1,info2,handler,color,4);
            }else{
                addCurve(info1,info2,handler,"#27c24c",4);
            }
        }
        function addOceanRouteCurve(info1,info2,handler,color) {
            if (color){
                addCurve(info1,info2,handler,color,4);
            }else{
                addCurve(info1,info2,handler,"#23b7e5",4);
            }
        }
        //向地图中添加线函数
        function addLine(points,color) {
            var plPoints;
            if (color){
                plPoints = [{style:"solid",weight:4,color:color,opacity:0.6,points:points}];
            }else{
                plPoints = [{style:"solid",weight:4,color:"#f00",opacity:0.6,points:points}];
            }
            addPolyline(plPoints);
        }
        function addPolyline(plPoints){
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
        function addCurve(info1,info2,handler,color,weight) {
            var p1 = new BMap.Point(info1.latitude,info1.longitude);
            var p2 = new BMap.Point(info2.latitude,info2.longitude);
            var points = [p1, p2];
            var curve = new BMapLib.CurveLine(points, {strokeColor:color, strokeWeight:weight, strokeOpacity:0.7}); //创建弧线对象
            map.addOverlay(curve); //添加到地图中
            curve.addEventListener("click",function () {
                handler();
            });
        }
        function addPoint(info,jump,type) {
            var pt = new BMap.Point(info.latitude, info.longitude);
            var marker;
            if (type){
                var icon;
                if (type === 'b'){
                    icon = 'images/icon-boat.png';
                }else if (type === 'j'){
                    icon = 'images/icon-j.png';
                }else if (type === 'p'){
                    icon = 'images/icon-point.png';
                }else{
                    icon = 'images/icon-point.png';
                }
                var myIcon = new BMap.Icon(icon, new BMap.Size(36,36));
                marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
            }else{
                marker = new BMap.Marker(pt);
            }

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
                addTip(info);
            }
        }
        function addTip(info) {
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
