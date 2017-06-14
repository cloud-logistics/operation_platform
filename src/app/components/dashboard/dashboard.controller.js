/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('DashboardController', DashboardController);

    /** @ngInject */
    function DashboardController($stateParams, ApiServer, MapService, toastr, $state, $timeout, $interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var mapCenter = {lat: 31.2891, lng: 121.4648}; 
        vm.mapSize = {"width": width + 'px', "height": height + 'px'};

        var map = MapService.map_init("dashboard_map", mapCenter, "terrain");
        var markers = []
        var circles = []

        function getContainerInfo() {
            ApiServer.getContainerOverviewInfo(function (response) {
                var containers = response.data

                markers = R.compose(
                    R.map(MapService.addMarker(map, "container")),
                    R.map(R.prop("position"))
                )(containers)

            }, function (err) {
                console.log("Get Container Info Failed", err);
            });
        }

        var pieChart;
        var pieOption;

        function initPie() {
            pieChart = echarts.init(document.getElementById('pie-chart'));
            pieOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    padding: [40, 120, 0, 0],
                    itemGap: 20,
                    align: 'left',
                    x: 'right',
                    data: ['中国', '美国', '欧盟', '印度', '日本', '加拿大', '其他'],
                    formatter: function (name) {
                        return name;
                    }

                },
                color: ['#ea7e7e', '#92c1df', '#a7d7a7', '#e9d8a6', '#cbb0ee', '#b3d7f4', '#ebebeb'],
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        center: ['30%', '50%'],
                        radius: ['70%', '85%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                shadowBlur: 9
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '30',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [
                            {value: 335, name: '中国'},
                            {value: 310, name: '美国'},
                            {value: 234, name: '欧盟'},
                            {value: 135, name: '印度'},
                            {value: 130, name: '日本'},
                            {value: 120, name: '加拿大'},
                            {value: 200, name: '其他'}
                        ]
                    }
                ]
            };
            pieChart.setOption(pieOption);
        }

        initPie();

        var lineChart;
        var lineOption;

        function initLine(){
            var xData = function() {
                var data = [];
                for (var i = 1; i < 13; i++) {
                    data.push(i + "月份");
                }
                return data;
            }();

            lineChart = echarts.init(document.getElementById('line-chart'));

            lineOption = {
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

                "series": [{
                    "name": "在运",
                    "type": "bar",
                    "stack": "总量",
                    "barMaxWidth": 10,
                    "barGap": "10%",
                    "label":{
                        "normal":{
                            "show":false
                        }
                    },
                    "itemStyle": {
                        "normal": {

                            "color": "rgba(255,144,128,1)",
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
                        "name": "租赁",
                        "type": "line",
                        "stack": "总量",
                        symbolSize:10,
                        symbol:'circle',
                        "label":{
                            "normal":{
                                "show":false
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

            lineChart.setOption(lineOption);
        }
        initLine();

        getContainerInfo();
        var timer = $interval(function(){
            getContainerInfo();
        },5000, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });
    }

})();
