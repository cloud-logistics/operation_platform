/**
 * Created by guankai on 13/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('AllHistController', AllHistController);

    /** @ngInject */
    function AllHistController(constdata, NetworkService, MapService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope) {
        /* jshint validthis: true */
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

        var speedLineOption;

        var tempBarOption;

        var humiLineOption;

        var battLineOption;

        var pieChart;
        var pieOption;

        var goodsChart;
        var goodsOption;


        vm.title = '实时报文';
        vm.containerlists = [];
        vm.getAnalysisResult = getAnalysisResult
        vm.containerId = $stateParams.containerId
        vm.realtimeInfo = {}
        vm.speedStatus = ""
        vm.queryParams = {
            location : "中国"
        };

        vm.getAnalysisResult = getAnalysisResult;

        getAnalysisResult()
        // var timer = $interval(function(){
        //     getAnalysisResult();
        // },50000, 500);
        //
        // $scope.$on("$destroy", function(){
        //     $interval.cancel(timer);
        // });

        function getAnalysisResult () {
            var transformations = {
                startTime: R.compose(R.toString, Date.parse),
                endTime: R.compose(R.toString, Date.parse)
            };
            var queryParams = R.evolve(transformations)(vm.queryParams)
            console.log(queryParams)


            ApiServer.getAnalysisResult(queryParams, function (response) {
                var locationName = undefined;
                console.log(response.data)

                vm.analysisResult = response.data

                // initTemp(vm.realtimeInfo.temperature.value)
                // initHumi(vm.realtimeInfo.humidity.value)
                // initBatt(vm.realtimeInfo.battery.value);
                // initSpeed(vm.realtimeInfo.speed);

                initRevenueLine(vm.analysisResult.history_revenue);
                initProfitMarginBar(vm.analysisResult.history_profit_margin);
                initOrderLine(vm.analysisResult.history_orders);
                initContainerLine(vm.analysisResult.history_use_of_containers);
                initPie(vm.analysisResult.transportation_category);
                initGoods(vm.analysisResult.goods_category);
                // MapService.geoCodePosition(vm.realtimeInfo.position)
                //     .then(function(results){
                //         if(!R.isNil(results)){
                //             locationName = R.compose(
                //                 R.head,
                //                 R.split(" "),
                //                 R.prop("formatted_address"),
                //                 R.head
                //             )(results)
                //         } else {
                //             locationName = "未找到地名"
                //         }
                //
                //         vm.realtimeInfo.locationName = locationName
                //         console.log(locationName);
                //     })
                //     .catch(function(status){
                //         console.log(status);
                //         // alert(status)
                //     })
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
                            // position: ['38%', '40%'],
                            formatter: function (param) {
                                // param.value is 0.61245
                                return (Math.floor(param.value * 10000) / 100) + '%';
                            },
                            textStyle: {
                                fontSize: 24,
                                color: '#6DB988'
                            }
                            //shadowBlur: 0
                            // textStyle {
                            //     fontSize: 10,
                            //     color: '#fff'
                            // }
                        }

                    },
                    outline: {
                        borderDistance: 0,
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#86cea0'
                            // shadowBlur: 0,
                            // shadowColor: 'rgba(255, 0, 0, 1)'
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

            // setInterval(function () {
            //     speedOption.series[0].data[0].value = (Math.random() * 1000).toFixed(2) - 0;
            //     speedChart.setOption(speedOption, true);
            // }, 2000);
        }

        /*初始化速度line chart*/
        function initRevenueLine(value) {
            var xData = R.map(R.prop("time"))(value)

            var revenueLineChart = echarts.init(document.getElementById('bd-revenue-chart'));

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
                                // color: {
                                //     type: 'linear',
                                //     x: 0,
                                //     y: 0,
                                //     x2: 0,
                                //     y2: 1,
                                //     colorStops: [{
                                //         offset: 0, color: 'red' // 0% 处的颜色
                                //     }, {
                                //         offset: 1, color: 'blue' // 100% 处的颜色
                                //     }],
                                //     globalCoord: false // 缺省为 false
                                // }
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
                        "data": R.map(R.prop("value"))(value)
                    },
                ]
            }

            revenueLineChart.setOption(speedLineOption);
        }

        /*初始化温度bar chart*/
        function initProfitMarginBar(value) {
            var xData = R.map(R.prop("time"))(value)

            var profitMarginBarChart = echarts.init(document.getElementById('bd-profit-margin-chart'));

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
                        "data": R.map(R.prop("value"))(value)
                    }
                ]
            }

            profitMarginBarChart.setOption(tempBarOption);
        }

        /*初始化湿度line chart*/
        function initOrderLine(value) {
            var xData = R.map(R.prop("time"))(value)

            var orderLineChart = echarts.init(document.getElementById('bd-order-chart'));

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
                        "data": R.map(R.prop("value"))(value)
                    },
                ]
            }

            orderLineChart.setOption(humiLineOption);
        }

        function initContainerLine(value) {
            var xData = R.map(R.prop("time"))(value)

            var containerLineChart = echarts.init(document.getElementById('bd-container-chart'));

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
                        "data": R.map(R.prop("value"))(value)
                    },
                ]
            };

            containerLineChart.setOption(battLineOption);
        }


        function initPie(value) {
            pieChart = echarts.init(document.getElementById('ana-transport-pie'));
            pieOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    padding: [190, 10, 0, 10],
                    itemGap: 15,
                    itemWidth:20,
                    align: 'auto',
                    data: ['航空', '公路', '海运', '其他'],
                    formatter: function (name) {
                        return name;
                    }

                },
                color: ['#ea7e7e', '#f2eda7', '#eebc9b','#ebebeb'],
                series: [
                    {
                        name: '运输方式',
                        type: 'pie',
                        center: ['50%', '40%'],
                        radius: ['50%', '60%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                shadowBlur: 9
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        itemStyle:{
                            normal:{
                                shadowColor: 'rgba(130,35,35,0.50)',
                                shadowBlur: 30
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {value: value.airline * 100, name: '航空'},
                            {value: value.highway * 100, name: '公路'},
                            {value: value.ocean * 100, name: '海运'},
                            {value: value.other * 100, name: '其他'}
                        ]
                    }
                ]
            };
            pieChart.setOption(pieOption);
        }

        function initGoods(value) {
            goodsChart = echarts.init(document.getElementById('ana-goods-pie'));
            goodsOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    padding: [190, 10, 0, 10],
                    itemGap: 15,
                    itemWidth:20,
                    align: 'auto',
                    data: ['航空', '公路', '海运', '其他'],
                    formatter: function (name) {
                        return name;
                    }

                },
                color: ['#7e8dea', '#a6e9e4', '#aed798','#ebebeb'],
                series: [
                    {
                        name: '货品分类',
                        type: 'pie',
                        center: ['50%', '40%'],
                        radius: ['50%', '60%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                shadowBlur: 9
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        itemStyle:{
                            normal:{
                                shadowColor: 'rgba(130,35,35,0.50)',
                                shadowBlur: 30
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {value: value.fish, name: '鱼类'},
                            {value: value.beaf, name: '牛肉'},
                            {value: value.chip, name: '芯片'},
                            {value: value.gold, name: '黄金'}
                        ]
                    }
                ]
            };
            goodsChart.setOption(goodsOption);
        }



    }

})();
