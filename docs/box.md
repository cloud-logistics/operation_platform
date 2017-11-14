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
                "deviceid": "HNAF0000284",
                "tid": "124",
                "date_of_production": "1509431998000",
                "box_type_name": "冷冻箱",
                "produce_area": "广东省深圳市龙岗区",
                "manufacturer": "深圳市万引力工程技术有限公司"
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