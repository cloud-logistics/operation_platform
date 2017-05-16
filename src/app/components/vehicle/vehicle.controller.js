/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('VehicleController', VehicleController);

    /** @ngInject */
    function VehicleController($stateParams,ApiServer,toastr,$state,$timeout) {
        /* jshint validthis: true */
        var vm = this;

        var info = ApiServer.info();
        var roleType = info.role;

        vm.isReadOnly = (roleType !== 'carrier');



        vm.vehicleInfo = {vehicleno:'',driver:{},ownerid:info.id};
        vm.statusType = [{id:'free',name:'空闲'},{id:'inuse',name:'使用中'}];
        vm.status = 'free';

        var vehicleId = $stateParams.vehicleId;

        vm.submitAction = submitAction;
        vm.cancelAction = cancelAction;
        
        function submitAction() {

            if (vehicleId === 'new'){
                ApiServer.vehicleAdd(vm.vehicleInfo,function (res) {
                    toastr.success('添加成功');
                    $timeout(function () {
                        $state.go('app.vehicles');
                    },2000);
                },function (err) {
                    var errInfo = '添加失败：' + err.statusText + ' (' + err.status +')';
                    toastr.error(errInfo);
                });
            }else {
                ApiServer.vehicleUpdate(vm.vehicleInfo,function (res) {
                    toastr.success('更新成功');
                },function (err) {
                    var errInfo = '更新失败：' + err.statusText + ' (' + err.status +')';
                    toastr.error(errInfo);
                });
            }

        }
        function cancelAction() {
            $state.go('app.vehicles');
        }
        function getData() {
            if (vehicleId !== 'new'){
                ApiServer.vehicleGet(vehicleId,function (res) {
                    vm.vehicleInfo = res.data;
                    toastr.success('更新成功');
                },function (err) {
                    var errInfo = '获取数据失败：' + err.statusText + ' (' + err.status +')';
                    toastr.error(errInfo);
                });
            }
        }

        getData();

    }

})();
