## 仓库API

### 1. 增加仓库

#### 方法：

`POST`

#### URL：

`container/api/v1/cloudbox/sites`

#### BODY:

```
 {
	"location": "西安堆场",
	"longitude": "120.0000",
	"latitude": "30.0000",
	"site_code": "",
	"volume": 500,
	"city_id": 1,
	"province_id": 1,
	"nation_id": 1
}
```

#### 响应：

```
{
    "status": "OK",
    "msg": "add site success"
}
```

```
{
    "status": "ERROR",
    "msg": "error msg"
}
```

### 2. 修改仓库：

#### URL：

`container/api/v1/cloudbox/sites/{site_id}`

#### 方法：

`PUT`

#### BODY:

```
{
	"location": "测试666",
	"longitude": "120.00",
	"latitude": "30.00",
	"site_code": "",
	"volume": 500,
	"city_id": 1,
	"province_id": 1,
	"nation_id": 1
}
 ```

#### 返回：

```
{
    "status": "OK",
    "msg": "modify site success"
}
```


### 3. 删除仓库：

#### URL：

`container/api/v1/cloudbox/sites/{site_id}`

#### 方法：

`DELETE`

#### BODY:

`无`

#### 返回：
```
{
    "status": "OK",
    "msg": "delete site success"
}
```

### 4. 查询仓库：

#### URL：

`container/api/v1/cloudbox/allsites?page=2`

#### 方法：

`GET`

#### BODY:



#### 返回：
```
{
    "message": "query sites success",
    "code": "OK",
    "data": {
        "count": 20,
        "num_pages": 2,
        "results": [
            {
                "id": 1,
                "city": {
                    "id": 1,
                    "city_name": "北京",
                    "state_name": "北京",
                    "nation_name": "中国",
                    "longitude": "116.4073963",
                    "latitude": "39.9041999",
                    "area_name": "亚洲",
                    "culture": "",
                    "taboo": "",
                    "picture_url": "",
                    "sorted_key": "b",
                    "flag": 0,
                    "nation": 1,
                    "province": 1
                },
                "province": {
                    "province_id": 1,
                    "province_name": "北京市",
                    "zip_code": "110000",
                    "nation": 1
                },
                "nation": {
                    "nation_id": 1,
                    "nation_name": "中国",
                    "pic_url": "http://ouq3fowh7.bkt.clouddn.com/%E5%9B%BD%E5%86%85.png",
                    "sorted_key": "z"
                },
                "location": "北京朝阳区堆场",
                "latitude": "39.92111",
                "longitude": "116.46111",
                "site_code": "BJ001",
                "volume": 0
            },
            {
                "id": 2,
                "city": {
                    "id": 1,
                    "city_name": "北京",
                    "state_name": "北京",
                    "nation_name": "中国",
                    "longitude": "116.4073963",
                    "latitude": "39.9041999",
                    "area_name": "亚洲",
                    "culture": "",
                    "taboo": "",
                    "picture_url": "",
                    "sorted_key": "b",
                    "flag": 0,
                    "nation": 1,
                    "province": 1
                },
                "province": {
                    "province_id": 1,
                    "province_name": "北京市",
                    "zip_code": "110000",
                    "nation": 1
                },
                "nation": {
                    "nation_id": 1,
                    "nation_name": "中国",
                    "pic_url": "http://ouq3fowh7.bkt.clouddn.com/%E5%9B%BD%E5%86%85.png",
                    "sorted_key": "z"
                },
                "location": "北京海淀区堆场",
                "latitude": "39.92222",
                "longitude": "116.46222",
                "site_code": "BJ002",
                "volume": 0
            }
        ],
        "links": {
            "previous": null,
            "next": "http://127.0.0.1:8000/container/api/v1/cloudbox/allsites?page=2"
        }
    }
}
```


### 5. 根据仓库查询箱子：

#### URL：

`container/api/v1/cloudbox/boxbysite/1`

#### 方法：

`GET`

#### BODY:



