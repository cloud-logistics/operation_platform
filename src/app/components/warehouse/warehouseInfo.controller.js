/**
 * Created by xianZJ on 2017/10/31.
 */
(function () {
    'use strict';
    angular.module('smart_container').controller('WarehouseInfoController', WarehouseInfoController);

    /** @ngInject */
    function WarehouseInfoController($scope, ApiServer, MapService, optionsTransFunc) {
        var vm = this;
        var map;
        vm.reports = [];
        var marker;
        vm.siteInfo = {
            "location": "",
            "longitude": "",
            "latitude": "",
            "site_code": "",
            "volume": "",
            "city_id": 0,
            "province_id": 0,
            "nation_id": 0
        };
        var initialMap = function () {
            var width = document.body.clientWidth;
            var height = document.body.clientHeight;
            var mapCenter = {lat: 31.2891, lng: 121.4648};
            vm.mapSize = {"width": '200px', "height": '100px'};
            map = MapService.map_init("warehouseInfo_map", mapCenter, "terrain", 4);
        };
        $scope.showAdd = false;
        $scope.switchShowAdd = function () {
            $scope.showAdd = !$scope.showAdd;
        };
        $scope.basicUpdate = function () {
            vm.options = R.merge(vm.options, {
                title: "录入仓库基础信息",
                is_insert: false
            })

            $scope.bbUpdate = !$scope.bbUpdate;
            // $scope.modalUpdate = !$scope.modalUpdate;
        };

        vm.save = save;
        vm.cancel = cancel;
        $scope.save = save;
        $scope.cancel = cancel;
        vm.options = {};
        var transformations = undefined;

        function clearMarker() {
            if (marker) {
                marker.setMap(null)
            }
        }

        vm.getCountryList = function (callback) {
            ApiServer.getCountryList({
                "countryId": vm.siteInfo.nation_id,
                "success": function (res) {
                    res = res.data;
                    vm.countryList = res.data;
                    if(callback){
                        callback();
                    }
                },
                "error": function (res) {
                    console.log("获取国家列表失败")
                }
            })
        };
        vm.getProvinceList = function (callback) {
            vm.siteInfo.province_id = null;
            vm.siteInfo.city_id = null;
            vm.provinceList = [];
            vm.cityList = [];
            ApiServer.getProvinceList({
                "countryId": vm.siteInfo.nation_id,
                "success": function (res) {
                    res = res.data;
                    console.log("res = ", res)
                    vm.provinceList = res.data;
                    if (callback) {
                        callback();
                    }
                },
                "error": function () {

                }
            })
        };
        vm.getCityList = function (callback) {
            vm.siteInfo.city_id = null;
            vm.cityList = [];
            ApiServer.getCityList({
                "provinceId": vm.siteInfo.province_id,
                "success": function (res) {
                    res = res.data;
                    console.log("res = ", res)
                    vm.cityList = res.data;
                    if(callback){
                        callback();
                    }
                },
                "error": function () {

                }
            })
        };

        vm.getCountryList();
        initialMap();

        vm.setPointer = function () {
            if(!vm.siteInfo.cityObj){
                return;
            }
            clearMarker();
            var point = {
                lng: JSON.parse(vm.siteInfo.cityObj).longitude,
                lat: JSON.parse(vm.siteInfo.cityObj).latitude
            };
            vm.siteInfo.longitude = point.lng;
            vm.siteInfo.latitude = point.lat;
            marker = MapService.addMarker(map)(point, {draggable: true});
            google.maps.event.addListener(marker, 'dragend', function (MouseEvent) {
                console.log("移动后的经纬度", MouseEvent.latLng);
                getAddressByLngLat(MouseEvent.latLng.lng(), MouseEvent.latLng.lat())
            });
        };

        var resetLocation = function (obj) {
            console.log("obj = ", obj);
            return;
            vm.siteInfo.nation_id = obj.nation_id;
            vm.getProvinceList();
        };

        var getAddressByLngLat = function (lng, lat) {
            vm.siteInfo.longitude = lng;
            vm.siteInfo.latitude = lat;
            ApiServer.getAddressByLngLat({
                "param": {
                    "longitude": lng + "",
                    "latitude": lat + ''
                },
                "success": function (res) {
                    console.log("res = ", res);
                    vm.siteInfo.location = res.data.position_name;
                    resetLocation(res.data);
                },
                "error": function (res) {
                    console.log(222)
                }
            })
        };

        vm.edit = function (obj) {
            console.log("obj =", obj);
            vm.getCountryList(function(){
                vm.siteInfo.nation_id = obj.nation;

                vm.getProvinceList(function(){
                    vm.siteInfo.province_id = obj.province;
                    vm.getCityList(function(){
                        vm.siteInfo.province_id = obj.province;
                        vm.siteInfo.nation_id = obj.nation;
                        vm.siteInfo.city_id = obj.city.id;
                        vm.siteInfo.longitude = obj.longitude;
                        vm.siteInfo.latitude = obj.latitude;
                        vm.siteInfo.cityObj = JSON.stringify({
                            longitude:obj.longitude,
                            latitude:obj.latitude
                        });
                        vm.setPointer();
                    })
                });
            });

            vm.siteInfo.location = obj.location;
            vm.siteInfo.site_code = obj.site_code;
            vm.siteInfo.volume = obj.volume;

            console.log(vm.siteInfo)


            $scope.switchShowAdd();

        };

        function save() {
            if (!(vm.siteInfo.site_code)) {
                addSiteInfo();
            } else {
                updateSiteInfo()
            }
            $scope.switchShowAdd();
        }

        function cancel() {
            clearMarker();
            emptyInfo();
            $scope.switchShowAdd();
        }

        var emptyInfo = function () {
            vm.siteInfo = {
                "location": "",
                "longitude": "",
                "latitude": "",
                "site_code": "",
                "volume": "",
                "city_id": 0,
                "province_id": 0,
                "nation_id": 0
            };
        }

        function addSiteInfo() {
            var data = {
                "location": vm.siteInfo.location,
                "longitude": vm.siteInfo.longitude,
                "latitude": vm.siteInfo.latitude,
                "site_code": vm.siteInfo.site_code || "1111",
                "volume": vm.siteInfo.volume,
                "city_id": JSON.parse(vm.siteInfo.cityObj).city_id,
                "province_id": vm.siteInfo.province_id,
                "nation_id": vm.siteInfo.nation_id
            };
            ApiServer.addSiteInfo({
                "param": data,
                "success": function (response) {
                    alert(response.data.msg);
                    console.log(response.data.code);
                    emptyInfo();
                },
                "error": function (err) {
                    console.log("新增仓库失败", err);
                }
            });
        }

        vm.deleteSiteInfo = function (site_code) {
            console.log("del site_code :", site_code);
            ApiServer.deleteSiteInfo({
                "param": site_code || "1111",
                "site_code":site_code,
                "success": function (res) {
                    alert(response.data.msg);
                },
                "error": function (res) {
                    console.log("删除仓库失败", res);
                }
            })
        }

        function updateSiteInfo() {
            var data = {
                "location": vm.siteInfo.location,
                "longitude": vm.siteInfo.longitude,
                "latitude": vm.siteInfo.latitude,
                "site_code": vm.siteInfo.site_code || "1111",
                "volume": vm.siteInfo.volume,
                "city_id": vm.siteInfo.city_id,
                "province_id": vm.siteInfo.province_id,
                "nation_id": vm.siteInfo.nation_id
            };
            ApiServer.updateSiteInfo({
                "param": data,
                "site_code":vm.siteInfo.site_code,
                "success": function (response) {
                    alert(response.data.msg);
                    console.log(response.data.code);
                    emptyInfo();
                },
                "error": function (err) {
                    console.log("新增仓库失败", err);
                }
            });
        }

        function retrieveSiteInfo() {
            ApiServer.retrieveSiteInfo({
                "param": "1",
                "success": function (res) {
                    vm.siteInfoList = res.data.data.results;
                    console.log("vm.siteInfoList", vm.siteInfoList)
                },
                "error": function (err) {
                    console.log("获取仓库信息失败", err);
                }
            });
        }

        retrieveSiteInfo();
    }
})();