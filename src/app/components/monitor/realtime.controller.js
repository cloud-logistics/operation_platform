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
        var tempOption;
        var tempChart;

        var humiChart;
        var humiOption;
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

            }, function (err) {
                console.log("Get ContainerHisfotyStatus Info Failed", err);
            })

            return status;
        }

        MainServer.setSelect2Fn('deviceId',function(val){
            vm.containerId = val;
            console.log('val = ',val)
        },vm.containerId);

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

                initTemp(vm.realtimeInfo.temperature.value,vm.realtimeInfo.temperature.status=="正常");
                initHumi(vm.realtimeInfo.humidity.value,vm.realtimeInfo.humidity.status == '正常');
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

        /* 温度chart初始化 */
        function initTemp(value,isNormal) {

            tempChart = tempChart || echarts.init(document.getElementById('temp-chart'));

            tempOption =  tempHumiOption(isNormal,value,-40,100);

            tempChart.setOption(tempOption);
        }

        /*初始化湿度chart*/
        function initHumi(value,isNormal) {

            humiChart = humiChart || echarts.init(document.getElementById('humi-chart'));

            humiOption = tempHumiOption(isNormal,value);

            humiChart.setOption(humiOption);
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
            console.log(historyStatus);
            //historyStatus = [
            //    {"value": 'NA', "time": "2017-12-06 10:00~2017-12-06 11:00"},
            //    {"value": "NA", "time": "2017-12-06 11:00~2017-12-06 12:00"},
            //    {"value": "NA", "time": "2017-12-06 12:00~2017-12-06 13:00"}, {"value": "NA", "time": "2017-12-06 13:00~2017-12-06 14:00"}, {"value": "NA", "time": "2017-12-06 14:00~2017-12-06 15:00"}, {"value": "NA", "time": "2017-12-06 15:00~2017-12-06 16:00"}, {"value": "NA", "time": "2017-12-06 16:00~2017-12-06 17:00"}, {"value": "NA", "time": "2017-12-06 17:00~2017-12-06 18:00"},
            //    {"value": "NA", "time": "2017-12-06 18:00~2017-12-06 19:00"}, {"value": "NA", "time": "2017-12-06 19:00~2017-12-06 20:00"}, {"value": "NA", "time": "2017-12-06 20:00~2017-12-06 21:00"}, {"value": "NA", "time": "2017-12-06 21:00~2017-12-06 22:00"}, {"value": "NA", "time": "2017-12-06 22:00~2017-12-06 23:00"}, {"value": "NA", "time": "2017-12-06 23:00~2017-12-07 00:00"}, {"value": "NA", "time": "2017-12-07 00:00~2017-12-07 01:00"}, {"value": "NA", "time": "2017-12-07 01:00~2017-12-07 02:00"}, {"value": "NA", "time": "2017-12-07 02:00~2017-12-07 03:00"}, {"value": "NA", "time": "2017-12-07 03:00~2017-12-07 04:00"}, {"value": "NA", "time": "2017-12-07 04:00~2017-12-07 05:00"}, {"value": "NA", "time": "2017-12-07 05:00~2017-12-07 06:00"}, {"value": "NA", "time": "2017-12-07 06:00~2017-12-07 07:00"}, {"value": "NA", "time": "2017-12-07 07:00~2017-12-07 08:00"}, {"value": "NA", "time": "2017-12-07 08:00~2017-12-07 09:00"}, {"value": "NA", "time": "2017-12-07 09:00~2017-12-07 10:00"}, {"value": "NA", "time": "2017-12-07 10:00~2017-12-07 11:00"}, {"value": "8.90", "time": "2017-12-07 11:00~2017-12-07 12:00"}, {"value": "NA", "time": "2017-12-07 12:00~2017-12-07 13:00"}, {"value": "NA", "time": "2017-12-07 13:00~2017-12-07 14:00"}, {"value": "NA", "time": "2017-12-07 14:00~2017-12-07 15:00"}, {"value": "NA", "time": "2017-12-07 15:00~2017-12-07 16:00"}, {"value": "NA", "time": "2017-12-07 16:00~2017-12-07 17:00"}, {"value": "NA", "time": "2017-12-07 17:00~2017-12-07 18:00"}, {"value": "NA", "time": "2017-12-07 18:00~2017-12-07 19:00"}, {"value": "NA", "time": "2017-12-07 19:00~2017-12-07 20:00"}, {"value": "NA", "time": "2017-12-07 20:00~2017-12-07 21:00"}, {"value": "NA", "time": "2017-12-07 21:00~2017-12-07 22:00"}, {"value": "NA", "time": "2017-12-07 22:00~2017-12-07 23:00"}, {"value": "NA", "time": "2017-12-07 23:00~2017-12-08 00:00"}, {"value": "NA", "time": "2017-12-08 00:00~2017-12-08 01:00"}, {"value": "NA", "time": "2017-12-08 01:00~2017-12-08 02:00"}, {"value": "NA", "time": "2017-12-08 02:00~2017-12-08 03:00"}, {"value": "NA", "time": "2017-12-08 03:00~2017-12-08 04:00"}, {"value": "NA", "time": "2017-12-08 04:00~2017-12-08 05:00"}, {"value": "NA", "time": "2017-12-08 05:00~2017-12-08 06:00"}, {"value": "NA", "time": "2017-12-08 06:00~2017-12-08 07:00"}, {"value": "NA", "time": "2017-12-08 07:00~2017-12-08 08:00"}, {"value": "NA", "time": "2017-12-08 08:00~2017-12-08 09:00"}, {"value": "NA", "time": "2017-12-08 09:00~2017-12-08 10:00"}, {"value": "NA", "time": "2017-12-08 10:00~2017-12-08 11:00"}, {"value": "9.00", "time": "2017-12-08 11:00~2017-12-08 12:00"}, {"value": "NA", "time": "2017-12-08 12:00~2017-12-08 13:00"}, {"value": "NA", "time": "2017-12-08 13:00~2017-12-08 14:00"}, {"value": "NA", "time": "2017-12-08 14:00~2017-12-08 15:00"}, {"value": "NA", "time": "2017-12-08 15:00~2017-12-08 16:00"}, {"value": "NA", "time": "2017-12-08 16:00~2017-12-08 17:00"}, {"value": "NA", "time": "2017-12-08 17:00~2017-12-08 18:00"}, {"value": "NA", "time": "2017-12-08 18:00~2017-12-08 19:00"}, {"value": "NA", "time": "2017-12-08 19:00~2017-12-08 20:00"}, {"value": "NA", "time": "2017-12-08 20:00~2017-12-08 21:00"}, {"value": "NA", "time": "2017-12-08 21:00~2017-12-08 22:00"}, {"value": "NA", "time": "2017-12-08 22:00~2017-12-08 23:00"}, {"value": "NA", "time": "2017-12-08 23:00~2017-12-09 00:00"}, {"value": "NA", "time": "2017-12-09 00:00~2017-12-09 01:00"}, {"value": "NA", "time": "2017-12-09 01:00~2017-12-09 02:00"}, {"value": "NA", "time": "2017-12-09 02:00~2017-12-09 03:00"}, {"value": "NA", "time": "2017-12-09 03:00~2017-12-09 04:00"}, {"value": "NA", "time": "2017-12-09 04:00~2017-12-09 05:00"}, {"value": "NA", "time": "2017-12-09 05:00~2017-12-09 06:00"}, {"value": "NA", "time": "2017-12-09 06:00~2017-12-09 07:00"}, {"value": "NA", "time": "2017-12-09 07:00~2017-12-09 08:00"}, {"value": "NA", "time": "2017-12-09 08:00~2017-12-09 09:00"}, {"value": "NA", "time": "2017-12-09 09:00~2017-12-09 10:00"}, {"value": "NA", "time": "2017-12-09 10:00~2017-12-09 11:00"}, {"value": "9.10", "time": "2017-12-09 11:00~2017-12-09 12:00"}, {"value": "NA", "time": "2017-12-09 12:00~2017-12-09 13:00"}, {"value": "NA", "time": "2017-12-09 13:00~2017-12-09 14:00"}, {"value": "NA", "time": "2017-12-09 14:00~2017-12-09 15:00"}, {"value": "NA", "time": "2017-12-09 15:00~2017-12-09 16:00"}, {"value": "NA", "time": "2017-12-09 16:00~2017-12-09 17:00"}, {"value": "NA", "time": "2017-12-09 17:00~2017-12-09 18:00"}, {"value": "NA", "time": "2017-12-09 18:00~2017-12-09 19:00"}, {"value": "NA", "time": "2017-12-09 19:00~2017-12-09 20:00"}, {"value": "NA", "time": "2017-12-09 20:00~2017-12-09 21:00"}, {"value": "NA", "time": "2017-12-09 21:00~2017-12-09 22:00"}, {"value": "NA", "time": "2017-12-09 22:00~2017-12-09 23:00"}, {"value": "NA", "time": "2017-12-09 23:00~2017-12-10 00:00"}, {"value": "NA", "time": "2017-12-10 00:00~2017-12-10 01:00"}, {"value": "NA", "time": "2017-12-10 01:00~2017-12-10 02:00"}, {"value": "NA", "time": "2017-12-10 02:00~2017-12-10 03:00"}, {"value": "NA", "time": "2017-12-10 03:00~2017-12-10 04:00"}, {"value": "NA", "time": "2017-12-10 04:00~2017-12-10 05:00"}, {"value": "NA", "time": "2017-12-10 05:00~2017-12-10 06:00"}, {"value": "NA", "time": "2017-12-10 06:00~2017-12-10 07:00"}, {"value": "NA", "time": "2017-12-10 07:00~2017-12-10 08:00"}, {"value": "NA", "time": "2017-12-10 08:00~2017-12-10 09:00"}, {"value": "NA", "time": "2017-12-10 09:00~2017-12-10 10:00"}, {"value": "NA", "time": "2017-12-10 10:00~2017-12-10 11:00"}, {"value": "30.00", "time": "2017-12-10 11:00~2017-12-10 12:00"}, {"value": "NA", "time": "2017-12-10 12:00~2017-12-10 13:00"}, {"value": "NA", "time": "2017-12-10 13:00~2017-12-10 14:00"}, {"value": "NA", "time": "2017-12-10 14:00~2017-12-10 15:00"}, {"value": "NA", "time": "2017-12-10 15:00~2017-12-10 16:00"}, {"value": "NA", "time": "2017-12-10 16:00~2017-12-10 17:00"}, {"value": "NA", "time": "2017-12-10 17:00~2017-12-10 18:00"}, {"value": "NA", "time": "2017-12-10 18:00~2017-12-10 19:00"}, {"value": "NA", "time": "2017-12-10 19:00~2017-12-10 20:00"}, {"value": "NA", "time": "2017-12-10 20:00~2017-12-10 21:00"}, {"value": "NA", "time": "2017-12-10 21:00~2017-12-10 22:00"}, {"value": "NA", "time": "2017-12-10 22:00~2017-12-10 23:00"}, {"value": "NA", "time": "2017-12-10 23:00~2017-12-11 00:00"}, {"value": "NA", "time": "2017-12-11 00:00~2017-12-11 01:00"}, {"value": "NA", "time": "2017-12-11 01:00~2017-12-11 02:00"}, {"value": "NA", "time": "2017-12-11 02:00~2017-12-11 03:00"}, {"value": "NA", "time": "2017-12-11 03:00~2017-12-11 04:00"}, {"value": "NA", "time": "2017-12-11 04:00~2017-12-11 05:00"}, {"value": "NA", "time": "2017-12-11 05:00~2017-12-11 06:00"}, {"value": "NA", "time": "2017-12-11 06:00~2017-12-11 07:00"}, {"value": "NA", "time": "2017-12-11 07:00~2017-12-11 08:00"}, {"value": "NA", "time": "2017-12-11 08:00~2017-12-11 09:00"}, {"value": "NA", "time": "2017-12-11 09:00~2017-12-11 10:00"}, {"value": "NA", "time": "2017-12-11 10:00~2017-12-11 11:00"}, {"value": "29.90", "time": "2017-12-11 11:00~2017-12-11 12:00"}, {"value": "NA", "time": "2017-12-11 12:00~2017-12-11 13:00"}, {"value": "NA", "time": "2017-12-11 13:00~2017-12-11 14:00"}, {"value": "NA", "time": "2017-12-11 14:00~2017-12-11 15:00"}, {"value": "NA", "time": "2017-12-11 15:00~2017-12-11 16:00"}, {"value": "NA", "time": "2017-12-11 16:00~2017-12-11 17:00"}, {"value": "NA", "time": "2017-12-11 17:00~2017-12-11 18:00"}, {"value": "NA", "time": "2017-12-11 18:00~2017-12-11 19:00"}, {"value": "NA", "time": "2017-12-11 19:00~2017-12-11 20:00"}, {"value": "NA", "time": "2017-12-11 20:00~2017-12-11 21:00"}, {"value": "NA", "time": "2017-12-11 21:00~2017-12-11 22:00"}, {"value": "NA", "time": "2017-12-11 22:00~2017-12-11 23:00"}, {"value": "NA", "time": "2017-12-11 23:00~2017-12-12 00:00"}, {"value": "NA", "time": "2017-12-12 00:00~2017-12-12 01:00"}, {"value": "NA", "time": "2017-12-12 01:00~2017-12-12 02:00"}, {"value": "NA", "time": "2017-12-12 02:00~2017-12-12 03:00"}, {"value": "NA", "time": "2017-12-12 03:00~2017-12-12 04:00"}, {"value": "NA", "time": "2017-12-12 04:00~2017-12-12 05:00"}, {"value": "NA", "time": "2017-12-12 05:00~2017-12-12 06:00"}, {"value": "NA", "time": "2017-12-12 06:00~2017-12-12 07:00"}, {"value": "NA", "time": "2017-12-12 07:00~2017-12-12 08:00"}, {"value": "NA", "time": "2017-12-12 08:00~2017-12-12 09:00"}, {"value": "NA", "time": "2017-12-12 09:00~2017-12-12 10:00"}, {"value": "NA", "time": "2017-12-12 10:00~2017-12-12 11:00"}, {"value": "30.10", "time": "2017-12-12 11:00~2017-12-12 12:00"}, {"value": "NA", "time": "2017-12-12 12:00~2017-12-12 13:00"}, {"value": "NA", "time": "2017-12-12 13:00~2017-12-12 14:00"}, {"value": "NA", "time": "2017-12-12 14:00~2017-12-12 15:00"}, {"value": "NA", "time": "2017-12-12 15:00~2017-12-12 16:00"}, {"value": "NA", "time": "2017-12-12 16:00~2017-12-12 17:00"}, {"value": "NA", "time": "2017-12-12 17:00~2017-12-12 18:00"}, {"value": "NA", "time": "2017-12-12 18:00~2017-12-12 19:00"}, {"value": "NA", "time": "2017-12-12 19:00~2017-12-12 20:00"}, {"value": "NA", "time": "2017-12-12 20:00~2017-12-12 21:00"}, {"value": "NA", "time": "2017-12-12 21:00~2017-12-12 22:00"}, {"value": "NA", "time": "2017-12-12 22:00~2017-12-12 23:00"}, {"value": "NA", "time": "2017-12-12 23:00~2017-12-13 00:00"}, {"value": "NA", "time": "2017-12-13 00:00~2017-12-13 01:00"}, {"value": "NA", "time": "2017-12-13 01:00~2017-12-13 02:00"}, {"value": "NA", "time": "2017-12-13 02:00~2017-12-13 03:00"}, {"value": "NA", "time": "2017-12-13 03:00~2017-12-13 04:00"}, {"value": "NA", "time": "2017-12-13 04:00~2017-12-13 05:00"}, {"value": "NA", "time": "2017-12-13 05:00~2017-12-13 06:00"}, {"value": "NA", "time": "2017-12-13 06:00~2017-12-13 07:00"}, {"value": "NA", "time": "2017-12-13 07:00~2017-12-13 08:00"}, {"value": "NA", "time": "2017-12-13 08:00~2017-12-13 09:00"}, {"value": "NA", "time": "2017-12-13 09:00~2017-12-13 10:00"}]
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

        var map = MapService.map_init("instantlocation", mapCenter, "terrain", 10);

        function getInstantlocationInfo(isNotFromClick) {
            ApiServer.getInstantlocationInfo({
                containerId:vm.containerId
            }, function (response) {
                var bounds = new google.maps.LatLngBounds();
                var currentPosition = response.data.currentPosition;
                currentPositionMarker = MapService.addMarker(map)(currentPosition,{notTranslate:true});
                map.setCenter(currentPosition)
                //bounds.extend(currentPositionMarker.getPosition());
                //map.fitBounds(bounds);
            },function (err) {
                console.log("Get Historyview Info Failed", err);
            });
        }

    }

})();
