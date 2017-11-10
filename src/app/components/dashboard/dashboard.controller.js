/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('DashboardController', DashboardController);

    /** @ngInject */
    function DashboardController($stateParams, ApiServer, MapService, toastr, $state, $timeout, constdata, $interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var mapCenter = {lat: 31.2891, lng: 121.4648}; 
        vm.mapSize = {"width": width + 'px', "height": height + 'px'};

        var map = MapService.map_init("dashboard_map", mapCenter, "terrain");
        var markers = []
        var circles = []
        vm.operationOverview = {};

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


        getOperationOverview();
        function getOperationOverview() {
            ApiServer.getOperationOverview(function (response) {
                vm.operationOverview = response.data;
                setTimeout(function(){
                    initPie(vm.operationOverview.container_location);
                },100)
                //initLine(vm.operationOverview.container_on_lease_history, vm.operationOverview.container_on_transportation_history);
            }, function (err) {
                console.log("Get getOperationOverview  Info Failed", err);
            });
        }

        var pieChart;
        var pieOption;

        function initPie(value) {
            var dom = $('#pie-chart');
            console.log("dom",dom)
            pieChart = echarts.init(dom[0]);

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
                    data: _.keys(value),
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
                        data:_.map(_.keys(value),function(item){return{name:item,value:value[item]}})
                    }
                ]
            };
            pieChart.setOption(pieOption);
        }


        var lineChart;
        var lineOption;

        function initLine(lease_value, transportation_value){
            var xData = R.map(R.prop("time"))(lease_value)

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
                    "data": R.map(R.prop("value"))(transportation_value)
                },

                    {
                        "name": "租赁",
                        "type": "line",
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
                        "data": R.map(R.prop("value"))(lease_value)
                    },
                ]
            }

            lineChart.setOption(lineOption);
        }

        getContainerInfo();
        var timer = $interval(function(){
            getContainerInfo();
        },constdata.refreshInterval, 500);

        $scope.$on("$destroy", function(){
            $interval.cancel(timer);
        });
    }

})();
