/**
 * Created by guankai on 13/06/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('SiteHistController', SiteHistController);

    /** @ngInject */
    function SiteHistController(constdata, NetworkService, MapService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope) {
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
            location : "上海"
        };

        var mapCenter = {lat: 31.2891, lng: 121.4648};

        var map = MapService.map_init("sitehist_map", mapCenter, "terrain");
        var markers = [];
        vm.containersInfo = {
            availablecontainers: {
                detail: [],
                count: 0
            }
        }

        vm.getAnalysisResult = getAnalysisResult;

        function getContainerInfo() {
            ApiServer.getMyContainers(successHandler("mycontainers", myContainersPostProc), failureHandler);

            ApiServer.getAvailableContainers(successHandler("availablecontainers"), failureHandler);
        }

        function successHandler(key, callback) {
            return function (response) {
                console.log(response.data);
                vm.containersInfo[key].detail = R.prop(key)(response.data)
                vm.containersInfo[key].count = vm.containersInfo[key].detail.length
                if(callback !== undefined) {
                    callback()
                }
            }
        }

        function myContainersPostProc() {
            refreshMarkers(vm.containersInfo.mycontainers.detail);
        }

        function refreshMarkers(containers) {
            console.log(containers);
            markers.map(function (marker){
                marker.setMap(null)
            })
            markers = []

            markers = R.compose(
                R.map(MapService.addMarker(map, "container")),
                R.map(R.prop("position"))
            )(containers)

            function add_listener(i) {
                return function(e) {
                    checkDetail(containers, i)
                }
            }

            for( var i = 0; i < markers.length; i++) {
                markers[i].addListener('click', add_listener(i))
            }
        }

        function failureHandler(err) {
            console.log("Get Container Info Failed", err);
        }

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

                initRevenueLine(vm.analysisResult.history_revenue);
                initProfitMarginBar(vm.analysisResult.history_profit_margin);
                initOrderLine(vm.analysisResult.history_orders);
                initContainerLine(vm.analysisResult.history_use_of_containers);
                initRobotLine(vm.analysisResult.history_use_of_containers);
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
                        "name": "销售额",
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
                        "name": "利润率",
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
                        "name": "订单量",
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
                        "name": "云箱使用量",
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


        function initRobotLine(value) {
            var xData = R.map(R.prop("time"))(value)

            var robotLineChart = echarts.init(document.getElementById('bd-robot-chart'));

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
                        "name": "云箱使用量",
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

            robotLineChart.setOption(battLineOption);
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
