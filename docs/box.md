## 云箱API

### 1. 增加云箱

#### 方法：
 
`POST`

#### URL：

`container/api/v1/cloudbox/basicInfoConfig`

#### BODY:

```
 {
    "rfid":"12345",
    "containerType":1,
    "factory":3,
    "factoryLocation":3,
    "batteryInfo":1,
    "hardwareInfo":1,
    "manufactureTime":"1509431998000"
 }
```

#### 响应：

```
{
    "status": "OK",
    "msg": "add box success"
}
```

```
{
    "status": "ERROR",
    "msg": "error msg"
}
```

### 2. 编辑云箱：

#### URL：

`container/api/v1/cloudbox/basicInfoMod`

#### 方法： 

`PUT`

#### BODY:

```
 {
    "containerId": "HNAR0000170",
    "rfid":"666",
    "containerType":1,
    "factory":3,
    "factoryLocation":3,
    "batteryInfo":1,
    "hardwareInfo":1,
    "manufactureTime":"1509431778000"
 }
 ```
 
#### 返回：

```
{
    "status": "OK",
    "msg": "modify box success"
}
```

### 3. 删除云箱：

#### URL： 

`container/api/v1/cloudbox/basicInfo/{container_id}`

#### 方法： 

`DELETE`

#### BODY:

`无`

#### 返回：
```
{
    "status": "OK",
    "msg": "delete box success"
}
```


### 4. 基础信息查询：

#### URL： 

`container/api/v1/cloudbox/monservice/basicInfo?container_id=01-03-17-09-00-1E&container_type=0&factory=0&start_time=0&end_time=0&limit=10&offset=0`

#### URL参数:

```
container_id:  云箱id，查询全部时传all
container_type: 云箱类型id，查询全部时传0
factory: 生产厂家id，查询全部时传0
start_time: 开始时间，不限制开始时间传0
end_time: 结束时间，不限制结束时间传0

```

#### 方法： 

`GET`

#### BODY:

`无`

#### 返回：
```
{
    "message": "query alarm success",
    "code": "OK",
    "data": {
        "count": 1,
        "limit": 10,
        "results": [
            {
                "deviceid": "HNAF0000031",
                "tid": "2322",
                "date_of_production": "1483315200000",
                "box_type_name": "冷冻箱",
                "produce_area": "广东省深圳市龙岗区",
                "manufacturer": "深圳市万引力工程技术有限公司",
                "battery_detail": "万引力电源",
                "box_type_id": 2,
                "produce_area_id": 1,
                "manufacturer_id": 1,
                "battery_id": 1,
                "hardware_detail": "万引力智能硬件",
                "hardware_id": 1
            }
        ],
        "links": {
            "previous": null,
            "next": null
        },
        "offset": 0
    }
}```


### 5. 查询云箱安全参数：

#### URL：

`container/api/v1/cloudbox/monservice/safeSettings/1`

#### 方法： 

`GET`

#### BODY:

```
无 
```
 
#### 返回：

```
{
    "status": "OK",
    "msg": "get box safe settings success",
    "box_type": {
        "id": 1,
        "box_type_name": "冷藏箱",
        "box_type_detail": "",
        "interval_time": 30,
        "temperature_threshold_min": -30,
        "temperature_threshold_max": 0,
        "humidity_threshold_min": 3,
        "humidity_threshold_max": 500,
        "collision_threshold_min": 0,
        "collision_threshold_max": 100,
        "battery_threshold_min": 0,
        "battery_threshold_max": 1,
        "operation_threshold_min": 0,
        "operation_threshold_max": 500,
        "price": 10,
        "length": 11,
        "width": 1.2,
        "height": 0.8
    }
}
```

### 6. 修改云箱安全参数：

#### URL：

`container/api/v1/cloudbox/monservice/safeSettings/1/`

#### 方法： 

`PUT`

#### BODY:

```
 {
        "interval_time": 30,
        "temperature_threshold_min": -30,
        "temperature_threshold_max": 0,
        "humidity_threshold_min": 3,
        "humidity_threshold_max": 500,
        "collision_threshold_min": 0,
        "collision_threshold_max": 100,
        "battery_threshold_min": 0,
        "battery_threshold_max": 1,
        "operation_threshold_min": 0,
        "operation_threshold_max": 500
}
```
 
#### 返回：

```
{
    "status": "OK",
    "msg": "save box safe settings success"
}
```


### 7. 查询所有类型云箱安全参数：

#### URL：

`container/api/v1/cloudbox/monservice/safeSettings`

#### 方法： 

`GET`

#### BODY:

```
无 
```
 
#### 返回：

