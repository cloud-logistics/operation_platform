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

`container/api/v1/cloudbox/allsites`

#### 方法： 

`GET`

#### BODY:

`无`

#### 返回：
```
{
    "message": "query sites success",
    "code": "OK",
    "data": {
        "count": 16,
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
                "location": "北京朝阳区堆场",
                "latitude": "39.92111",
                "longitude": "116.46111",
                "site_code": "BJ001",
                "volume": 0,
                "province": 1,
                "nation": 1
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
                "location": "北京海淀区堆场",
                "latitude": "39.92222",
                "longitude": "116.46222",
                "site_code": "BJ002",
                "volume": 0,
                "province": 1,
                "nation": 1
            },
            {
                "id": 3,
                "city": {
                    "id": 2,
                    "city_name": "天津",
                    "state_name": "天津",
                    "nation_name": "中国",
                    "longitude": "117.3616476",
                    "latitude": "39.3433574",
                    "area_name": "亚洲",
                    "culture": "",
                    "taboo": "",
                    "picture_url": "",
                    "sorted_key": "t",
                    "flag": 0,
                    "nation": 1,
                    "province": 2
                },
                "location": "天津堆场",
                "latitude": "39.129951",
                "longitude": "117.193656",
                "site_code": "TJ001",
                "volume": 0,
                "province": 2,
                "nation": 1
            },
            {
                "id": 4,
                "city": {
                    "id": 73,
                    "city_name": "上海",
                    "state_name": "上海",
                    "nation_name": "中国",
                    "longitude": "121.4737021",
                    "latitude": "31.2303904",
                    "area_name": "亚洲",
                    "culture": "",
                    "taboo": "",
                    "picture_url": "",
                    "sorted_key": "s",
                    "flag": 0,
                    "nation": 1,
                    "province": 9
                },
                "location": "上海堆场",
                "latitude": "31.22",
                "longitude": "121.48",
                "site_code": "SH001",
                "volume": 0,
                "province": 9,
                "nation": 1
            },
            {
                "id": 5,
                "city": {
                    "id": 200,
                    "city_name": "广州",
                    "state_name": "广东",
                    "nation_name": "中国",
                    "longitude": "113.264385",
                    "latitude": "23.12911",
                    "area_name": "亚洲",
                    "culture": "",
                    "taboo": "",
                    "picture_url": "",
                    "sorted_key": "g",
                    "flag": 0,
                    "nation": 1,
                    "province": 19
                },
                "location": "广州堆场",
                "latitude": "23.131716",
                "longitude": "113.261870",
                "site_code": "GZ001",
                "volume": 0,
                "province": 19,
                "nation": 1
            },
            {
                "id": 6,
                "city": {
                    "id": 135,
                    "city_name": "青岛",
                    "state_name": "山东",
                    "nation_name": "中国",
                    "longitude": "120.382609",
                    "latitude": "36.067108",
                    "area_name": "亚洲",
                    "culture": "",
                    "taboo": "",
                    "picture_url": "",
                    "sorted_key": "q",
                    "flag": 0,
                    "nation": 1,
                    "province": 15
                },
                "location": "青岛堆场",
                "latitude": "36.07",
                "longitude": "120.33",
                "site_code": "QD001",
                "volume": 0,
                "province": 15,
                "nation": 1
            },
            {
                "id": 7,
                "city": {
                    "id": 140,
                    "city_name": "潍坊",
                    "state_name": "山东",
                    "nation_name": "中国",
                    "longitude": "119.161748",
                    "latitude": "36.706962",
                    "area_name": "亚洲",
                    "culture": "",
                    "taboo": "",
                    "picture_url": "",
                    "sorted_key": "w",
                    "flag": 0,
                    "nation": 1,
                    "province": 15
                },
                "location": "潍坊堆场",
                "latitude": "36.710008",
                "longitude": "119.160459",
                "site_code": "WF001",
                "volume": 0,
                "province": 15,
                "nation": 1
            },
            {
                "id": 8,
                "city": {
                    "id": 149,
                    "city_name": "滨州",
                    "state_name": "山东",
                    "nation_name": "中国",
                    "longitude": "117.970699",
                    "latitude": "37.38198",
                    "area_name": "亚洲",
                    "culture": "",
                    "taboo": "",
                    "picture_url": "",
                    "sorted_key": "b",
                    "flag": 0,
                    "nation": 1,
                    "province": 15
                },
                "location": "滨州堆场",
                "latitude": "37.381072",
                "longitude": "117.970763",
                "site_code": "BZ001",
                "volume": 0,
                "province": 15,
                "nation": 1
            },
            {
                "id": 9,
                "city": {
                    "id": 11,
                    "city_name": "沧州",
                    "state_name": "河北",
                    "nation_name": "中国",
                    "longitude": "116.838834",
                    "latitude": "38.304477",
                    "area_name": "亚洲",
                    "culture": "",
                    "taboo": "",
                    "picture_url": "",
                    "sorted_key": "c",
                    "flag": 0,
                    "nation": 1,
                    "province": 3
                },
                "location": "沧州堆场",
                "latitude": "38.306742",
                "longitude": "116.838607",
                "site_code": "CZ001",
                "volume": 0,
                "province": 3,
                "nation": 1
            },
            {
                "id": 10,
                "city": {
                    "id": 12,
                    "city_name": "廊坊",
                    "state_name": "河北",
                    "nation_name": "中国",
                    "longitude": "116.683752",
                    "latitude": "39.538047",
                    "area_name": "亚洲",
                    "culture": "",
                    "taboo": "",
                    "picture_url": "",
                    "sorted_key": "l",
                    "flag": 0,
                    "nation": 1,
                    "province": 3
                },
                "location": "廊坊堆场",
                "latitude": "39.537800",
                "longitude": "116.684922",
                "site_code": "LF001",
                "volume": 0,
                "province": 3,
                "nation": 1
            }
        ],
        "links": {
            "previous": null,
            "next": "http://127.0.0.1:8000/container/api/v1/cloudbox/allsites?page=2"
        }
    }
}
```