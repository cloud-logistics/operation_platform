/**
 * Created by guankai on 23/05/2017.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('RealtimeController', RealtimeController);

    /** @ngInject */
    function RealtimeController(constdata, NetworkService, $stateParams, ApiServer, toastr, $state, $timeout, $interval, $scope) {
        /* jshint validthis: true */
        var vm = this;
        var tempOption;
        var tempChart;

        /* 温度chart初始化 */
        function initTemp() {
            tempChart = echarts.init(document.getElementById('temp-chart'));

            tempOption = {
                title: {
                    "text": '',
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
                            // "value": (100 - value1) * 266 / 360,
                            "name": ''
                        }, {
                            // "value": 100 - (100 - value1) * 266 / 360,
                            "name": ''
                        }
                        ]
                    }

                ]
            };

            tempChart.setOption(tempOption);

            setTimeout(function () {
                var value = parseInt(Math.random() * 55) + 30,
                    value_ = (100 - value) * 266 / 360;
                tempOption.title.text = value + "℃";
                tempOption.series[1].data[0].value = value_;
                tempOption.series[1].data[1].value = 100 - value_;
                tempChart.setOption(tempOption, true);
            }, 1000);

        }

        initTemp();

        var humiChart;
        var humiOption;
        /*初始化湿度chart*/
        function initHumi() {
            humiChart = echarts.init(document.getElementById('humi-chart'));

            humiOption = {
                title: {
                    "text": '',
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
                            // "value": (100 - value1) * 266 / 360,
                            "name": ''
                        }, {
                            // "value": 100 - (100 - value1) * 266 / 360,
                            "name": ''
                        }
                        ]
                    }

                ]
            };

            humiChart.setOption(humiOption);

            setTimeout(function () {
                var value = parseInt(Math.random() * 55) + 30,
                    value_ = (100 - value) * 266 / 360;
                humiOption.title.text = value + "%";
                humiOption.series[1].data[0].value = value_;
                humiOption.series[1].data[1].value = 100 - value_;
                humiChart.setOption(humiOption, true);
            }, 1000);
        }

        initHumi();

        var battChart;
        var battOption;

        function initBatt() {
            battChart = echarts.init(document.getElementById('batt-chart'));
            battOption = {
                series: [{
                    type: 'liquidFill',
                    data: [{
                        value: 0.5,
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

        initBatt();

        var speedChart;
        var speedOption;

        function initSpeed() {
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
                        data: [{value: 40, name: 'km/h'}]
                    }
                ]
            };
            speedChart.setOption(speedOption);

            // setInterval(function () {
            //     speedOption.series[0].data[0].value = (Math.random() * 1000).toFixed(2) - 0;
            //     speedChart.setOption(speedOption, true);
            // }, 2000);
        }

        initSpeed();


        var info = ApiServer.info();
        var roleType = info.role;
        vm.title = '实时报文';
        vm.containerlists = [];

    }

})();