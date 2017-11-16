/**
 * Created by guankai on 23/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('RealtimeController', RealtimeController);

    /** @ngInject */
    function RealtimeController(NetworkService, MapService, $stateParams, ApiServer, toastr, $state, $timeout, constdata, $interval, $scope) {
        /* jshint validthis: true */
        var vm = this;
        var tempOption;
        var tempChart;

        var humiChart;
        var humiOption;

        var battChart;
        var battOption;

        var speedChart;
        var speedOption;

        var speedLineChart;
        var speedLineOption;

        var tempBarChart;
        var tempBarOption;

        var humiLineChart;
        var humiLineOption;

        var battLineChart;
        var battLineOption;

        var statusLineChart;
        var statusLineOption;


        vm.title = '实时报文';
        vm.containerlists = [];
        vm.getRealtimeInfo = getRealtimeInfo
        vm.containerId = $stateParams.containerId || constdata.defaultContainerId 
        vm.realtimeInfo = {}
        vm.speedStatus = ""
        vm.days = 1;
        vm.requiredParam = "temperature";
        var historyStatus = {
            speed:[],
            temperature: [],
            humidity: [],
            battery: [],
            boxStatus:[]
        }

        getRealtimeInfo()

        $scope.changeTimeRange = function(days){
            vm.days = days || 1;
            getContainerHistoryStatus(days, vm.requiredParam);
        };

        $scope.changeRequiredParam = function(requiredParam){
            vm.requiredParam = requiredParam;
            getContainerHistoryStatus(vm.days, requiredParam);
        };

        function getContainerHistoryStatus (days, requiredParam) {
            var queryParams = {
                requiredParam: requiredParam,
                containerId : vm.containerId,
                days:vm.days
            }
            ApiServer.getContainerHistoryStatus(queryParams, function(response){
                console.log(historyStatus);
                console.log(requiredParam);
                console.log(days);

                if (requiredParam == "temperature") {
                    initTempBar(days, response.data.temperature);
                } else if( requiredParam == "humidity" ) {
                    initHumiLine(days, response.data.humidity);
                }

                //initSpeedLine();
                //initBattLine();
                //initStatusLine();
            }, function (err) {
                console.log("Get ContainerHisfotyStatus Info Failed", err);
            })

            return status;
        }

        function getRealtimeInfo () {
            if(!vm.containerId){
                toastr.info("请输入云箱ID...");
                return;
            }
            getContainerHistoryStatus(vm.days, vm.requiredParam);

            var queryParams = {
                containerId: vm.containerId
            }
            ApiServer.getRealtimeInfo(queryParams, function (response) {
                var locationName = undefined;

                if(response.data&&response.data['locationName']){
                    response.data['locationName4Hover'] = response.data['locationName'];
                    response.data['locationName'] = response.data['locationName'].split(' ')[0];
                }
                vm.realtimeInfo = response.data
                //vm.realtimeInfo.locationName = "中国广东省深圳市龙岗区一号路";

                vm.speedStatus = "正常"
                console.log(vm.realtimeInfo);

                initTemp(vm.realtimeInfo.temperature.value)
                initHumi(vm.realtimeInfo.humidity.value)
                initBatt(vm.realtimeInfo.battery.value);
                initSpeed(vm.realtimeInfo.speed);
            },function (err) {
                console.log("Get RealtimeInfo Info Failed", err);
            });
        }

        /* 温度chart初始化 */
        function initTemp(value) {
            var value_ = (100 - value) * 266 / 360;

            tempChart = echarts.init(document.getElementById('temp-chart'));

            tempOption = {
                title: {
                    "text": value + "℃",
                    "x": '48%',
                    "y": '50%',
                    textAlign: "center",
                    "textStyle": {
                        "fontWeight": 'lighter',
                        "fontSize": 24,
                        "color": '#F9694F'
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
                            offset: 0, color: '#D56FB1'
                        }, {
                            offset: 1, color: '#F1C89B'
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

            tempChart.setOption(tempOption);
        }

        /*初始化湿度chart*/
        function initHumi(value) {
            var value_ = (100 - value) * 266 / 360;

            humiChart = echarts.init(document.getElementById('humi-chart'));

            humiOption = {
                title: {
                    "text": value + "%",
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
                            offset: 0, color: '#968CEA'
                        }, {
                            offset: 1, color: '#9BE7F1'
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

            humiChart.setOption(humiOption);
        }


        function initBatt(value) {
            battChart = echarts.init(document.getElementById('batt-chart'));
            battOption = {
                series: [{
                    type: 'liquidFill',
                    data: [{
                        value: value,
                        itemStyle: {
                            normal: {
                                color: '#77CADA',
                                opacity: 0.6
                            },
                            emphasis: {
                                color: '#77CADA',
                                opacity: 0.6
                            }
                        }
                    }, {
                        value: 0.4,
                        itemStyle: {
                            normal: {
                                color: '#B8EDD7',
                                opacity: 0.4
                            },
                            emphasis: {
                                color: '#B8EDD7',
                                opacity: 0.4
                            }
                        }
                    }],
                    radius: '90%',
                    label: {
                        normal: {

                            formatter: function (param) {
                                // param.value is 0.61245
                                return (Math.floor(param.value * 10000) / 100) + '%';
                            },
                            textStyle: {
                                fontSize: 24,
                                color: '#6DB988'
                            }
                        }

                    },
                    outline: {
                        borderDistance: 0,
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#86cea0'
                        }
                    }

                }]
            };
            battChart.setOption(battOption);
        }


        function initSpeed(value) {

            speedChart = echarts.init(document.getElementById('speed-chart'));
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
                        max: 1000,
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
                            detail: {formatter:'{value}km/h'}
                        },
                        data: [{value: value, name: 'km/h'}]
                    }
                ]
            };
            speedChart.setOption(speedOption);
        }

        /*初始化速度line chart*/
        function initSpeedLine() {
            var xData = R.compose(
                            R.map(R.prop("time")),
                            R.prop("speed")
                        )(historyStatus)

            var speedValues =  R.compose(
                                    R.map(R.prop("value")),
                                    R.prop("speed")
                                )(historyStatus)

            speedLineChart = echarts.init(document.getElementById('bd-speed-chart'));

            speedLineOption = {
                backgroundColor: "#fff",

                "tooltip": {
                    "trigger": "axis",
                    "axisPointer": {
                        "type": "shadow",
                        textStyle: {
                            color: "#fff"
                        }

                    },
                },
                "grid": {
                    "borderWidth": 0,
                    "top": 10,
                    "bottom": 25,
                    textStyle: {
                        color: "#fff"
                    }
                },
                "calculable": true,
                "xAxis": [{
                    "type": "category",
                    "axisLine": {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisTick": {
                        "show": false
                    },
                    "splitArea": {
                        "show": false
                    },
                    "axisLabel": {
                        "interval": 0,

                    },
                    "data": xData,
                }],
                "yAxis": [{
                    "type": "value",
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    "axisLabel": {
                        "interval": 0,

                    },
                    "splitArea": {
                        "show": false
                    },

                }],

                "series": [
                    {
                        "name": "速度",
                        "type": "line",
                        "stack": "总量",
                        symbolSize: 10,
                        symbol: 'circle',
                        "label": {
                            "normal": {
                                "show": false
                            }
                        },
                        "lineStyle": {
                            "normal": {
                                width: 4
                            }
                        },
                        "itemStyle": {
                            "normal": {
                                "color": "#6ac2df",
                                "barBorderRadius": 0,
                                "label": {
                                    "show": true,
                                    "position": "top",
                                    formatter: function (p) {
                                        return p.value > 0 ? (p.value) : '';
                                    }
                                }
                            }
                        },
                        "data": speedValues
                    },
                ]
            }

            speedLineChart.setOption(speedLineOption);
        }

        /*初始化温度bar chart*/
        function initTempBar(days, historyStatus) {
            var xData = R.compose(
                            R.map(R.prop("time")),
                        )(historyStatus)

            var tempValues =  R.compose(
                                    R.map(R.prop("value")),
                                )(historyStatus)

            console.log(xData);
            console.log(tempValues);

            var dom = $('#bd-temp-chart')[0];
            tempBarChart = echarts.init(dom);

            tempBarOption = {
                backgroundColor: "#fff",

                "tooltip": {
                    "trigger": "axis",
                    "axisPointer": {
                        "type": "shadow",
                        textStyle: {
                            color: "#fff"
                        }

                    },
                },
                "grid": {
                    "borderWidth": 0,
                    "top": 10,
                    "bottom": 25,
                    textStyle: {
                        color: "#fff"
                    }
                },
                "calculable": true,
                "xAxis": [{
                    "type": "category",
                    "axisLine": {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisTick": {
                        "show": false
                    },
                    "splitArea": {
                        "show": false
                    },
                    "axisLabel": {
                        "interval": 0,

                    },
                    "data": xData,
                }],
                "yAxis": [{
                    "type": "value",
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    "axisLabel": {
                        "interval": 0,

                    },
                    "splitArea": {
                        "show": false
                    },

                }],

                "series": [
                    {
                        "name": "温度",
                        "type": "bar",
                        "stack": "总量",
                        "barMaxWidth": 30,
                        "barGap": "10%",
                        "label": {
                            "normal": {
                                "show": false
                            }
                        },
                        "color": [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0, color: '#D56FB1'
                        }, {
                            offset: 1, color: '#F1C89B'
                        }], false), "transparent"],
                        "itemStyle": {
                            "normal": {
                                // "barBorderRadius":[10,10,0,0],
                                "label": {
                                    "show": true,
                                    "textStyle": {
                                        "color": "#fff"
                                    },
                                    "width": 1,
                                    "position": "insideTop",
                                    // formatter: function(p) {
                                    //     return p.value > 0 ? (p.value) : '';
                                    // }
                                }
                            }
                            // "show":false
                        },
                        "data": tempValues,
                    }
                ]
            }

            tempBarChart.setOption(tempBarOption);
        }

        /*初始化湿度line chart*/
        function initHumiLine(days, historyStatus) {
            var xData = R.compose(
                        R.map(R.prop("time")),
                    )(historyStatus)

            var humiValues =  R.compose(
                        R.map(R.prop("value")),
                    )(historyStatus)

            humiLineChart = echarts.init(document.getElementById('bd-humi-chart'));

            humiLineOption = {
                backgroundColor: "#fff",

                "tooltip": {
                    "trigger": "axis",
                    "axisPointer": {
                        "type": "shadow",
                        textStyle: {
                            color: "#fff"
                        }

                    },
                },
                "grid": {
                    "borderWidth": 0,
                    "top": 10,
                    "bottom": 25,
                    textStyle: {
                        color: "#fff"
                    }
                },
                "calculable": true,
                "xAxis": [{
                    "type": "category",
                    "axisLine": {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisTick": {
                        "show": false
                    },
                    "splitArea": {
                        "show": false
                    },
                    "axisLabel": {
                        "interval": 0,

                    },
                    "data": xData,
                }],
                "yAxis": [{
                    "type": "value",
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    "axisLabel": {
                        "interval": 0,

                    },
                    "splitArea": {
                        "show": false
                    },

                }],

                "series": [
                    {
                        "name": "湿度",
                        "type": "line",
                        "stack": "总量",
                        symbolSize: 10,
                        symbol: 'circle',
                        "label": {
                            "normal": {
                                "show": false
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, color: '#968CEA'
                                }, {
                                    offset: 1, color: '#9BE7F1'
                                }], false)
                            }
                        },
                        "itemStyle": {
                            "normal": {
                                "color": "#6ac2df",
                                "barBorderRadius": 0,
                                "label": {
                                    "show": true,
                                    "position": "top",
                                    formatter: function (p) {
                                        return p.value > 0 ? (p.value) : '';
                                    }
                                }
                            }
                        },
                        "data": humiValues
                    },
                ]
            }

            humiLineChart.setOption(humiLineOption);
        }

        function initBattLine() {
            var xData = R.compose(
                        R.map(R.prop("time")),
                        R.prop("battery")
                    )(historyStatus)

            var batteryValues =  R.compose(
                        R.map(R.prop("value")),
                        R.prop("battery")
                    )(historyStatus)

            battLineChart = echarts.init(document.getElementById('bd-batt-chart'));

            battLineOption = {
                backgroundColor: "#fff",

                "tooltip": {
                    "trigger": "axis",
                    "axisPointer": {
                        "type": "shadow",
                        textStyle: {
                            color: "#fff"
                        }

                    },
                },
                "grid": {
                    "borderWidth": 0,
                    "top": 10,
                    "bottom": 25,
                    textStyle: {
                        color: "#fff"
                    }
                },
                "calculable": true,
                "xAxis": [{
                    "type": "category",
                    "axisLine": {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisTick": {
                        "show": false
                    },
                    "splitArea": {
                        "show": false
                    },
                    "axisLabel": {
                        "interval": 0,

                    },
                    "data": xData,
                }],
                "yAxis": [{
                    "type": "value",
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    "axisLabel": {
                        "interval": 0,

                    },
                    "splitArea": {
                        "show": false
                    },

                }],

                "series": [
                    {
                        "name": "电量",
                        "type": "line",
                        "stack": "总量",
                        symbolSize: 10,
                        symbol: 'circle',
                        "label": {
                            "normal": {
                                "show": false
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0, color: '#968CEA'
                                }, {
                                    offset: 1, color: '#9BE7F1'
                                }], false)
                            }
                        },
                        "itemStyle": {
                            "normal": {
                                "color": "#6ac2df",
                                "barBorderRadius": 0,
                                "label": {
                                    "show": true,
                                    "position": "top",
                                    formatter: function (p) {
                                        return p.value > 0 ? (p.value) : '';
                                    }
                                }
                            }
                        },
                        "data": batteryValues
                    },
                ]
            };

            battLineChart.setOption(battLineOption);
        }

        function initStatusLine(){
            var xData = function() {
                var data = [];
                for (var i = 1; i < 13; i++) {
                    data.push(i + "月份");
                }
                return data;
            }();

            statusLineChart = echarts.init(document.getElementById('bd-status-chart'));

            statusLineOption = {
                backgroundColor: "#fff",
                legend: {
                    orient: 'horizontal',
                    align: 'left',
                    data: ['开门次数','碰撞次数'],
                    formatter: function (name) {
                        return name;
                    }

                },
                "tooltip": {
                    "trigger": "axis",
                    "axisPointer": {
                        "type": "shadow",
                        textStyle: {
                            color: "#fff"
                        }

                    },
                },
                "grid": {
                    "borderWidth": 0,
                    "top": 10,
                    "bottom": 25,
                    textStyle: {
                        color: "#fff"
                    }
                },
                "calculable": true,
                "xAxis": [{
                    "type": "category",
                    "axisLine": {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisTick": {
                        "show": false
                    },
                    "splitArea": {
                        "show": false
                    },
                    "axisLabel": {
                        "interval": 0,

                    },
                    "data": xData,
                }],
                "yAxis": [{
                    "type": "value",
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    "axisLabel": {
                        "interval": 0,

                    },
                    "splitArea": {
                        "show": false
                    },

                }],

                "series": [{
                    "name": "开门次数",
                    "type": "bar",
                    "stack": "总量",
                    "barMaxWidth": 40,
                    "barGap": "10%",
                    "label":{
                        "normal":{
                            "show":false
                        }
                    },
                    "itemStyle": {
                        "normal": {
                            "color": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0, color: '#968CEA'
                            }, {
                                offset: 1, color: '#9BE7F1'
                            }], false),
                            "label": {
                                "show": true,
                                "textStyle": {
                                    "color": "#fff"
                                },
                                "width":1,
                                "position": "insideTop",
                                // formatter: function(p) {
                                //     return p.value > 0 ? (p.value) : '';
                                // }
                            }
                        }
                        // "show":false
                    },
                    "data": [
                        709,
                        1917,
                        2455,
                        2610,
                        1719,
                        1433,
                        1544,
                        3285,
                        5208,
                        3372,
                        2484,
                        4078
                    ],
                },

                    {
                        "name": "碰撞次数",
                        "type": "line",
                        "stack": "总量",
                        symbolSize:10,
                        symbol:'circle',
                        "label":{
                            "normal":{
                                "show":false
                            }
                        },
                        "lineStyle":{
                            "normal":{
                                "type":"dotted",
                                "width":4
                            }
                        },
                        "itemStyle": {
                            "normal": {
                                "color": "#6ac2df",
                                "barBorderRadius": 0,
                                "label": {
                                    "show": true,
                                    "position": "top",
                                    formatter: function(p) {
                                        return p.value > 0 ? (p.value) : '';
                                    }
                                }
                            }
                        },
                        "data": [
                            1036,
                            3693,
                            2962,
                            3810,
                            2519,
                            1915,
                            1748,
                            4675,
                            6209,
                            4323,
                            2865,
                            4298
                        ]
                    },
                ]
            }

            statusLineChart.setOption(statusLineOption);
        }

    }

})();
