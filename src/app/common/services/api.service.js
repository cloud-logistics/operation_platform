/**
 * Created by Otherplayer on 2016/12/12.
 */

(function () {
    'use strict';


    /**
     *
     * facotry是一个单例,它返回一个包含service成员的对象。
     * 注：所有的Angular services都是单例，这意味着每个injector都只有一个实例化的service。
     *
     */
    angular
        .module('smart_container')
        .factory('ApiServer', ApiServer);

    /** @ngInject */
    function ApiServer(constdata, NetworkService, StorageService, iotUtil, $timeout, $state, toastr) {


        var service = {

            userLogin: userLogin,
            getSateliteInfo: getSateliteInfo,
            getContainerOverviewInfo: getContainerOverviewInfo,
            getHistorylocationInfo: getHistorylocationInfo,
            getInstantlocationInfo: getInstantlocationInfo,
            getContainerReportHistory: getContainerReportHistory,
            getContainerHistoryStatus: getContainerHistoryStatus,
            getAlerts: getAlerts,
            getBasicInfo: getBasicInfo,
            getBoxStatus: getBoxStatus,
            getRealtimeInfo: getRealtimeInfo,
            getOptions: getOptions,
            getCarriers: getCarriers,
            getMyContainers: getMyContainers,
            getAvailableContainers: getAvailableContainers,
            getOnLeaseContainers: getOnLeaseContainers,
            requestLease: requestLease,
            returnContainer: returnContainer,
            newCarrier: newCarrier,
            command: command,
            newBasicInfoConfig: newBasicInfoConfig,
            updateSecurityConfig: updateSecurityConfig,
            getSecurityConfig: getSecurityConfig,
            newRepairConfig: newRepairConfig,
            newIssueConfig: newIssueConfig,
            getAnalysisResult: getAnalysisResult,
            getOperationOverview: getOperationOverview,
            getBasicInfoManage: getBasicInfoManage,
            getIssueInfoManage: getIssueInfoManage,
            getRepairInfoManage: getRepairInfoManage,

            isAuthed: isAuthed,
            roleType: roleType,
            info: info,
            logoutAction: logoutAction,

            userRegister: userRegister,
            userUpdate: userUpdate,
            userGet: userGet,
            userGetByRoleType: userGetByRoleType,

            userRefresh: userRefresh,
            userLogout: userLogout,

            messageAdd: messageAdd,
            messageGet: messageGet,
            messageGetByUserId: messageGetByUserId,
            messageDelete: messageDelete,

            vehicleAdd: vehicleAdd,
            vehicleUpdate: vehicleUpdate,
            vehicleGet: vehicleGet,
            vehicleGetByOwner: vehicleGetByOwner,
            vehicleDelete: vehicleDelete,

            shippingScheduleAdd: shippingScheduleAdd,
            shippingScheduleUpdate: shippingScheduleUpdate,
            shippingScheduleGet: shippingScheduleGet,
            shippingScheduleGetByOwner: shippingScheduleGetByOwner,
            shippingScheduleDelete: shippingScheduleDelete,

            containerAdd: containerAdd,
            containerUpdate: containerUpdate,
            containerGet: containerGet,
            containerGetByOwner: containerGetByOwner,
            containerDelete: containerDelete,
            containerTrack: containerTrack,

            transportTaskGet: transportTaskGet,
            transportTaskGetByOwner: transportTaskGetByOwner,
            transportTaskDelete: transportTaskDelete,

            orderGet: orderGet,
            orderGetByOwner: orderGetByOwner,
            orderDelete: orderDelete,
            clientOrderAdd: clientOrderAdd,
            clientOrderConfirmReceipt: clientOrderConfirmReceipt,
            goodOrderAccept: goodOrderAccept,
            goodOrderCar: goodOrderCar,
            goodOrderSpace: goodOrderSpace,
            goodOrderFinish: goodOrderFinish,
            carOrderFetchEmptyContainers: carOrderFetchEmptyContainers,
            carOrderPackgoods: carOrderPackgoods,
            carOrderArriveyard: carOrderArriveyard,
            shipOrderLoadgoods: shipOrderLoadgoods,
            shipOrderDepartrue: shipOrderDepartrue,
            shipOrderArriveDestinationPort: shipOrderArriveDestinationPort,
            shipOrderDeliverGoods: shipOrderDeliverGoods,
            getPredictionDecisionData: getPredictionDecisionData,
            getAllsites: getAllsites,
            getCloudBoxData: getCloudBoxData,
            getCloudBoxInOutRecord: getCloudBoxInOutRecord,
            getCountryList: getCountryList,
            getProvinceList: getProvinceList,
            getCityList: getCityList
        };
        var zjMock = function (dict, length) {
            var res = [];
            var tempDic = {};
            for (var s = 0; s < length; s++) {
                tempDic = {};
                for (var k in dict) {
                    if (dict.hasOwnProperty(k)) {

                        var len = dict[k].length;
                        var index = (Math.random() * (len - 1)).toFixed(0)
                        tempDic[k] = dict[k][index]
                    }
                }
                res.push(tempDic)
            }
            return res;
        }
        return service;

        // 获取所有仓库信息
        function getAllsites(successHandler, failedHandler) {
            NetworkService.get(constdata.api.allsites, null, successHandler, failedHandler);
        }


        //获取在库云箱数据
        function getCloudBoxData() {
            var param = {
                currentPage: "1",
                pageNum: "20"
            };
            //NetworkService.post(constdata.api.user,param,successHandler,failedHandler);

            var dict = {
                warehouseID: ['2293203474450', '2293203474220'],
                country: ['中国', '非洲', '马尔代夫'],
                province: ['陕西', '阿里斯加', '拉斯维加斯'],
                city: ['西安', '太原', '富平'],
                location: ['108,22', '12,22', '108,32'],
                volume: ['2333', '111', '8702']
            };
            return zjMock(dict, 10);
        }

        //获取云箱出入记录数据
        function getCloudBoxInOutRecord() {
            var param = {
                currentPage: "1",
                pageNum: "20"
            };
            //NetworkService.post(constdata.api.user,param,successHandler,failedHandler);

            var dict = {
                status: ['in', 'out'],
                time: ['2017/10/25 14:22', '2017/10/25 16:33', '2017/10/25 15:44'],
                warehouseID: ['2293203474450', '2293203474451', '22932034744502']
            };
            return zjMock(dict, 10);
        }

        //获取预测及评估的数据
        function getPredictionDecisionData() {
            var param = {
                currentPage: "1",
                pageNum: "20"
            };
            //NetworkService.post(constdata.api.user,param,successHandler,failedHandler);

            var dict = {
                status: ['进行中', '待调度'],
                oAddress: ['BG1123', 'XA0029', 'TY0354'],
                count: [1, 3, 4],
                tAddress: ['BJ1123', 'AK0029', 'HLJ0354']
            }
            return zjMock(dict, 10);
        }

        //获取国家列表
        function getCountryList(opt) {
            console.log(11)
            if (false && location.hostname == 'localhost') {
                return opt.success({
                    data: [
                        {
                            nation_id: 1,
                            nation_name: "中国"
                        }
                    ]
                })
            } else {
                NetworkService.get(constdata.api.countryList, null, opt.success, opt.error);
            }
        }

        //根据国家获取省市列表
        function getProvinceList(opt) {
            if (!opt.countryId) {
                console.log("请选择国家先");
                return;
            }
            if (location.hostname == 'localhost') {
                return opt.success({
                    data: [
                        {
                            province_id: 1,
                            province_name: "北京市"
                        },
                        {
                            province_id: 2,
                            province_name: "天津市"
                        },
                        {
                            province_id: 3,
                            province_name: "河北省"
                        },
                        {
                            province_id: 4,
                            province_name: "山西省"
                        },
                        {
                            province_id: 5,
                            province_name: "内蒙古自治区"
                        },
                        {
                            province_id: 6,
                            province_name: "辽宁省"
                        },
                        {
                            province_id: 7,
                            province_name: "吉林省"
                        },
                        {
                            province_id: 8,
                            province_name: "黑龙江省"
                        },
                        {
                            province_id: 9,
                            province_name: "上海市"
                        },
                        {
                            province_id: 10,
                            province_name: "江苏省"
                        },
                        {
                            province_id: 11,
                            province_name: "浙江省"
                        },
                        {
                            province_id: 12,
                            province_name: "安徽省"
                        },
                        {
                            province_id: 13,
                            province_name: "福建省"
                        },
                        {
                            province_id: 14,
                            province_name: "江西省"
                        },
                        {
                            province_id: 15,
                            province_name: "山东省"
                        },
                        {
                            province_id: 16,
                            province_name: "河南省"
                        },
                        {
                            province_id: 17,
                            province_name: "湖北省"
                        },
                        {
                            province_id: 18,
                            province_name: "湖南省"
                        },
                        {
                            province_id: 19,
                            province_name: "广东省"
                        },
                        {
                            province_id: 20,
                            province_name: "广西壮族自治区"
                        },
                        {
                            province_id: 21,
                            province_name: "海南省"
                        },
                        {
                            province_id: 22,
                            province_name: "重庆市"
                        },
                        {
                            province_id: 23,
                            province_name: "四川省"
                        },
                        {
                            province_id: 24,
                            province_name: "贵州省"
                        },
                        {
                            province_id: 25,
                            province_name: "云南省"
                        },
                        {
                            province_id: 26,
                            province_name: "西藏自治区"
                        },
                        {
                            province_id: 27,
                            province_name: "陕西省"
                        },
                        {
                            province_id: 28,
                            province_name: "甘肃省"
                        },
                        {
                            province_id: 29,
                            province_name: "青海省"
                        },
                        {
                            province_id: 30,
                            province_name: "宁夏回族自治区"
                        },
                        {
                            province_id: 31,
                            province_name: "新疆维吾尔自治区"
                        },
                        {
                            province_id: 32,
                            province_name: "台湾省"
                        },
                        {
                            province_id: 33,
                            province_name: "香港特别行政区"
                        },
                        {
                            province_id: 34,
                            province_name: "澳门特别行政区"
                        }
                    ]
                })
            } else {
                NetworkService.get('/container/api/v1/cloudbox/provincelist/' + opt.countryId, null, opt.success, opt.error);
            }
        }

        //获取市列表
        function getCityList(opt) {
            if (!opt.provinceId) {
                console.log("请选择省份先");
                return;
            }
            if (location.hostname == 'localhost') {
                return opt.success({
                    data: [
                        {
                            city_id: 132,
                            city_name: "抚州",
                            longitude: "116.358181",
                            latitude: "27.949217"
                        },
                        {
                            city_id: 129,
                            city_name: "赣州",
                            longitude: "114.933546",
                            latitude: "25.830694"
                        },
                        {
                            city_id: 126,
                            city_name: "九江",
                            longitude: "116.00193",
                            latitude: "29.705077"
                        },
                        {
                            city_id: 130,
                            city_name: "吉安",
                            longitude: "114.964696",
                            latitude: "27.087637"
                        },
                        {
                            city_id: 124,
                            city_name: "景德镇",
                            longitude: "117.178443",
                            latitude: "29.268783"
                        },
                        {
                            city_id: 123,
                            city_name: "南昌",
                            longitude: "115.858197",
                            latitude: "28.682892"
                        },
                        {
                            city_id: 125,
                            city_name: "萍乡",
                            longitude: "113.854556",
                            latitude: "27.622768"
                        },
                        {
                            city_id: 133,
                            city_name: "上饶",
                            longitude: "117.943433",
                            latitude: "28.454862"
                        },
                        {
                            city_id: 127,
                            city_name: "新余",
                            longitude: "114.917346",
                            latitude: "27.817808"
                        },
                        {
                            city_id: 131,
                            city_name: "宜春",
                            longitude: "114.416785",
                            latitude: "27.815743"
                        },
                        {
                            city_id: 128,
                            city_name: "鹰潭",
                            longitude: "117.069202",
                            latitude: "28.260189"
                        }
                    ]
                })
            } else {
                NetworkService.get('http://106.2.20.186:8000/container/api/v1/cloudbox/citylist/' + opt.provinceId, null, opt.success, opt.error);
            }
        }

        function isAuthed() {
            var token = StorageService.get(constdata.token);
            if (token && token !== 'undefined') {
                return true;
            }
            return false;
        }

        function roleType() {
            // "regularclient"; "cargoagent"; "carrier"; "shipper";
            var information = info();
            return information.role;
        }

        function info() {
            var information = StorageService.get(constdata.informationKey);
            if (!information || information === 'undefined') {
                // toastr.error('服务器出错了，请稍后重试');
                logoutAction();
            } else {
                return information;
            }
        }

        function logoutAction() {
            var authorizationKey = constdata.token;
            var userInfo = constdata.informationKey;
            $timeout(function () {
                StorageService.clear(authorizationKey);
                StorageService.clear(userInfo);
                StorageService.clear(constdata.token);
            }, 60);
            $state.go('access.signin');
        }

        ////////////用户

        function userRegister(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.user, param, successHandler, failedHandler);
        }

        function userUpdate(param, successHandler, failedHandler) {
            NetworkService.put(constdata.api.user, param, successHandler, failedHandler);
        }

        function userGet(userId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.user + '/' + userId, null, successHandler, failedHandler);
        }

        function userGetByRoleType(type, successHandler, failedHandler) {
            NetworkService.get(constdata.api.user + '/findByUserRoleType?roletype=' + type, null, successHandler, failedHandler);
        }

        function getSateliteInfo(successHandler, failedHandler) {
            NetworkService.get(constdata.api.overview.satelites, null, successHandler, failedHandler);
        }

        function getContainerOverviewInfo(successHandler, failedHandler) {
            NetworkService.get(constdata.api.overview.containers, null, successHandler, failedHandler);
        }

        function getHistorylocationInfo(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.containerhistory,
                params,
                successHandler,
                failedHandler);
        }

        function getInstantlocationInfo(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.containerInstantInfo,
                params,
                successHandler,
                failedHandler);
        }

        function getContainerReportHistory(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.containerReportHistory,
                params,
                successHandler,
                failedHandler);
        }

        function getContainerHistoryStatus(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.containerHistoryStatus,
                params,
                successHandler,
                failedHandler);
        }

        function getAlerts(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.alerts,
                params,
                successHandler,
                failedHandler);
        }

        function getBasicInfo(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.basicInfo,
                params,
                successHandler,
                failedHandler);
        }

        function getBoxStatus(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.boxStatus,
                params,
                successHandler,
                failedHandler);
        }

        function getRealtimeInfo(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.realtimeInfo,
                params,
                successHandler,
                failedHandler);
        }

        function newBasicInfoConfig(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.basicInfoConfig,
                params,
                successHandler,
                failedHandler);
        }

        function newCarrier(params, successHandler, failedHandler) {
            console.log(params);
            NetworkService.post(constdata.api.newcarrier,
                params,
                successHandler,
                failedHandler);
        }

        function command(params, successHandler, failedHandler) {
            console.log(params);
            NetworkService.post(constdata.api.command,
                params,
                successHandler,
                failedHandler);
        }

        function getSecurityConfig(successHandler, failedHandler) {
            NetworkService.get(constdata.api.getSecurityConfig,
                null,
                successHandler,
                failedHandler);
        }

        function updateSecurityConfig(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.securityConfig,
                params,
                successHandler,
                failedHandler);
        }

        function newRepairConfig(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.repairConfig,
                params,
                successHandler,
                failedHandler);
        }

        function newIssueConfig(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.issueConfig,
                params,
                successHandler,
                failedHandler);
        }

        function getAnalysisResult(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.analysisresult,
                params,
                successHandler,
                failedHandler);
        }


        function getOperationOverview(successHandler, failedHandler) {
            NetworkService.get(constdata.api.operationoverview,
                null,
                successHandler,
                failedHandler);
        }

        function getBasicInfoManage(successHandler, failedHandler) {
            NetworkService.get(constdata.api.basicInfoManage,
                null,
                successHandler,
                failedHandler);
        }

        function getIssueInfoManage(successHandler, failedHandler) {
            NetworkService.get(constdata.api.issueInfo,
                null,
                successHandler,
                failedHandler);
        }

        function getRepairInfoManage(successHandler, failedHandler) {
            NetworkService.get(constdata.api.repairInfo,
                null,
                successHandler,
                failedHandler);
        }

        function getCarriers(successHandler, failedHandler) {
            NetworkService.get(constdata.api.carriers,
                null,
                successHandler,
                failedHandler);
        }

        function getMyContainers(successHandler, failedHandler) {
            NetworkService.get(constdata.api.mycontainers,
                null,
                successHandler,
                failedHandler);
        }

        function getAvailableContainers(successHandler, failedHandler) {
            NetworkService.get(constdata.api.availablecontainers,
                null,
                successHandler,
                failedHandler);
        }

        function getOnLeaseContainers(successHandler, failedHandler) {
            NetworkService.get(constdata.api.containersonlease,
                null,
                successHandler,
                failedHandler);
        }

        function requestLease(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.requestlease,
                params,
                successHandler,
                failedHandler);
        }

        function returnContainer(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.returncontainer,
                params,
                successHandler,
                failedHandler);
        }


        function getOptions(requiredOptions, sucHandler) {
            var queryParams = {
                requiredOptions: requiredOptions
            };

            var options = undefined;

            NetworkService.post(constdata.api.options, queryParams, function (response) {
                options = R.pick(requiredOptions)(response.data)
                sucHandler(options)
            }, function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function userLogin(param, successHandler, failedHandler) {
            console.log("user login");
            NetworkService.post(constdata.api.auth, param, successHandler, failedHandler);
        }

        function userRefresh(successHandler, failedHandler) {
            NetworkService.put(constdata.api.user + '/session/refresh', null, successHandler, failedHandler);
        }

        function userLogout(successHandler, failedHandler) {
            NetworkService.put(constdata.api.user + '/session/logout', null, successHandler, failedHandler);
        }

        ////////////Message

        function messageAdd(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.message, param, successHandler, failedHandler);
        }

        function messageGet(messageId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.message + '/' + messageId, null, successHandler, failedHandler);
        }

        function messageGetByUserId(userId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.message, null, successHandler, failedHandler);
        }

        function messageDelete(messageId, successHandler, failedHandler) {
            NetworkService.delete(constdata.api.message + '/' + messageId, null, successHandler, failedHandler);
        }


        ////////////Vehicle 拖车

        function vehicleAdd(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.resource.vehicle, param, successHandler, failedHandler);
        }

        function vehicleUpdate(param, successHandler, failedHandler) {
            NetworkService.put(constdata.api.resource.vehicle, param, successHandler, failedHandler);
        }

        function vehicleGet(vehicleId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.resource.vehicle + '/' + vehicleId, null, successHandler, failedHandler);
        }

        function vehicleGetByOwner(ownerId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.resource.vehicle + '/findByOwnerId?ownerid=' + ownerId, null, successHandler, failedHandler);
        }

        function vehicleDelete(vehicleId, successHandler, failedHandler) {
            NetworkService.delete(constdata.api.resource.vehicle + '/' + vehicleId, null, successHandler, failedHandler);
        }

        ////////////ShippingSchedule

        function shippingScheduleAdd(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.resource.shippingSchedule, param, successHandler, failedHandler);
        }

        function shippingScheduleUpdate(param, successHandler, failedHandler) {
            NetworkService.put(constdata.api.resource.shippingSchedule, param, successHandler, failedHandler);
        }

        function shippingScheduleGet(shippingscheduleId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.resource.shippingSchedule + '/' + shippingscheduleId, null, successHandler, failedHandler);
        }

        function shippingScheduleGetByOwner(ownerId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.resource.shippingSchedule + '/findByOwnerId?ownerid=' + ownerId, null, successHandler, failedHandler);
        }

        function shippingScheduleDelete(shippingscheduleId, successHandler, failedHandler) {
            NetworkService.delete(constdata.api.resource.shippingSchedule + '/' + shippingscheduleId, null, successHandler, failedHandler);
        }

        ////////////Container

        function containerAdd(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.resource.container, param, successHandler, failedHandler);
        }

        function containerUpdate(param, successHandler, failedHandler) {
            NetworkService.put(constdata.api.resource.container, param, successHandler, failedHandler);
        }

        function containerGet(containerId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.resource.container + '/' + containerId, null, successHandler, failedHandler);
        }

        function containerTrack(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.resource.container + '/track', param, successHandler, failedHandler);
        }

        function containerGetByOwner(ownerId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.resource.container + '/findByOwnerId?ownerid=' + ownerId, null, successHandler, failedHandler);
        }

        function containerDelete(containerId, successHandler, failedHandler) {
            NetworkService.delete(constdata.api.resource.container + '/' + containerId, null, successHandler, failedHandler);
        }

        ////////////TransportTask

        function transportTaskGet(transportTaskId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.resource.transportTask + '/' + transportTaskId, null, successHandler, failedHandler);
        }

        function transportTaskGetByOwner(ownerId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.resource.transportTask + '/findByOwnerId?ownerid=' + ownerId, null, successHandler, failedHandler);
        }

        function transportTaskDelete(transportTaskId, successHandler, failedHandler) {
            NetworkService.delete(constdata.api.resource.transportTask + '/' + transportTaskId, null, successHandler, failedHandler);
        }

        ////////////Order
        function orderGet(orderId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.order + '/' + orderId, null, successHandler, failedHandler);
        }

        function orderDelete(containerId, successHandler, failedHandler) {
            NetworkService.delete(constdata.api.order + '/' + containerId, null, successHandler, failedHandler);
        }

        function orderGetByOwner(ownerId, successHandler, failedHandler) {
            NetworkService.get(constdata.api.order + '/findByUserId?ownerid=' + ownerId, null, successHandler, failedHandler);
        }

        function clientOrderAdd(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.order + '/client/create', param, successHandler, failedHandler);
        }

        function clientOrderConfirmReceipt(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.order + '/client/confirmreceipt', param, successHandler, failedHandler);
        }

        function goodOrderAccept(param, successHandler, failedHandler) {//是否接受订单
            NetworkService.post(constdata.api.order + '/cargoagent/check', param, successHandler, failedHandler);
        }

        function goodOrderSpace(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.order + '/cargoagent/bookspace', param, successHandler, failedHandler);
        }

        function goodOrderCar(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.order + '/cargoagent/bookvehicle', param, successHandler, failedHandler);
        }

        function goodOrderFinish(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.order + '/cargoagent/finish', param, successHandler, failedHandler);
        }

        function carOrderFetchEmptyContainers(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.order + '/carrier/fetchemptycontainers', param, successHandler, failedHandler);
        }

        function carOrderPackgoods(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.order + '/carrier/packgoods', param, successHandler, failedHandler);
        }

        function carOrderArriveyard(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.order + '/carrier/arriveyard', param, successHandler, failedHandler);
        }

        function shipOrderLoadgoods(param, successHandler, failedHandler) {
            NetworkService.post(constdata.api.order + '/shipper/loadgoods', param, successHandler, failedHandler);
        }

        function shipOrderDepartrue(param, successHandler, failedHandler) {//集装箱离港时间
            NetworkService.post(constdata.api.order + '/shipper/departure', param, successHandler, failedHandler);
        }

        function shipOrderArriveDestinationPort(param, successHandler, failedHandler) {//集装箱到目的港口时间
            NetworkService.post(constdata.api.order + '/shipper/arrivedestinationport', param, successHandler, failedHandler);
        }

        function shipOrderDeliverGoods(param, successHandler, failedHandler) {//货物送至客户
            NetworkService.post(constdata.api.order + '/shipper/delivergoods', param, successHandler, failedHandler);
        }


    }

})();
