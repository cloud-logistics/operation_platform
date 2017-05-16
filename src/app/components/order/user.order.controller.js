/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('orderUserController', orderUserController);

    /** @ngInject */
    function orderUserController($state,$uibModal,$log,ApiServer,toastr,$rootScope) {
        /* jshint validthis: true */
        var vm = this;

        var info = ApiServer.info();

        vm.items = [];
        vm.titles = ['订单号','发货人','发货人联系方式','收货人','收货人联系方式','创建日期','状态','操作'];

        vm.gotoDetailAction = gotoDetailAction;

        function gotoDetailAction(orderId) {
            $state.go('app.userorderadd',{orderId:orderId});
        }


        function deleteAction(index) {
            ApiServer.orderDelete(vm.items[index].id,function (res) {
                toastr.success('删除成功');
                vm.items.splice(index,1);
            },function (err) {
                var errInfo = '删除失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            })
        }

        function getOrderDatas() {
            ApiServer.orderGetByOwner(info.id,function (response) {
                vm.items = response.data;
            },function (err) {
                toastr.error(err.Error);
            });
        }

        getOrderDatas();


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