#### 返回：
```
{
    "message": "query sites box success",
    "code": "OK",
    "data": {
        "count": 2,
        "limit": 10,
        "results": [
            {
                "deviceid": "HNAF0000284",
                "type": {
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
                "manufacturer": {
                    "id": 1,
                    "name": "深圳市万引力工程技术有限公司"
                },
                "produce_area": {
                    "id": 1,
                    "address": "广东省深圳市龙岗区"
                },
                "hardware": {
                    "id": 1,
                    "hardware_detail": "万引力智能硬件"
                },
                "battery": {
                    "id": 1,
                    "battery_detail": "万引力电源"
                },
                "siteinfo": {
                    "id": 1,
                    "city": {
                        "id": 1,
                        "city_name": "北京",
                        "state_name": "北京",
                        "nation_name": "中国",
                        "longitude": "116.4073963",
                        "latitude": "39.9041999",
                        "area_name": "亚洲",
                        "culture": "",
                        "taboo": "",
                        "picture_url": "",
                        "sorted_key": "b",
                        "flag": 0,
                        "nation": 1,
                        "province": 1
                    },
                    "location": "北京朝阳区堆场",
                    "latitude": "39.92111",
                    "longitude": "116.46111",
                    "site_code": "BJ001",
                    "volume": 0,
                    "province": 1,
                    "nation": 1
                },
                "date_of_production": "1509431998000",
                "carrier": 1,
                "tid": "124",
                "ava_flag": "Y"
            },
            {
                "deviceid": "HNAR0000247",
                "type": {
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
                "manufacturer": {
                    "id": 1,
                    "name": "深圳市万引力工程技术有限公司"
                },
                "produce_area": {
                    "id": 1,
                    "address": "广东省深圳市龙岗区"
                },
                "hardware": {
                    "id": 1,
                    "hardware_detail": "万引力智能硬件"
                },
                "battery": {
                    "id": 1,
                    "battery_detail": "万引力电源"
                },
                "siteinfo": {
                    "id": 1,
                    "city": {
                        "id": 1,
                        "city_name": "北京",
                        "state_name": "北京",
                        "nation_name": "中国",
                        "longitude": "116.4073963",
                        "latitude": "39.9041999",
                        "area_name": "亚洲",
                        "culture": "",
                        "taboo": "",
                        "picture_url": "",
                        "sorted_key": "b",
                        "flag": 0,
                        "nation": 1,
                        "province": 1
                    },
                    "location": "北京朝阳区堆场",
                    "latitude": "39.92111",
                    "longitude": "116.46111",
                    "site_code": "BJ001",
                    "volume": 0,
                    "province": 1,
                    "nation": 1
                },
                "date_of_production": "1509431998000",
                "carrier": 1,
                "tid": "123",
                "ava_flag": "Y"
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


### 6. 查询仓库箱子流水：

#### URL：

`container/api/v1/cloudbox/siteStream/1`

#### 方法：

`GET`

#### BODY:

`无`

#### 返回：

```
{
    "siteHistory": [
        {
            "timestamp": "2017-11-03 12:37:27",
            "box_id": "HNAF0000284",
            "type": "入库"
        },
        {
            "timestamp": "2017-11-03 12:38:51",
            "box_id": "HNAR0000247",
            "type": "出库"
        }
    ],
    "site_id": "1"
}
```


### 7. 查询仓库调度：

#### URL：

`container/api/v1/cloudbox/dispatch`

#### 方法：

`GET`

#### BODY:

`无`

#### 返回：

```
{
    "status": "OK",
    "msg": "query dispatches success",
    "dispatches": [
        {
            "did": 2,
            "start": {
                "id": 1,
                "location": "北京朝阳区堆场",
                "site_code": "BJ001"
            },
            "finish": {
                "id": 2,
                "location": "北京海淀区堆场",
                "site_code": "BJ002"
            },
            "count": 2,
            "status": "undispatch",
            "create_date": "2017-11-03"
        },
        {
            "did": 3,
            "start": {
                "id": 1,
                "location": "北京朝阳区堆场",
                "site_code": "BJ001"
            },
            "finish": {
                "id": 3,
                "location": "天津堆场",
                "site_code": "TJ001"
            },
            "count": 3,
            "status": "undispatch",
            "create_date": "2017-11-03"
        }
    ]
}
```




