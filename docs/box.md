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


### 4. 查询云箱安全参数：

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

### 5. 修改云箱安全参数：

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
