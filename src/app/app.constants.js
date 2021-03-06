/* global angular:false, malarkey:false, moment:false */
(function () {
    'use strict';

    // Constants used by the entire app
    angular.module('smart_container')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('constdata', {
            debugMode: (location.hostname == "localhost"),//http://52.80.40.26:9090/
            logLevel: 111111,//控制log显示的级别（0不显示,1显示）,从左到右每位分别代表[error,warn,info,debug,log]
            apiHost_ONLINE:  "http://" + location.host + '/container/api/v1/cloudbox/monservice/', //http://54.223.162.108:9090/ production1
            apiHost_OFFLINE:'http://106.2.20.187/container/api/v1/cloudbox/monservice/', //http://54.223.162.108:9090/ production1
            //apiHost_OFFLINE:'http://localhost:4000/container/api/v1/cloudbox/',
            token:'airspc_access_authorization',
            informationKey:'airspc_information',
            refreshInterval: 300000,
            //defaultContainerId : '01-03-17-09-00-20',
            defaultContainerId : '01-03-17-09-00-21',
            api:{
                resource:{
                    vehicle:'resource/vehicle',
                    shippingSchedule:'resource/shippingschedule',
                    container:'resource/container',
                    transportTask:'resource/transporttask'
                },
                overview: {
                    satelites: 'satellites',
                    containers: "containers",
                    pipelines: "pipelines",
                    alertLevel:"alertLevel"
                },
                auth:'auth',
                logout:'logout',
                containerhistory : "containerhistory",
                containerInstantInfo : "containerInstantInfo",
                containerReportHistory : "containerReportHistory",
                containerHistoryStatus : "containerHistoryStatus",
                basicInfoManage : "basicInfoManage",
                issueInfo : "issueInfo",
                repairInfo : "repairInfo",
                basicInfoConfig : "basicInfoConfig",
                editBoxBasic:"basicInfoMod",
                deleteBoxBasic:"basicInfo/{container_id}/",
                securityConfig : "securityConfig",
                repairConfig : "repairConfig",
                issueConfig : "issueConfig",
                alerts : "alerts",
                basicInfo : "basicInfo",
                boxStatus : "boxStatus",
                realtimeInfo : "realtimeInfo",
                options : "options",
                carriers : "carriers",
                newcarrier : "newcarrier",
                mycontainers : "mycontainers",
                availablecontainers : "availablecontainers",
                containersonlease : "containersonlease",
                requestlease : "requestlease",
                returncontainer : "returncontainer",
                command : "command",
                analysisresult : "analysisresult",
                operationoverview : "operationoverview",
                user:'user',
                message:'message',
                allsites:"allsites",
                countryList:"nationlist",
                provinceList:"/provincelist/",
                cityList:"/citylist/",
                getPosition:"/getPosition",
                historypath: "historypath",

                getDeviceIds :"/fuzzyDeviceid",
                //仓库部分的api
                warehouse:{
                    create:"/sites",
                    retrieve:'/allsites?limit={limit}&offset={offset}',
                    update:"/sites/",
                    delete:"/sites/",
                    allsites:'/allsites?page=',
                    boxbysite: 'boxbysite/{id}?limit={limit}&offset={offset}',
                    siteStream: 'siteStream/'
                },
                safeSetting:"safeSettings",
                resetSafeSetting:"safeSettings/{id}/",
                dispatchInfo:"dispatch",
                distribution:"/distribution"
            },
            routeName:{
                "app.dashboard":"全景展示",
                "app.mapview":"地图展示",
                "app.signin":"登陆"
            },
            map:{
                mapStyle: {
                    features: ["road", "building","water","land"],//隐藏地图上的poi
                    style : "light"  //设置地图风格为高端黑
                }
            },
            validation:{
                'id' : /^[A-Za-z0-9-]+$/,
                'rfid':/^[A-Za-z0-9-_]+$/
            },
            isIE:function(){
                var UA = window.navigator.userAgent.toLowerCase();
                var isIe = UA && /msie|trident/.test(UA);
                return isIe;
            },
            isChrome:function(){
                var UA = window.navigator.userAgent.toLowerCase();
                var isEdge = UA && UA.indexOf('edge/') > 0;
                var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
                return isChrome;
            },
            isFirefox:function(){
                var UA = window.navigator.userAgent.toLowerCase();
                var isFirefox = UA.indexOf("firefox") > -1;
                return isFirefox;
            }
        });
})();