```
{
    "status": "OK",
    "msg": "get all box safe settings success",
    "box_types": [
        {
            "id": 1,
            "box_type_name": "冷藏箱",
            "box_type_detail": "",
            "interval_time": 30,
            "temperature_threshold_min": -30,
            "temperature_threshold_max": 0,
            "humidity_threshold_min": 3,
            "humidity_threshold_max": 500,
            "collision_threshold_min": 0,
            "collision_threshold_max": 100,
            "battery_threshold_min": 0,
            "battery_threshold_max": 1,
            "operation_threshold_min": 0,
            "operation_threshold_max": 500,
            "price": 10,
            "length": 11,
            "width": 1.2,
            "height": 0.8
        },
        {
            "id": 2,
            "box_type_name": "冷冻箱",
            "box_type_detail": "",
            "interval_time": 30,
            "temperature_threshold_min": -30,
            "temperature_threshold_max": 40,
            "humidity_threshold_min": 3,
            "humidity_threshold_max": 500,
            "collision_threshold_min": 0,
            "collision_threshold_max": 100,
            "battery_threshold_min": 0,
            "battery_threshold_max": 1,
            "operation_threshold_min": 0,
            "operation_threshold_max": 500,
            "price": 20,
            "length": 11,
            "width": 1.2,
            "height": 0.8
        },
        {
            "id": 3,
            "box_type_name": "医药箱",
            "box_type_detail": "",
            "interval_time": 30,
            "temperature_threshold_min": 2,
            "temperature_threshold_max": 25,
            "humidity_threshold_min": 0,
            "humidity_threshold_max": 30,
            "collision_threshold_min": 0,
            "collision_threshold_max": 100,
            "battery_threshold_min": 0,
            "battery_threshold_max": 100,
            "operation_threshold_min": 0,
            "operation_threshold_max": 100,
            "price": 30,
            "length": 11,
            "width": 1.2,
            "height": 0.8
        },
        {
            "id": 4,
            "box_type_name": "普通箱",
            "box_type_detail": "",
            "interval_time": 30,
            "temperature_threshold_min": 2,
            "temperature_threshold_max": 8,
            "humidity_threshold_min": 0,
            "humidity_threshold_max": 30,
            "collision_threshold_min": 0,
            "collision_threshold_max": 100,
            "battery_threshold_min": 0,
            "battery_threshold_max": 100,
            "operation_threshold_min": 0,
            "operation_threshold_max": 100,
            "price": 50,
            "length": 11,
            "width": 1.2,
            "height": 0.8
        },
        {
            "id": 5,
            "box_type_name": "特殊箱",
            "box_type_detail": "",
            "interval_time": 30,
            "temperature_threshold_min": -30,
            "temperature_threshold_max": 50,
            "humidity_threshold_min": 0,
            "humidity_threshold_max": 30,
            "collision_threshold_min": 0,
            "collision_threshold_max": 100,
            "battery_threshold_min": 0,
            "battery_threshold_max": 100,
            "operation_threshold_min": 0,
            "operation_threshold_max": 100,
            "price": 15,
            "length": 11,
            "width": 1.2,
            "height": 0.8
        }
    ]
}
```

### 8. 状态汇总：

#### URL： 

`container/api/v1/cloudbox/monservice/boxStatus?container_id=all&container_type=1&location_id=0&limit=10&offset=0`

#### URL参数:

```
container_id:  云箱id，查询全部时传all
container_type: 云箱类型id，查询全部时传0
location_id: 堆场id，查询全部时传0

```

#### 方法： 

`GET`

#### BODY:

`无`

#### 返回：
```
{
    "message": "query alarm success",
    "code": "OK",
    "data": {
        "count": 1,
        "limit": 10,
        "results": [
            {
                "deviceid": "01-03-17-09-00-21",
                "longitude": "114.053531",
                "latitude": "22.533053",
                "speed": "0.000569611787796",
                "temperature": "24.8",
                "humidity": "80.7",
                "collide": "0",
                "num_of_door_open": 5,
                "available_status":"",
                "robot_operation_status": "装箱",
                "battery": 0,
                "location_name": "中国广东省深圳市福田区福田ＣＢＤ民田路86号-94号 邮政编码: 518000",
                "available_status": "可用"
            }
        ],
        "links": {
            "previous": null,
            "next": null
        },
        "offset": 0
    }
}
```


### 9. 查询云箱历史轨迹：

#### URL：

`container/api/v1/cloudbox/monservice/historypath/?deviceid=01-03-17-09-00-21&start_time=1510628670&end_time=1510637070`

#### 方法： 

`GET`

#### BODY:

```
无 
```
 
#### 返回：

```
{
    "status": "OK",
    "msg": "get history path success",
    "path": [
        {
            "timestamp": 1510628670,
            "longitude": "114.053531",
            "latitude": "22.533053"
        },
        {
            "timestamp": 1510629270,
            "longitude": "114.053531",
            "latitude": "22.533053"
        },
        {
            "timestamp": 1510629870,
            "longitude": "114.053531",
            "latitude": "22.533053"
        },
        {
            "timestamp": 1510630470,
            "longitude": "114.053531",
            "latitude": "22.533053"
        },
        {
            "timestamp": 1510631070,
            "longitude": "114.053531",
            "latitude": "22.533053"
        },
        {
            "timestamp": 1510631670,
            "longitude": "114.053531",
            "latitude": "22.533053"
        },
        {
            "timestamp": 1510632270,
            "longitude": "114.053531",
            "latitude": "22.533053"
        },
        {
            "timestamp": 1510632870,
            "longitude": "114.053531",
            "latitude": "22.533053"
        }
    ]
}

```
