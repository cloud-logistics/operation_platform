/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('DashboardController', DashboardController);

    /** @ngInject */
    function DashboardController($stateParams,ApiServer,toastr,$state,$timeout,$interval) {
        /* jshint validthis: true */
        var vm = this;


        var info = ApiServer.info();
        var roleType = info.role;
        vm.title = '物流动态';
        vm.containerlists = [];
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};
        vm.flag = false;
        vm.flag1 = false;
        function inStallMap() {

        }
        inStallMap();

        //创建航线，航线是固定的。。。出于保密原因，先这样

        var donghai = {title:'东海',detail:'latitude:122.289718 \n longitude:30.027183',latitude:122.289718,longitude:30.027183};
        var changsha = {title:'长沙西海宾馆火车站店',detail:'地址：长沙火车站远大路与东二环交汇处(纬一路19号)',latitude:113.026814,longitude:28.205349,message:'起'};
        var manilaInfo = {title:'马尼拉',detail:'地址：菲律宾国家首都大区',latitude:121.025813,longitude:14.731058};
        var weiduoliyaInfo = {title:'黎牙实比',detail:'地址：西港路4号',latitude:123.667378,longitude:13.191784};
        var shanghai = {title:'上海',detail:'芦潮港',latitude:121.557348,longitude:31.179784};
        var manila = {title:'马尼拉',detail:'地址：菲律宾国家首都大区',latitude:121.025813,longitude:14.731058};
        var ningbo = {title:'浙江宁波',detail:'港吉码头',latitude:119.305681,longitude:26.098211};
        var xinjiapo = {title:'新加坡',detail:'地址：马来西亚的巴生港',latitude:103.847353,longitude:1.398561};
        var tianjin = {title:'浙江宁波',detail:'港吉码头',latitude:117.291177,longitude:39.112243};
        var shouer = {title:'首尔',detail:'首尔',latitude:126.60021,longitude:34.727164};
        var changqi = {title:'长崎',detail:'长崎港',latitude:130.022107,longitude:32.77553};
        var xianggang = {title:'香港',detail:'地址：维多利亚港',latitude:114.175321,longitude:22.27729};
        var xianggang1 = {title:'西沙群岛',detail:'latitude:113.459016 \n longitude:16.257474',latitude:113.459016,longitude:16.257474};
        var xianggang2 = {title:'香港',detail:'首尔',latitude:110.589037,longitude:9.035837};
        var beimei = {title:'北美',detail:'',latitude:47.611602,longitude:-19.157715};
        var hangzhou = {title:'南昌',detail:'南昌火车站',latitude:116.034637,longitude:28.608328,message:'起'};
        var guangdao = {title:'广岛',detail:'',latitude:132.583006,longitude:34.343678};
        var haikou = {title:'海口',detail:'',latitude:110.294681,longitude:20.125332};
        var henei = {title:'河内',detail:'',latitude:105.70656,longitude:20.928518};
        var henei1 = {title:'河内',detail:'',latitude:109.264432,longitude:16.399602};
        var henei2 = {title:'河内',detail:'',latitude:109.926735,longitude:10.641485};
        var jilongpo = {title:'吉隆坡',detail:'',latitude:101.870724,longitude:3.096005};
        var maliujia = {title:'马六甲',detail:'',latitude:102.245863,longitude:2.210829,message:'终'};
        var xinshan = {title:'新山',detail:'',latitude:103.570469,longitude:1.683243,message:'终'};
        var hefei = {title:'合肥',detail:'合肥火车站',latitude:117.285653,longitude:31.866508};
        var diaoyudao = {title:'钓鱼岛',detail:'latitude:120.854729 \n longitude:25.754035',latitude:120.854729,longitude:25.754035};

        function getOrderDatas() {

            ApiServer.orderGetByOwner(info.id,function (response) {
                vm.orders = response.data;
                for (var i = 0; i < vm.orders.length; i++){
                    var order = vm.orders[i];
                    if (!vm.flag && order.bookingform.voyage.portofloading === '上海' && order.bookingform.voyage.portofdischarge === '马尼拉'){
                        if (order.state === 'order_goods_loaded' || order.state === 'order_goods_arrived'){
                            vm.flag = true;
                            addPoint(manila,false,'p');
                            addPoint(weiduoliyaInfo,false,'p');
                            addPoint(hefei,false,'p');
                            addOceanRouteCurve(shanghai,manila,function () {
                                gotoOrder();
                            });
                            addMainlandRouteCurve(hefei,shanghai,function () {
                                gotoOrder();
                            });
                            addMainlandRouteCurve(weiduoliyaInfo,manilaInfo,function () {
                                gotoOrder();
                            });

                        }else if (order.state === 'order_goods_shipping' || order.state === 'order_goods_delivered'){
                            vm.flag = true;
                            addPoint(manila,false,'p');
                            addPoint(weiduoliyaInfo,false,'p');
                            addPoint(hefei,false,'p');
                            addPoint(donghai,false,'b');
                            addOceanRouteCurve(shanghai,manila,function () {
                                gotoOrder();
                            });
                            addMainlandRouteCurve(hefei,shanghai,function () {
                                gotoOrder();
                            });
                            addMainlandRouteCurve(weiduoliyaInfo,manilaInfo,function () {
                                gotoOrder();
                            });
                        }
                        else if (order.state === 'order_finished' || order.state === 'order_goods_received'){
                            vm.flag = true;
                            addPoint(manila,false,'p');
                            addPoint(weiduoliyaInfo,false,'p');
                            addPoint(hefei,false,'p');
                            addOceanRouteCurve(shanghai,manila,function () {
                                gotoOrder();
                            },'#f00');
                            addMainlandRouteCurve(hefei,shanghai,function () {
                                gotoOrder();
                            },'#f00');
                            addMainlandRouteCurve(weiduoliyaInfo,manilaInfo,function () {
                                gotoOrder();
                            },'#f00');
                        }
                    }else if (!vm.flag1 && order.bookingform.voyage.portofloading === '上海' && order.bookingform.voyage.portofdischarge === '新加坡'){
                        if (order.state === 'order_goods_loaded' || order.state === 'order_goods_arrived'){
                            vm.flag1 = true;
                            addLine([shanghai,{latitude:120.891524,longitude:25.712374},xinjiapo],'#23b7e5');
                            addLine([xinjiapo,xinshan],'#27c24c');
                            addPoint(xinshan,false,'p');
                            addLine([hefei,shanghai],'#27c24c');
                            addPoint(hefei,false,'p');

                        }else if (order.state === 'order_goods_shipping' || order.state === 'order_goods_delivered'){
                            vm.flag1 = true;
                            addLine([shanghai,{latitude:120.891524,longitude:25.712374},xinjiapo],'#23b7e5');
                            addLine([xinjiapo,xinshan],'#27c24c');
                            addPoint(xinshan,false,'p');
                            addPoint(diaoyudao,false,'b');
                            addLine([hefei,shanghai],'#27c24c');
                            addPoint(hefei,false,'p');
                        }
                        else if (order.state === 'order_finished' || order.state === 'order_goods_received'){
                            vm.flag1 = true;
                            addLine([shanghai,{latitude:120.891524,longitude:25.712374},xinjiapo],'#f00');
                            addLine([xinjiapo,xinshan],'#f00');
                            addPoint(xinshan,false,'p');
                            addLine([hefei,shanghai],'#f00');
                            addPoint(hefei,false,'p');
                        }
                    }
                }

            },function (err) {

            });
        }

        // 百度地图API功能
        var map = new BMap.Map("goodtrack",{minZoom:3,maxZoom:14});    // 创建Map实例
        map.centerAndZoom("上海",5);      // 初始化地图,用城市名设置地图中心点
        map.enableScrollWheelZoom(false);     //开启鼠标滚轮缩放
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        //点击地图，获取经纬度坐标
        map.addEventListener("click",function (e) {
            var ll = e.point.lng+","+e.point.lat;
            console.log(ll);
        });



        var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
        map.addControl(top_right_navigation);

        // 从集团IoT云平台获取集装箱定位信息
        function getOrderLists() {
            ApiServer.containerGetByOwner(info.id,function (response) {
                var results = response.data;
                var containers = [];
                for (var i = 0; i < results.length; i++){
                    containers.push(results[i].containerno);
                }
                ApiServer.containerTrack(containers,function (res) {
                    for (var i = 0; i < res.data.length; i++){
                        var data = res.data[i];
                        var info = {title:'集装箱',detail:data.containerNo + ' ' + '(lat:' + data.geoZone.latitude + ',lon:' + data.geoZone.longitude + ')',latitude:data.geoZone.latitude,longitude:data.geoZone.longitude};
                        addPoint(info,false,'j');
                    }
                },function (err) {
                    var errInfo = '操作失败：' + err.statusText + ' (' + err.status +')';
                    toastr.error(errInfo);
                });
            },function (err) {
                var errInfo = '操作失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            });
        }

        // 航线是固定的，这里先这样
        if (roleType === 'cargoagent'){

            vm.title = '航线';
            addOceanRouteCurve(shanghai,manila);
            addLine([shanghai,changqi],'#23b7e5');
            addLine([shanghai,{latitude:120.891524,longitude:25.712374},xinjiapo],'#23b7e5');
            addOceanRouteCurve(tianjin,shouer);
            addOceanRouteCurve(xianggang,xinjiapo);
            addOceanRouteCurve(xianggang,manila);

            addOceanRouteCurve(haikou,henei);
            addLine([henei,henei1],'#23b7e5');
            addOceanRouteCurve(henei1,henei2);
            addLine([henei2,jilongpo],'#23b7e5');

            addPoint(shanghai,false,'p');
            addPoint(manila,false,'p');
            addPoint(changqi,false,'p');
            addPoint(xinjiapo,false,'p');
            addPoint(tianjin,false,'p');
            addPoint(shouer,false,'p');
            addPoint(xianggang,false,'p');
            addPoint(haikou,false,'p');
            addPoint(henei,false,'p');
            addPoint(jilongpo,false,'p');

        }else if (roleType === 'carrier'){
            vm.title = '物流运输点（上海）';
            map.centerAndZoom("上海",10);
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
                addPoint(s);
            })

        }else if (roleType === 'shipper'){

            vm.title = '集装箱跟踪(航线中国)';
            map.centerAndZoom("上海",5);
            addOceanRouteCurve(shanghai,manila,null,'#27c24c');
            // addOceanRouteCurve(shanghai,changqi,null,'#f05050');
            addLine([shanghai,changqi],'#f05050');
            // addOceanRouteCurve(ningbo,xinjiapo,null,'#f05050');
            addOceanRouteCurve(tianjin,shouer,null,'#f05050');
            addOceanRouteCurve(xianggang,xinjiapo,null,'#f05050');
            addOceanRouteCurve(xianggang,manila,null,'#f05050');
            // addOceanRouteCurve(shanghai,beimei,null,'#999999');
            getOrderLists();

            addLine([shanghai,{latitude:120.891524,longitude:25.712374},xinjiapo],'#23b7e5');

            //
            // addPoint(shanghai,false,'j');
            // addPoint(manila,false,'j');
            // addPoint(changqi,false,'j');
            // addPoint(ningbo,false,'j');
            // addPoint(xinjiapo,false,'j');
            // addPoint(tianjin,false,'j');
            // addPoint(shouer,false,'j');
            // addPoint(xianggang,false,'j');

        }else{


            addPoint(shanghai,false,'p');
            addPoint(xianggang,false,'p');
            addPoint(xianggang1,false,'b');
            addPoint(xinjiapo,false,'p');
            addPoint(changqi,false,'p');
            addPoint(hangzhou,false,'p');
            addPoint(guangdao,false,'p');
            addPoint(changsha,false,'p');
            addPoint(maliujia,false,'p');

            addLine([changsha,xianggang],'#27c24c');
            addLine([xianggang,xianggang1],'#23b7e5');
            addLine([xianggang1,xianggang2],'#23b7e5');
            addLine([xianggang2,xinjiapo],'#23b7e5');
            addLine([maliujia,xinjiapo],'#27c24c');


            addLine([shanghai,hangzhou]);
            addLine([shanghai,changqi]);
            addLine([changqi,guangdao]);

            getOrderDatas();
            var timer = $interval(function(){
                if (vm.flag && vm.flag1){
                    $interval.cancel(timer);
                }else{
                    getOrderDatas();
                }
            },5000, 500);



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
