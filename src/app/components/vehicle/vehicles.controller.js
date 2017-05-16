/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('VehiclesController', VehiclesController);

    /** @ngInject */
    function VehiclesController($state,$log,$uibModal,ApiServer,toastr) {
        /* jshint validthis: true */
        var vm = this;


        var info = ApiServer.info();
        var roleType = info.role;

        vm.isReadOnly = (roleType !== 'carrier');

        vm.titles = ['车辆编号','驾驶人姓名','驾驶人联系方式','驾驶证号','状态'];

        vm.items = [];

        vm.displayedCollection = [].concat(vm.items);




        vm.gotoDetail = gotoDetail;

        function gotoDetail(type,index) {
            if (type === 'new'){
                $state.go('app.vehicle',{vehicleId:'new'});
            } else if (type === 'detail'){
                $state.go('app.vehicle',{vehicleId:vm.items[index].id});
            }
        }
        function deleteAction(index) {
            ApiServer.vehicleDelete(vm.items[index].id,function (res) {
                toastr.success('删除成功');
                vm.items.splice(index,1);
            },function (err) {
                var errInfo = '操作失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            })
        }
        function getDatas() {
            ApiServer.vehicleGetByOwner(info.id,function (res) {
                vm.items = res.data;
            },function (err) {
                var errInfo = '获取数据失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            });
        }
        getDatas();


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
