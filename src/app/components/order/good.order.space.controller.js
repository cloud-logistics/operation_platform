/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airs').controller('orderGoodSpaceController', orderGoodSpaceController);

    /** @ngInject */
    function orderGoodSpaceController($log,$uibModal,$state,ApiServer,$stateParams,toastr,$timeout) {
        /* jshint validthis: true */
        var vm = this;

        var info = ApiServer.info();
        var orderId = $stateParams.orderId;
        vm.companys = [];
        vm.shippingSchedules = [];
        vm.orderInfo = {orderid:orderId,containertype:'freight',cargoagentid:info.id,shipperid:'',voyageid:''};

        vm.submitAction = submitAction;
        vm.didSelectCompanyAction = didSelectCompanyAction;
        vm.didSelectScheduleAction = didSelectScheduleAction;


        function submitAction(type) {
            if (type === 'confirm'){
                console.log(vm.orderInfo);
                ApiServer.goodOrderSpace(vm.orderInfo,function (res) {
                    toastr.success('操作成功');
                    $timeout(function () {
                        $state.go('app.goodorderadd',{orderId:orderId});
                    },2000);
                },function (err) {
                    var errInfo = '操作失败：' + err.statusText + ' (' + err.status +')';
                    toastr.error(errInfo);
                })
            }else{
                history.back();
            }
        }

        function didSelectCompanyAction() {
            getShippingScheduleDatas(vm.orderInfo.shipperid);
        }
        function didSelectScheduleAction() {

        }
        function getShippingScheduleDatas(shipperId) {
            ApiServer.shippingScheduleGetByOwner(shipperId,function (res) {
                console.log(res);
                vm.shippingSchedules = res.data;
                vm.orderInfo.voyageid = vm.shippingSchedules[0].id;
            },function (err) {
                var errInfo = '获取信息失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            });
        }
        function getCompanyDatas() {
            ApiServer.userGetByRoleType('shipper',function (res) {
                vm.companys = res.data;
                vm.orderInfo.shipperid = vm.companys[0].id;
                getShippingScheduleDatas(vm.orderInfo.shipperid);
            },function (err) {
                var errInfo = '获取数据失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            })
        }

        getCompanyDatas();


    }

})();
