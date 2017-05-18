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
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        var mapInfo = MapService.map_init("container_overview");

        // 鼠标绘图工具
        var overlays = [];

        drawingManagerInit(mapInfo.map)


        getContainerOverviewInfo();
        var timer = $interval(function(){
            getContainerOverviewInfo();
        },5000, 500);


        function drawingManagerInit (map) {
            var overlaycomplete = function(e){
                overlays.push(e.overlay);
                console.log(e.overlay);
            };
            var styleOptions = {
                strokeColor:"red",    //边线颜色。
                fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 3,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
            }
            //实例化鼠标绘制工具
            var drawingManager = new BMapLib.DrawingManager(map, {
                isOpen: false, //是否开启绘制模式
                enableDrawingTool: true, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                },
                circleOptions: styleOptions, //圆的样式
                // polylineOptions: styleOptions, //线的样式
                // polygonOptions: styleOptions, //多边形的样式
                rectangleOptions: styleOptions //矩形的样式
            });  
            //添加鼠标绘制工具监听事件，用于获取绘制结果
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);
            drawingManager.addEventListener('circlecomplete', function (e) {
                var radius = parseInt(e.getRadius());
                var center = e.getCenter()

                console.log("radius: ", radius);
                console.log("center: ", center);
            });
        }

        function getContainerOverviewInfo() {
            ApiServer.getContainerOverviewInfo(function (response) {
                response.data.map(MapService.addPoint(mapInfo.map, false, "container"))
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

    }

})();
