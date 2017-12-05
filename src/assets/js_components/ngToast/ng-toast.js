/**
 * Created by xianZJ on 2017/12/5.
 */
(function(){
    angular.module('toastr',[])
        .factory('toastr',toastr);

    toastr.$inject = ['$animate', '$rootScope','$q'];
    function toastr($animate,$rootScope,$q){
        console.log("aaa");

        var containerDefer = $q.defer();

        var toasts = [];

        var toast = {
            error:error,
            success:success,
            info:info,
        };
        return toast;

        function tpl(type,msg){
            var typeMenu = {
                "success":"success",
                "error":"error",
                "info":"info"
            };
            var html = '<div class="ngToast ngToast_' + typeMenu[type]  +' ngToast-bottom-left">'+
                '<div class="ngToast-icon ngToast-icon-' + typeMenu[type] + '">'+
                    '<img src="images/icon_alert_' + typeMenu[type] +'.svg">'+
                '</div>'+
                '<div class="ngToast_text">'+ msg +
                '</div>'+
            '</div>';
            return html;
        }
        function remove(id){
            var child = document.getElementById(id) ;
            if(child){
                child.parentNode.removeChild(child);
            }
        }

        function success(msg){
            container = angular.element(tpl('success',msg));
            container.attr('id', "ngToastSuccess");
            var target = angular.element(document.querySelector("body"));
            if ( ! target || ! target.length) {
                throw 'Target for toasts doesn\'t exist';
            }

            $animate.enter(container, target).then(function() {
                setTimeout(function(){
                    $animate.leave(document.getElementById('ngToastSuccess')).then(function(){
                       remove('ngToastSuccess');
                    })
                },3000)
            });
        }
        function error(msg){
            container = angular.element(tpl('error',msg));
            container.attr('id', "ngToastError");
            var target = angular.element(document.querySelector("body"));
            if ( ! target || ! target.length) {
                throw 'Target for toasts doesn\'t exist';
            }

            $animate.enter(container, target).then(function() {
                var hidden =function(){
                    $animate.leave(document.getElementById('ngToastError')).then(function(){
                        remove('ngToastError');
                    })
                }  ;
                setTimeout(hidden,3000)
            });
        }
        function info(msg){
            container = angular.element(tpl('info',msg));
            container.attr('id', "ngToastInfo");
            var target = angular.element(document.querySelector("body"));

            if ( ! target || ! target.length) {
                throw 'Target for toasts doesn\'t exist';
            }

            $animate.enter(container, target).then(function() {
                var hidden =function(){
                    $animate.leave(document.getElementById('ngToastInfo')).then(function(){
                       remove('ngToastInfo');
                    })
                }  ;
                setTimeout(hidden,3000)
            });
        }
    }
}());

