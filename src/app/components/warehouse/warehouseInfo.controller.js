/**
 * Created by xianZJ on 2017/10/31.
 */
(function () {
    'use strict';
    angular.module('smart_container').controller('WarehouseInfoController', WarehouseInfoController);

    /** @ngInject */
    function WarehouseInfoController($scope, ApiServer,toastr, MapService, optionsTransFunc) {
        var vm = this;
        var map;
        vm.reports = [];
        var marker;
        $scope.cityDataBack;
        vm.siteInfo = {
            "location": "",
            "longitude": "",
            "latitude": "",
            "site_code": "",
            "volume": "",
            "city":{},
            "nation":{},
            province:{}
        };
        var initialMap = function () {
            var width = document.body.clientWidth;
            var height = document.body.clientHeight;
            var mapCenter = {lat: 31.2891, lng: 121.4648};
            vm.mapSize = {"width": '200px', "height": '100px'};
            map = MapService.map_init("warehouseInfo_map", mapCenter, "terrain", 3.5);
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

        function clearMarker() {
            if (marker) {
                marker.setMap(null)
            }
        }

        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems:0,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
            }
        };

        vm.getCountryList = function (callback) {
            ApiServer.getCountryList({
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
            vm.siteInfo.province.province_id = 0;
            vm.siteInfo.city.city_id = 0;
            vm.provinceList = [];
            vm.cityList = [];
            ApiServer.getProvinceList({
                "countryId": vm.siteInfo.nation.nation_id,
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
                "provinceId": vm.siteInfo.province.province_id,
                "success": function (res) {
                    res = res.data;
                    console.log("res = ", res)
                    vm.cityList = res.data;
                    $scope.cityDataBack = res.data;
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
            clearMarker();
            var data = _.find($scope.cityDataBack,function(item){
                return item.city_id ==  vm.siteInfo.city.city_id;
            });
            vm.siteInfo.longitude = data.longitude;
            vm.siteInfo.latitude = data.latitude;
            var point = {
                lng: vm.siteInfo.longitude,
                lat: vm.siteInfo.latitude
            };
            marker = MapService.addMarker(map)(point, {draggable: true});
            google.maps.event.addListener(marker, 'dragend', function (MouseEvent) {
                console.log("移动后的经纬度", MouseEvent.latLng);
                getAddressByLngLat(MouseEvent.latLng.lng(), MouseEvent.latLng.lat())
            });
        };

        var resetLocation = function (obj,lng,lat) {
            console.log("obj = ", obj);
            vm.siteInfo.nation_id = obj.nation_id;
            var obj = {
                latitude:lat,
                location:obj.position_name,
                longitude:lng,
                city:{
                    city_id:obj.city_id
                },
                nation:{
                    nation_id:obj.nation_id
                },
                province:{
                   province_id:obj.province_id
                },
                site_code:vm.siteInfo.site_code,
                volume:vm.siteInfo.volume
            };
            vm.edit(obj);
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
                    resetLocation(res.data,lng,lat);
                },
                "error": function (res) {
                    console.log(222)
                }
            })
        };

        vm.edit = function (obj,isNeedSwitchShowAdd) {
            console.log("obj =", obj);
            vm.getCountryList(function(){
                vm.siteInfo.nation.nation_id = obj.nation.nation_id;

                vm.getProvinceList(function(){
                    vm.siteInfo.province.province_id = obj.province.province_id;

                    vm.getCityList(function(){
                        vm.siteInfo = _.clone(obj);
                        vm.siteInfo.city = {
                            "city_id":obj.city.city_id||obj.city.id,
                            "city_name":obj.city.city_name,
                            "longitude":obj.longitude,
                            "latitude":obj.latitude
                        };
                        vm.setPointer();

                    })
                });
            });
            if(isNeedSwitchShowAdd){
                $scope.switchShowAdd();
            }
        };

        function save() {
            if(!vm.siteInfo.location){
                console.log("请输入地点位置.");
                return;
            }
            if(!vm.siteInfo.volume && vm.siteInfo.volume != 0){
                console.log("请输入容量.");
                return;
            }
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
                "city":{},
                "nation":{},
                province:{}
            };
        }

        function addSiteInfo() {
            var data = {
                "location": vm.siteInfo.location,
                "longitude": vm.siteInfo.longitude,
                "latitude": vm.siteInfo.latitude,
                "site_code": vm.siteInfo.site_code || "1111",
                "volume": vm.siteInfo.volume||0,
                "city_id": vm.siteInfo.city.city_id,
                "province_id": vm.siteInfo.province.province_id,
                "nation_id": vm.siteInfo.nation.nation_id
            };
            ApiServer.addSiteInfo({
                "param": data,
                "success": function (response) {
                    toastr.success(response.data.msg);
                    console.log(response.data.code);
                    emptyInfo();
                    retrieveSiteInfo();
                },
                "error": function (err) {
                    console.log("新增仓库失败", err);
                }
            });
        }

        vm.deleteSiteInfo = function (site_id) {
            console.log("del site_code :", site_id);
            if(!site_id){
                console.log("site_id为空")
                return;
            }
            ApiServer.deleteSiteInfo({
                "param": site_id,
                "site_code":site_id,
                "success": function (res) {
                    toastr.success(res.data.msg);
                    retrieveSiteInfo();
                },
                "error": function (res) {
                    toastr.error("删除仓库失败", res);
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
                "city_id": vm.siteInfo.city.city_id,
                "province_id": vm.siteInfo.province.province_id,
                "nation_id": vm.siteInfo.nation.nation_id
            };
            ApiServer.updateSiteInfo({
                "param": data,
                "site_code":vm.siteInfo.id,
                "success": function (response) {
                    toastr.success(response.data.msg);
                    console.log(response.data.code);
                    emptyInfo();
                    retrieveSiteInfo();
                },
                "error": function (err) {
                    console.log("新增仓库失败", err);
                }
            });
        }

        function retrieveSiteInfo() {
            ApiServer.retrieveSiteInfo({
                "limit": $scope.conf.itemsPerPage,
                "offset": ($scope.conf.currentPage - 1)*$scope.conf.itemsPerPage,
                "success": function (res) {
                    vm.siteInfoList = res.data.data.results;
                    $scope.conf.totalItems = res.data.data.count;
                    console.log("vm.siteInfoList", vm.siteInfoList)
                },
                "error": function (err) {
                    console.log("获取仓库信息失败", err);
                }
            });
        }

        retrieveSiteInfo();

        $scope.$watchGroup(['conf.currentPage','conf.itemsPerPage'],retrieveSiteInfo)
    }
})();