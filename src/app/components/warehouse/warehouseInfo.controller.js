/**
 * Created by xianZJ on 2017/10/31.
 */
var switchStatus = function (isShow) {
    if (isShow) {
        $("#whTable").show();
        $(".infoMask1").show();
    } else {
        $("#whTable").hide();
        $(".infoMask1").hide();
    }
};
var switchRecord = function (isShow) {
    if (isShow) {
        $("#whHistory").show();
        $(".infoMask2").show();
        $("body").scrollTop(0)
    } else {
        $("#whHistory").hide();
        $(".infoMask2").hide();
        var dom = document.getElementById("whTable");
        var scope = angular.element(dom).scope();
        scope['queryParams']={
            start_time: moment(new Date()).subtract(7, 'days'),
            end_time: moment(new Date())
        }
    }
};
(function () {
    'use strict';
    angular.module('smart_container').controller('WarehouseInfoController', WarehouseInfoController);

    /** @ngInject */
    function WarehouseInfoController($scope, ApiServer, toastr, $state, MapService) {
        var vm = this;
        var map;
        var mapCenter = {lat: 31.2891, lng: 121.4648};
        vm.reports = [];
        var marker;
        $scope.cityDataBack;
        vm.siteInfo = {
            "location": "",
            "longitude": "",
            "latitude": "",
            "site_code": "",
            "volume": "",
            "city": {},
            "nation": {},
            province: {}
        };
        vm.siteInfoFilter = {
            province: {},
            city: {},
            volume: {},
            keyword: ""
        };
        $scope.queryParams = {
            start_time: moment(new Date()).subtract(7, 'days'),
            end_time: moment(new Date())
        };
        var initialMap = function () {
            vm.mapSize = {"width": '200px', "height": '100px'};
            map = MapService.map_init("warehouseInfo_map", mapCenter, "terrain", 3.5);

        };
        vm.table = [
            {"name": "仓库名称", width: "17%"},
            {"name": "仓库ID", width: "17%"},
            {"name": "位置", width: "20%"},
            {"name": "容量", width: "8%"},
            {"name": "联系电话", width: "8%"},
            {"name": "", width: "30%"}
        ];
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

        $scope.showStatus = function (id) {
            var dom = document.getElementById("whTable");
            var scope = angular.element(dom).scope();
            scope['getBoxbysite'](id, function () {
                switchRecord(false);
                switchStatus(true);
            })
        };

        $scope.showRecord = function (id) {
            var dom = document.getElementById("whTable");
            var scope = angular.element(dom).scope();
            scope['getSiteStream'](id, function () {
                switchRecord(true);
                switchStatus(false);
            })
        };

        $scope.getBoxbysite = function (id, callback) {
            if (id) {
                localStorage.setItem("siteId", id);
            } else {
                if (localStorage.getItem('siteId')) {
                    id = localStorage.getItem('siteId')
                } else {
                    console.log("仓库ID不能为空。");
                    return;
                }
            }
            ApiServer.getBoxbysite({
                "id": id,
                "limit": $scope.conf.itemsPerPage,
                "offset": ($scope.conf.currentPage - 1) * $scope.conf.itemsPerPage,
                "success": function (response) {
                    vm.whStatusData = response.data.data.results;
                    $scope.conf.totalItems = response.data.data.count;
                    if (callback) {
                        callback()
                    }
                },
                "error": function (err) {
                    console.log("Get Stream Info Failed", err);
                }
            });
        }

        $scope.getSiteStream = function (id, callback,data) {
            $scope.currentId = id;
            var opt = {
                id:id
            };
            var data = {};
            if($scope.queryParams.start_time){
                data['begin_time'] = new Date($scope.queryParams.start_time.format("YYYY-MM-DD")).getTime()/1000;
            }
            if($scope.queryParams.end_time){
                data['end_time'] = new Date($scope.queryParams.end_time.format("YYYY-MM-DD")).getTime()/1000 + 60*60*24 + "";
            }
            opt['data'] = data;
            ApiServer.getSiteStream(opt, function (response) {
                vm.recordList = response.data.siteHistory.reverse();
                if (callback) {
                    callback()
                }
            }, function (err) {
                console.log("Get Stream Info Failed", err);
            });
        };

        vm.filterSiteStream = function(){
            if(!$scope.currentId){
                return;
            }
            var data = {};
            console.log("ss===",$scope.queryParams);
            if($scope.queryParams.start_time){
                data['begin_time'] = new Date($scope.queryParams.start_time.format("YYYY-MM-DD")).getTime()/1000;
            }
            if($scope.queryParams.end_time){
                data['end_time'] = new Date($scope.queryParams.end_time.format("YYYY-MM-DD")).getTime()/1000 + 60*60*24 + "";
            }
            console.log()
            $scope.getSiteStream($scope.currentId,null,data)
        };
        vm.save = save;
        vm.cancel = cancel;
        $scope.save = save;
        $scope.cancel = cancel;
        vm.options = {};

        $scope.tableConfig = {
            col: [{"name": "仓库名称", width: "13%", model: "name"},
                {"name": "仓库ID", width: "12%", model: "site_code"},
                {"name": "位置", width: "24%", model: "location"},
                {"name": "容量", width: "8%", model: "volume"},
                {
                    "name": "操作", width: "15%", model: "", formatter: function (tr, that) {
                    console.log("that", that)
                    return '<a class="bb-edit-btn" ng-click="vm.edit(tr,true)">编辑</a>' +
                        '<a class="bb-del-btn" ng-click="vm.deleteSiteInfo(tr.id)">删除</a>'
                }
                }]
        };

        function clearMarker() {
            if (marker) {
                marker.setMap(null)
            }
        }

        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
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
                    if (callback) {
                        callback();
                    }
                    $scope.validationCheck();
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
                    if (callback) {
                        callback(res);
                    }
                    vm.provinceList = res.data;

                    $scope.validationCheck();
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
                    $scope.cityDataBack = _.clone(res.data);
                    if (callback) {
                        callback();
                    }

                    $scope.validationCheck();
                },
                "error": function () {

                }
            })
        };
        vm.getCountryList();

        vm.getFilterProvinceList = function () {
            vm.filterCityList = [];
            vm.siteInfoFilter.city.city_id = "";
            ApiServer.getProvinceList({
                "countryId": 1,
                "success": function (res) {
                    res = res.data;
                    vm.filterProvinceList = res.data;
                },
            })
        };
        vm.getFilterCityList = function () {
            vm.filterCityList = [];
            vm.siteInfoFilter.city.city_id = "";
            ApiServer.getCityList({
                "provinceId": vm.siteInfoFilter.province.province_id,
                "success": function (res) {
                    res = res.data;
                    vm.filterCityList = res.data;
                }
            })
        };
        vm.getFilterProvinceList();

        vm.filterVolumeList = [
            {
                volume_id: 0,
                volume_name: "1000-2000",
                min_value: 1000,
                max_value: 2000
            }, {
                volume_id: 1,
                volume_name: "2000-3000",
                min_value: 2000,
                max_value: 3000
            }, {
                volume_id: 2,
                volume_name: "3000-5000",
                min_value: 3000,
                max_value: 5000
            }, {
                volume_id: 3,
                volume_name: "5000+",
                min_value: 5000,
                max_value: ""
            }]
        initialMap();

        vm.setPointer = function (point) {
            clearMarker();
            $scope.validationCheck();
            if (!vm.siteInfo.city.city_id) {
                return;
            }
            if (!point) {
                var data = _.find($scope.cityDataBack, function (item) {
                    return item.city_id == vm.siteInfo.city.city_id;
                });
                vm.siteInfo.longitude = data.longitude;
                vm.siteInfo.latitude = data.latitude;
            } else {
                vm.siteInfo.longitude = point.longitude;
                vm.siteInfo.latitude = point.latitude;
            }
            var point = {
                lng: parseFloat(vm.siteInfo.longitude),
                lat: parseFloat(vm.siteInfo.latitude)
            };
            getAddressByLngLat(vm.siteInfo.longitude, vm.siteInfo.latitude, true);
            changeMapState(point.lng, point.lat, 8);
            console.log("point-==", point);
            marker = MapService.addMarker(map)(point, {draggable: true, notTranslate: true});
            google.maps.event.addListener(marker, 'dragend', function (MouseEvent) {
                console.log("移动后的经纬度", MouseEvent.latLng.lng() + " " + MouseEvent.latLng.lat());
                getAddressByLngLat(MouseEvent.latLng.lng(), MouseEvent.latLng.lat());
            });

        };

        var resetLocation = function (obj, lng, lat) {
            console.log("obj = ", obj);
            vm.siteInfo.nation_id = obj.nation_id;
            var obj = {
                latitude: lat,
                id: obj.id,
                location: obj.position_name,
                longitude: lng,
                city: {
                    city_id: obj.city_id
                },
                nation: {
                    nation_id: obj.nation_id
                },
                province: {
                    province_id: obj.province_id
                },
                site_code: vm.siteInfo.site_code,
                volume: vm.siteInfo.volume,
                telephone: vm.siteInfo.telephone,
                name: vm.siteInfo.name
            };
            vm.edit(obj);
        };

        var getAddressByLngLat = function (lng, lat, notNeedResetLocation) {
            vm.siteInfo.longitude = lng;
            vm.siteInfo.latitude = lat;
            ApiServer.getAddressByLngLat({
                "param": {
                    "longitude": lng + "",
                    "latitude": lat + ''
                },
                "success": function (res) {
                    console.log("res = ", res);
                    if (!res.data.position_name) {
                        toastr.info(res.data.msg);
                    } else {
                        vm.siteInfo.location = res.data.position_name;
                        if (!notNeedResetLocation) {
                            resetLocation(_.extend(res.data, {id: vm.siteInfo.id}), lng, lat);
                        }
                    }
                },
                "error": function (res) {
                    console.log(222)
                }
            })
        };

        vm.edit = function (obj, isNeedSwitchShowAdd) {
            console.log("obj =", obj);
            vm.getCountryList(function () {
                vm.siteInfo.nation.nation_id = obj.nation.nation_id;

                vm.getProvinceList(function () {
                    vm.siteInfo.province.province_id = obj.province.province_id;

                    vm.getCityList(function () {
                        vm.siteInfo = _.clone(obj);
                        vm.siteInfo.city = {
                            "city_id": obj.city.city_id || obj.city.id,
                            "city_name": obj.city.city_name,
                            "longitude": obj.longitude,
                            "latitude": obj.latitude
                        };
                        vm.setPointer({
                            "longitude": obj.longitude,
                            "latitude": obj.latitude
                        });
                    })
                });
            });
            if (isNeedSwitchShowAdd) {
                $scope.switchShowAdd();
                $scope.currentId = obj.id;
            }
        };

        var changeMapState = function (lng, lat, zoom) {
            console.log("lng = ", lng)
            console.log("lat = ", lat)
            map.setCenter({
                lat: lat,
                lng: lng
            });
            map.setZoom(zoom)
        };

        $scope.validationCheck = function () {
            if (!$scope.saveBtnClick) {
                return;
            }
            var flag = true;
            var menu1 = [
                'nation.nation_id',
                'province.province_id',
                'city.city_id',
                'name',
                'volume',
                'location',
                'telephone'
            ];
            var menu2 = [
                'nation_class',
                'province_class',
                'city_class',
                'name_class',
                'volume_class',
                'location_class',
                'telephone_class'
            ];
            for (var s = 0, len = menu1.length; s < 3; s++) {
                if (!(vm.siteInfo[menu1[s].split(".")[0]][menu1[s].split(".")[1]])) {
                    $scope[menu2[s]] = " areaRequire ";
                    console.log("s = ", s)
                    flag = false;
                } else {
                    $scope[menu2[s]] = " ";
                }
            }
            for (var s = 3, len = menu1.length; s < len; s++) {
                if (!(vm.siteInfo[menu1[s]])) {
                    $scope[menu2[s]] = " areaRequire ";
                    console.log("s = ", s)
                    flag = false;
                } else {
                    $scope[menu2[s]] = " ";
                }
            }

            if (vm.siteInfo.volume < 1000 || vm.siteInfo.volume > 10000) {
                $scope.volume_invalid_msg = "仓库容量应该为[1000,10000]的整数";
                $scope['volume_invalid_class'] = "invalida-area";
                flag = false;
            } else {
                $scope['volume_invalid_class'] = "";
                $scope.volume_invalid_msg = "";
            }
            if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(vm.siteInfo.telephone)) {
                $scope.telephone_invalid_msg = "请输入合法电话号码";
                $scope['telephone_invalid_class'] = "invalida-area";
                flag = false;
            } else {
                $scope['telephone_invalid_class'] = "";
                $scope.telephone_invalid_msg = "";
            }

            return flag;
        };

        function save() {
            $scope.saveBtnClick = true;
            if (!$scope.validationCheck()) {
                console.log("校验失败.", $scope);
                return;
            }
            if (!(vm.siteInfo.site_code)) {
                addSiteInfo();
            } else {
                updateSiteInfo()
            }
        }

        function cancel() {
            $scope.conf.currentPage = 1;
            clearMarker();
            emptyInfo();
            $scope.switchShowAdd();
            $scope.currentId = null;
        }

        var emptyInfo = function () {
            vm.siteInfo = {
                "location": "",
                "longitude": "",
                "latitude": "",
                "site_code": "",
                "volume": "",
                "telephone": "",
                "city": {},
                "nation": {},
                province: {}
            };
            clearMarker();
            map.setCenter(mapCenter);
            map.setZoom(3);
            $scope.saveBtnClick = false;

            vm.provinceList = [];
            vm.cityList = [];
            var menu2 = [
                'nation_class',
                'province_class',
                'city_class',
                'name_class',
                'volume_class',
                'location_class',
                'volume_invalid_class',
                'telephone_invalid_class',
                'volume_invalid_msg',
                'telephone_invalid_msg'
            ];
            for (var s = 0, len = menu2.length; s < len; s++) {
                $scope[menu2[s]] = "";
            }
        };

        function addSiteInfo() {
            var data = {
                "location": vm.siteInfo.location,
                "longitude": vm.siteInfo.longitude,
                "latitude": vm.siteInfo.latitude,
                "site_code": vm.siteInfo.site_code || "1111",
                "volume": vm.siteInfo.volume || 0,
                "name": vm.siteInfo.name,
                "telephone": vm.siteInfo.telephone,
                "city_id": vm.siteInfo.city.city_id,
                "province_id": vm.siteInfo.province.province_id,
                "nation_id": vm.siteInfo.nation.nation_id
            };
            ApiServer.addSiteInfo({
                "param": data,
                "success": function (response) {
                    toastr.success(response.data.msg);
                    $scope.conf.currentPage = 1;
                    $scope.switchShowAdd();
                    emptyInfo();
                    retrieveSiteInfo();
                },
                "error": function (err) {
                    toastr.error(err.msg);
                }
            });
        }

        vm.deleteSiteInfo = function () {
            if(!$scope.currentId){
                return;
            }
            $("body").scrollTop(0);
            var opt = {
                okFn: function () {
                    if (!$scope.currentId) {
                        console.log("site_id为空")
                        return;
                    }
                    ApiServer.deleteSiteInfo({
                        "param": $scope.currentId,
                        "site_code": $scope.currentId,
                        "success": function (res) {
                            vm.cancel();
                            toastr.success(res.data.msg);
                            retrieveSiteInfo();
                        },
                        "error": function (err) {
                            toastr.error(err.msg || "删除仓库失败.");
                        }
                    })
                }
            };
            $scope.$emit('showDelMsg', opt);

        }

        function updateSiteInfo() {
            var data = {
                "location": vm.siteInfo.location,
                "longitude": vm.siteInfo.longitude,
                "latitude": vm.siteInfo.latitude,
                "site_code": vm.siteInfo.site_code || "1111",
                "volume": vm.siteInfo.volume,
                "telephone": vm.siteInfo.telephone,
                "name": vm.siteInfo.name,
                "city_id": vm.siteInfo.city.city_id,
                "province_id": vm.siteInfo.province.province_id,
                "nation_id": vm.siteInfo.nation.nation_id
            };
            ApiServer.updateSiteInfo({
                "param": data,
                "site_code": vm.siteInfo.id,
                "success": function (response) {
                    toastr.success(response.data.msg);
                    $scope.conf.currentPage = 1;
                    emptyInfo();
                    $scope.switchShowAdd();
                    retrieveSiteInfo();
                },
                "error": function (err) {
                    toastr.error(err.msg || "更新仓库失败");
                }
            });
        }

        function retrieveSiteInfo(filter) {
            ApiServer.retrieveSiteInfo({
                "limit": $scope.conf.itemsPerPage,
                "offset": ($scope.conf.currentPage - 1) * $scope.conf.itemsPerPage,
                "data": filter,
                "success": function (res) {
                    vm.siteInfoList = res.data.data.results;
                    $scope.tableConfig.data = res.data.data.results;
                    $scope.conf.totalItems = res.data.data.count;
                    console.log("vm.siteInfoList", vm.siteInfoList)
                },
                "error": function (err) {
                    toastr.error(err.msg || "获取仓库信息失败");
                }
            });
        }

        $scope.validationLength = function (value, len) {
            if (((value + "").length > len || (value > Math.pow(10, len))) && event.keyCode != 8 && value != null) {
                event.preventDefault();
            }
        };

        vm.retrieveSiteInfoByFilter = function () {
            console.log("sss==========", vm.siteInfoFilter);
            var min_value, max_value;
            var index = vm.siteInfoFilter.volume.volume_id;
            if (index != undefined) {
                min_value = vm.filterVolumeList[index].min_value;
                max_value = vm.filterVolumeList[index].max_value;
            }
            retrieveSiteInfo({
                province_id: vm.siteInfoFilter.province.province_id,
                city_id: vm.siteInfoFilter.city.city_id,
                min_volume: min_value,
                max_volume: max_value,
                key_word: vm.siteInfoFilter.keyword
            });
        };
        retrieveSiteInfo();

        $scope.go = function (type, id) {
            if (type == 1) {
                $state.go("app.warehouseIn", {"containerId": id});
            } else {
                $state.go("app.warehouseFlow", {"containerId": id});
            }
        };

        $scope.$watchGroup(['conf.currentPage', 'conf.itemsPerPage'], retrieveSiteInfo)
    }
})();