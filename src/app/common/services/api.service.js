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
            getDeviceIds :getDeviceIds,
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
            editBasicInfoConfigPost: editBasicInfoConfigPost,
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
            getDispatchData: getDispatchData,
            getDistribution:getDistribution,
            getAllsites: getAllsites,
            getBoxbysite: getBoxbysite,
            getSiteStream: getSiteStream,

            getCountryList: getCountryList,
            getProvinceList: getProvinceList,
            getCityList: getCityList,
            getAddressByLngLat :getAddressByLngLat,
            getHistorypath: getHistorypath,
            addSiteInfo:addSiteInfo,
            deleteSiteInfo:deleteSiteInfo,
            updateSiteInfo:updateSiteInfo,
            retrieveSiteInfo:retrieveSiteInfo,
            getAllSafeSetting:getAllSafeSetting,
            resetSafeSetting:resetSafeSetting,
            deleteBasicInfoConfig:deleteBasicInfoConfig
        };

        return service;

        // 获取所有仓库信息
        function getAllsites(page, successHandler, failedHandler) {
            NetworkService.get(constdata.api.warehouse.allsites + page, null, successHandler, failedHandler);
        }

        function getBoxbysite(opt) {
            var url = constdata.api.warehouse.boxbysite.replace("{id}",opt.id).replace("{limit}",opt.limit).replace("{offset}",opt.offset)
            NetworkService.get(url, null,opt.success, opt.error);
        }

        function getSiteStream(opt , successHandler, failedHandler) {
            NetworkService.get(constdata.api.warehouse.siteStream + opt.id, opt.data, successHandler, failedHandler);
        }

        //获取分布信息数据
        function getDistribution(opt){
            NetworkService.get(constdata.api.distribution,null,opt.success,opt.error)
        }

        //获取调度数据
        function getDispatchData(opt) {
            NetworkService.get(constdata.api.dispatchInfo,opt.data,opt.success,opt.error);
        }

        //获取国家列表
        function getCountryList(opt) {
            NetworkService.get(constdata.api.countryList, null, opt.success, opt.error);
        }

        //根据国家获取省市列表
        function getProvinceList(opt) {
            if (!opt.countryId) {
                console.log("请选择国家先");
                return;
            }

            NetworkService.get(constdata.api.provinceList + opt.countryId, null, opt.success, opt.error);

        }

        //获取所有安全参数设置
        function getAllSafeSetting(opt) {
            NetworkService.get(constdata.api.safeSetting,
                opt.params.data,
                opt.success,
                opt.error);
        }
        //根据id设置云箱的安全参数
        function resetSafeSetting(opt){
            var url = constdata.api.resetSafeSetting.replace("{id}",opt.params.id)
            NetworkService.put(url,
                opt.params.data,
                opt.success,
                opt.error);
        }


        //获取市列表
        function getCityList(opt) {
            if (!opt.provinceId) {
                console.log("请选择省份先");
                return;
            }
            NetworkService.get(constdata.api.cityList + opt.provinceId, null, opt.success, opt.error);

        }

        //根据经纬度反查地名
        function getAddressByLngLat(opt){
            NetworkService.post(constdata.api.getPosition, opt.param, opt.success, opt.error);
        }

        //新增仓库
        function addSiteInfo(opt){
            NetworkService.post(constdata.api.warehouse.create, opt.param, opt.success, opt.error);
        }
        //删除仓库
        function deleteSiteInfo(opt){
            NetworkService.delete(constdata.api.warehouse.delete + opt.site_code, null, opt.success, opt.error);
        }
        //修改仓库
        function updateSiteInfo(opt){
            NetworkService.put(constdata.api.warehouse.update + opt.site_code + "/", opt.param, opt.success, opt.error);
        }
        //查询仓库
        function retrieveSiteInfo(opt){
            var url = constdata.api.warehouse.retrieve.replace("{limit}",opt.limit).replace("{offset}",opt.offset);
            if(opt.data){
                for(var s in opt.data){
                    if(opt.data[s]){
                        url += "&" + s + "=" + opt.data[s];
                    }
                }
            }
            NetworkService.get(url, null, opt.success, opt.error);
        }


        function isAuthed() {
            var token = StorageService.get(constdata.token);
            if (token && token !== 'undefined') {
                return true;
            }
            return false;
        }

        function roleType() {
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

        function logoutAction(opt) {
            NetworkService.post(constdata.api.logout,opt.params||{},opt.success,opt.error)

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

        function getAlerts(opt) {
            var url = constdata.api.alerts;

            NetworkService.get(url,
                opt.data,
                opt.success,
                opt.error);
        }

        //获取云箱基础信息
        function getBasicInfo(params, successHandler, failedHandler) {
            NetworkService.get(constdata.api.basicInfo,
                params,
                successHandler,
                failedHandler);
        }

        //获取云箱历史轨迹
        function getHistorypath(params, successHandler, failedHandler) {
            NetworkService.get(constdata.api.historypath,
                params,
                successHandler,
                failedHandler);
        }

        //
        function getBoxStatus(opt) {
            NetworkService.get(constdata.api.boxStatus,
                opt.data,
                opt.success,
                opt.error);
        }

        function getDeviceIds(opt){
            NetworkService.get(
                constdata.api.getDeviceIds,
                opt.data,
                opt.success,
                opt.error);
        }

        function getRealtimeInfo(params, successHandler, failedHandler) {
            NetworkService.post(constdata.api.realtimeInfo,
                params,
                successHandler,
                failedHandler);
        }

        function newBasicInfoConfig(opt) {
            NetworkService.post(constdata.api.basicInfoConfig,
                opt.data,
                opt.success,
                opt.error);
        }
        function editBasicInfoConfigPost(opt) {
            NetworkService.put(constdata.api.editBoxBasic,
                opt.data,
                opt.success,
                opt.error);
        }
        function deleteBasicInfoConfig(opt){
            NetworkService.delete(constdata.api.deleteBoxBasic.replace("{container_id}",opt.container_id),
                null,
                opt.success,
                opt.error);
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


        function getOptions(requiredOptions, sucHandler,notNeedAll) {
            var queryParams = {
                requiredOptions: requiredOptions,
                optionsType :notNeedAll ? 0 : 1
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

        function messageGetByUserId(opt) {
            NetworkService.get(constdata.api.message, null, opt.success, opt.error);
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
