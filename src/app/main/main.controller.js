/**
 * app main controller
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('MainController', MainController);

    /** @ngInject */
    function MainController($rootScope, $translate, $location, constdata,$state, toastr, $scope) {
        /* jshint validthis: true */
        var vm = this;
        var url = $location.absUrl();
        var theme_11 = {
            themeID: 11,
            navbarHeaderColor: 'bg-dark b-r',
            navbarCollapseColor: 'bg-white',
            asideColor: 'bg-dark b-r',
            headerFixed: true,
            asideFixed: true,
            asideFolded: false,
            asideDock: false,
            container: false
        };
        // config
        $scope.app = {
            name: 'airswitchNav cc',
            version: '0.0.1',
            // for chart colors
            color: {
                primary: '#7266ba',
                info: '#23b7e5',
                success: '#27c24c',
                warning: '#fad733',
                danger: '#f05050',
                light: '#e8eff0',
                dark: '#3a3f51',
                black: '#1c2b36'
            },
            settings: theme_11
        };
        // angular translate
        $scope.lang = {isopen: false};
        $scope.langs = {'en-us': 'English', 'zh-cn': '中文'};
        $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "中文";
        $scope.setLang = function (langKey, $event) {
            // set the current lang
            $scope.selectLang = $scope.langs[langKey];
            // You can change the language during runtime
            $translate.use(langKey);
            $scope.lang.isopen = !$scope.lang.isopen;
        };

        vm.awesomeThings = [];
        vm.classAnimation = '';
        vm.creationDate = 1452231070467;
        vm.showToastr = showToastr;

        function showToastr() {
            toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
            vm.classAnimation = '';
        }
        if(!$location.$$url){
            $state.go('app.siteoverview');
        }

        setTimeout(function(){
            $(".nav").find(".active").parent().parent().addClass("active")
        },500)


        $scope.$on('showDelMsg',function(d,opt){
            $scope.$emit("scrollTop");
            $scope.showDelMsg = true;
            $scope.okFn = function(){
                opt.okFn();
                $scope.showDelMsg = false;
            };
            $scope.cancelFn = opt.cancelFn || function(){
                $scope.showDelMsg = false;
            };
        });

        $scope.$on("scrollTop",function(){
            if(constdata.isChrome()){
                $("body").scrollTop(0);                    //chrome
            }else if(constdata.isIE() || constdata.isFirefox()){
                document.documentElement.scrollTop = 0;   //firefox
            }else{
                window.pageYOffset = 0;                   //safari
            }
        });

        $scope.$on("mapResize",function(d,opt){
            console.log("main mapResize");
            $scope.$broadcast("mapResize_from_main_to_children");
        })
    }
})();
