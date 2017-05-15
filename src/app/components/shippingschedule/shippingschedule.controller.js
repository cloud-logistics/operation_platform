/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airs').controller('ShippingScheduleController', ShippingScheduleController);

    /** @ngInject */
    function ShippingScheduleController($state,$log,$uibModal,ApiServer,toastr) {
        /* jshint validthis: true */
        var vm = this;

        /*** 如果是货代公司只能查询 ***/

        var info = ApiServer.info();
        var roleType = info.role;
        vm.isReadOnly = (roleType !== 'shipper');

        vm.titles = ['航次号','装货港口','卸货港口','取货地点','船的编号','船名称','出发时间','抵达时间'];
        vm.items = [];

        vm.gotoDetail = gotoDetail;

        function gotoDetail(type,index) {
            if (type === 'new'){
                $state.go('app.shippingscheduleadd',{shippingScheduleId:'new'});
            } else if (type === 'detail'){
                $state.go('app.shippingscheduleadd',{shippingScheduleId:vm.items[index].id});
            }
        }
        function deleteAction(index) {
            ApiServer.vehicleDelete(vm.items[index].id,function (res) {
                vm.items.splice(index,1);
                toastr.success('删除成功');
            },function (err) {
                var errInfo = '获取信息失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            })
        }
        function getData() {
            // ApiServer.shippingScheduleGet('7711779c-ed74-4798-a3e5-a9ef9a66548d',function (res) {
            //     console.log(res);
            // },function (err) {
            //
            // });
            ApiServer.shippingScheduleGetByOwner(info.id,function (res) {
                console.log(res);
                vm.items = res.data;
            },function (err) {
                var errInfo = '获取信息失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            });
        }


        getData();


        //Model
        vm.tipsInfo = {title:'删除',content:'确定删除吗？'};
        vm.openAlert = function (size,index) {
            var modalInstance = $uibModal.open({
                templateUrl: 'myModalContent.html',
                size: size,
                controller:'ModalInstanceCtrl',
                resolve: {
                    tipsInfo: function () {
                        return vm.tipsInfo;
                    }
                }
            });
            modalInstance.result.then(function (param) {
                deleteAction(index);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };




    }

})();
