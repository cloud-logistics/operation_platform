/**
 * Created by guankai on 23/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('RealtimeController', RealtimeController);

    /** @ngInject */
    function RealtimeController(MainServer, $stateParams, ApiServer,MapService, toastr, constdata, $scope) {
        /* jshint validthis: true */
        var vm = this;
        var speedChart;
        var speedOption;
        var tempBarChart;
        var tempBarOption;
        var humiLineChart;
        var humiLineOption;

        var currentPositionMarker = undefined;
        vm.title = '实时报文';
        vm.containerlists = [];
        vm.getRealtimeInfo = getRealtimeInfo;
        vm.containerId = $stateParams.containerId || constdata.defaultContainerId;
        vm.realtimeInfo = {};
        vm.speedStatus = "";
        vm.days = 1;
        vm.requiredParam = "temperature";
        var historyStatus = {
            speed: [],
            temperature: [],
            humidity: [],
            battery: [],
            boxStatus: []
        };
        $scope.validationCheck = function () {
            return true;
            var flag = true;
            if (!$scope.btnClicked) {
                return flag;
            }
            if (!vm.containerId) {
                $scope.containerId_class = " areaRequire ";
                flag = false;
                $scope.isContainerIdInvalida = false;
            } else if (!constdata['validation']['id'].test(vm.containerId)) {
                flag = false;
                $scope.isContainerIdInvalida = true;
                $scope.containerId_class = " invalida-area "
            } else {
                $scope.isContainerIdInvalida = false;
                $scope.containerId_class = "";
            }
            return flag;
        };

        getRealtimeInfo(true);

        $scope.changeTimeRange = function (days) {
            console.log("lock2Btn = ",$scope.lock2Btn);
            if(vm.days == days || $scope.lock2Btn){
                return;
            }
            $scope.lock2Btn = true;
            vm.days = days || 1;
            getContainerHistoryStatus(days, vm.requiredParam);
        };

        $scope.changeRequiredParam = function (requiredParam) {
            vm.requiredParam = requiredParam;
            getContainerHistoryStatus(vm.days, requiredParam);
        };

        function getContainerHistoryStatus(days, requiredParam) {
            var queryParams = {
                requiredParam: requiredParam,
                containerId: vm.containerId,
                days: vm.days
            }
            ApiServer.getContainerHistoryStatus(queryParams, function (response) {
                if (requiredParam == "temperature") {
                    initTempBar(days, response.data.temperature);
                } else if (requiredParam == "humidity") {
                    initHumiLine(days, response.data.humidity);
                }
                setTimeout(function(){
                    $scope.lock2Btn = false;
                },10);
            }, function (err) {
                console.log("Get ContainerHisfotyStatus Info Failed", err);
                $scope.lock2Btn = false;
            })

            return status;
        }

        function getRealtimeInfo(isNotFromClick) {
            if (!isNotFromClick) {
                $scope.btnClicked = true;
            }
            if (!$scope.validationCheck()) {
                console.log("校验失败.");
                return;
            }
            getContainerHistoryStatus(vm.days, vm.requiredParam);

            console.log("vm ====",vm)
            var queryParams = {
                containerId: vm.containerId
            };
            ApiServer.getRealtimeInfo(queryParams, function (response) {
                var locationName = undefined;
                if (response.data && response.data['locationName']) {
                    response.data['locationName4Hover'] = response.data['locationName'];
                    response.data['locationName'] = response.data['locationName'].split(' ')[0];
                }
                vm.realtimeInfo = response.data
                //vm.realtimeInfo.locationName = "中国广东省深圳市龙岗区一号路";

                vm.speedStatus = "正常";
                console.log(vm.realtimeInfo);

                initTemp(vm.realtimeInfo.temperature);
                initHumi(vm.realtimeInfo.humidity);
                initSpeed(Math.round(vm.realtimeInfo.speed * 100) / 100);

            }, function (err) {
                console.log("Get RealtimeInfo Info Failed", err);
            });
            getInstantlocationInfo(true);
        }


        var tempHumiOption = function(normal,value,value_min,value_max){
            var valueMin = value_min || 0;
            var valueMax = value_max || 100;
            //将[-40,100]映射到[0,100]区间
            var value_ = (100 - ((value - valueMin)/(valueMax - valueMin)*100) ) * 266 / 360;
            if(normal){
                var color1 = "#968CEA";
                var color2 = "#9BE7F1";
            }else{
                var color1 = "#D56FB1";
                var color2 = "#F1C89B";
            }
            return {
                title: {
                    "text": value + (value_max ? "℃": "%"),
                    "x": '48%',
                    "y": '50%',
                    textAlign: "center",
                    "textStyle": {
                        "fontWeight": 'lighter',
                        "fontSize": 24,
                        "color": '#F3B247'
                    },
                    "subtextStyle": {
                        "fontWeight": 'lighter',
                        "fontSize": 32,
                        "color": '#3ea1ff'
                    }
                },
                series: [
                    {
                        "name": ' ',
                        "type": 'pie',
                        "radius": ['85%', '100%'],
                        "avoidLabelOverlap": false,
                        "startAngle": 225,
                        "color": [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0, color: color1
                        }, {
                            offset: 1, color: color2
                        }], false), "transparent"],
                        "hoverAnimation": false,
                        "legendHoverLink": false,
                        "label": {
                            "normal": {
                                "show": false,
                                "position": 'center'
                            },
                            "emphasis": {
                                "show": true,
                                "textStyle": {
                                    "fontSize": '30',
                                    "fontWeight": 'bold'
                                }
                            }
                        },
                        "labelLine": {
                            "normal": {
                                "show": false
                            }
                        },
                        "data": [{
                            "value": 75,
                            "name": '1'
                        }, {
                            "value": 25,
                            "name": '2'
                        }]
                    },
                    {
                        "name": '',
                        "type": 'pie',
                        "radius": ['86%', '99%'],
                        "avoidLabelOverlap": false,
                        "startAngle": 316,
                        "color": ["#fff", "transparent"],
                        "hoverAnimation": false,
                        "legendHoverLink": false,
                        "clockwise": false,
                        "itemStyle": {
                            "normal": {
                                "borderColor": "transparent",
                                "borderWidth": "20"
                            },
                            "emphasis": {
                                "borderColor": "transparent",
                                "borderWidth": "20"
                            }
                        }
                        ,
                        "z": 10,
                        "label": {
                            "normal": {
                                "show": false,
                                "position": 'center'
                            },
                            "emphasis": {
                                "show": true,
                                "textStyle": {
                                    "fontSize": '30',
                                    "fontWeight": 'bold'
                                }
                            }
                        },
                        "labelLine": {
                            "normal": {
                                "show": false
                            }
                        },
                        "data": [{
                            "value": value_,
                            "name": ''
                        }, {
                            "value": 100 - value_,
                            "name": ''
                        }
                        ]
                    }

                ]
            };
        }

        var colorMap = {
            //[0][1]外侧渐变色 [2]表示bottomLine底色 [3]
            high:["#E45E6A","#FFD2A0","#E75E71",""],
            normal:["#34C4B6","#97E7A1","#4CCC74",""],
            lower:["#ED871C","#FFF8B6","#F68365",""]
        };

        /* 温度chart初始化 */
        function initTemp(opt) {
            var canvas = document.getElementById("temp-chart");
            var context = canvas.getContext("2d");
            if(opt.temperature_diff > 0){
                var key = "high";
                var text = "偏高 " + opt.temperature_diff;
            }else if(opt.temperature_diff == 0){
                var key = "normal";
                var text = "正常"
            }else{
                var key = "lower";
                var text = "偏低 " + Math.abs(opt.temperature_diff);
            }
            var dv = new dataV(canvas,context,{
                outerCircleStartColor: colorMap[key][0],
                outerCircleEndColor:colorMap[key][1],
                bottomLineStrokeStyle:colorMap[key][2],
                centerTextFillStyle:colorMap[key][2],
                minThreshold:opt.temperature_threshold_min,
                maxThreshold:opt.temperature_threshold_max,
                bottomText:text,
                minValue: -55,
                maxValue: 85,
                unit: "°",
                value:opt.value
            });
            dv.render();
        }

        /*初始化湿度chart*/
        function initHumi(opt) {
            var canvas = document.getElementById("humi-chart");
            var context = canvas.getContext("2d");
            if(opt.humidity_diff > 0){
                var key = "high";
                var text = "偏高 " + opt.humidity_diff;
            }else if(opt.humidity_diff == 0){
                var key = "normal";
                var text = "正常"
            }else{
                var key = "lower";
                var text = "偏低 " + Math.abs(opt.humidity_diff);
            }
            var dv = new dataV(canvas,context,{
                outerCircleStartColor: colorMap[key][0],
                outerCircleEndColor:colorMap[key][1],
                bottomLineStrokeStyle:colorMap[key][2],
                centerTextFillStyle:colorMap[key][2],
                minThreshold:opt.humidity_threshold_min,
                maxThreshold:opt.humidity_threshold_max,
                bottomText:text,
                minValue:0,
                maxValue:100,
                value:opt.value,
                unit:"%"
            });
            dv.render();
        }

        function initSpeed(value) {
            speedChart = speedChart || echarts.init(document.getElementById('speed-chart'));
            speedOption = {
                tooltip: {
                    formatter: "{a} <br/>{c} {b}"
                },
                toolbox: {
                    show: false,
                    feature: {
                        restore: {show: false},
                        saveAsImage: {show: false}
                    }
                },
                series: [
                    {
                        name: '速度',
                        type: 'gauge',
                        z: 3,
                        min: 0,
                        max: 200,
                        splitNumber: 10,
                        radius: '90%',
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[0.1, '#lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
                                width: 10,
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisLabel: {            // 坐标轴小标记
                            textStyle: {       // 属性lineStyle控制线条样式
                                fontWeight: 'normal',
                                //color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 15,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 20,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        title: {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'normal',
                                fontSize: 20,
                                color: '#000',
                                fontStyle: 'italic'
                            }
                        },
                        detail: {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'normal',
                                fontSize: 20,
                                color: '#000'
                            },
                            offsetCenter: [0, '90%'],
                            detail: {formatter: '{value}km/h'}
                        },
                        data: [{value: value, name: 'km/h'}]
                    }
                ]
            };
            speedChart.setOption(speedOption);
        }

        var intervalMenu = {
            1: 1,
            3: 24,
            7: 24,
        };

        var stringTruncation = function (value, index, type) {
            if (true || index % type == 0) {
                if (vm.days == 1) {
                    var str = value.split("~")[0].substring(11, 16);
                } else {
                    var str = value.split("~")[0].substring(5, 10);
                }
            } else {
                var str = null;
            }
            return str;
        };

        /*初始化温度bar chart*/
        function initTempBar(days, historyStatus) {
            var xData = R.map(R.prop("time"))(historyStatus);
            var tempValues = R.map(R.prop("value"))(historyStatus);

            var dom = $('#bd-temp-chart')[0];
            tempBarChart = tempBarChart || echarts.init(dom);
            //tempValues[1] = undefined;
            tempBarOption = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (item) {
                        var str = item[0].name + "</br>" + "平均温度: " + item[0].value + " °C"
                        return str;
                    }
                },
                toolbox: {
                    show: false,
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: xData,
                        splitLine: {show: false},//去除网格线
                        splitArea: {show: false},//保留网格区域，
                        axisLabel: {
                            formatter: function (value, index) {
                                return stringTruncation(value, index, intervalMenu[vm.days]);
                            },
                            interval: intervalMenu[vm.days]
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} °C'
                        },
                        splitLine: {show: false},//去除网格线
                        splitArea: {show: false}//保留网格区域
                    }
                ],
                series: [
                    {
                        name: '温度',
                        type: 'line',
                        symble: 'none',
                        itemStyle: {
                            normal: {
                                areaStyle: {type: 'default'},
                                color: '#86CFED',
                            }
                        },
                        data: tempValues,
                    }
                ]
            };


            tempBarChart.setOption(tempBarOption);
        }

        /*初始化湿度line chart*/
        function initHumiLine(days, historyStatus) {
            var xData = R.map(R.prop("time"))(historyStatus);

            var humiValues = R.map(R.prop("value"))(historyStatus);

            humiLineChart = humiLineChart || echarts.init(document.getElementById('bd-humi-chart'));

            humiLineOption = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (item) {
                        if (item[0].value == 'NA') {
                            var str = null;
                        } else {
                            var str = item[0].name + "</br>" + "平均湿度: " + item[0].value + " %"
                        }
                        return str;
                    }
                },
                toolbox: {
                    show: false,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: xData,
                        splitLine: {show: false},//去除网格线
                        splitArea: {show: false},//保留网格区域
                        axisLabel: {
                            formatter: function (value, index) {
                                return stringTruncation(value);
                            },
                            interval: intervalMenu[vm.days]
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} %'
                        },
                        splitLine: {show: false},//去除网格线
                        splitArea: {show: false}//保留网格区域
                    }
                ],
                series: [
                    {
                        name: '湿度',
                        type: 'line',
                        data: humiValues,
                        itemStyle: {
                            normal: {
                                areaStyle: {type: 'default'},
                                color: '#86CFED',
                            }
                        }
                    }
                ]
            }

            humiLineChart.setOption(humiLineOption);
        }

        var mapCenter = {lat: 31.2891, lng: 121.4648};

        var map = MapService.map_init("instantlocation", mapCenter, "terrain", 9);

        function clearMarker() {
            if (currentPositionMarker) {
                currentPositionMarker.setMap(null)
            }
        }

        function getInstantlocationInfo(isNotFromClick) {
            ApiServer.getInstantlocationInfo({
                containerId:vm.containerId
            }, function (response) {
                var bounds = new google.maps.LatLngBounds();
                var currentPosition = response.data.currentPosition;
                clearMarker();
                currentPositionMarker = MapService.addMarker(map)(currentPosition,{notTranslate:true});
                map.setCenter(currentPosition);
            },function (err) {
                console.log("Get Historyview Info Failed", err);
            });
        }

        $scope.remoteUrlRequestFn = function(str) {
            return {deviceid: str};
        };
        $scope.remoteUrlResponse = function(data){
            return {
                items:_.map(data.data,function(value,key){
                    return {
                        id:key,
                        name:value,
                        full_name:value
                    }
                })
            }
        }
        $scope.selectedProject = function(data){
            if(data && data.title){
                vm.containerId = data.title;
            }
        };
        $scope.inputChanged = function(newVal){
            console.log("newVal = ",newVal)
            vm.containerId = newVal;
        }
    }

})();
