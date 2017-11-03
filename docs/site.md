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
            
        ],
        "links": {
            "previous": null,
            "next": "http://127.0.0.1:8000/container/api/v1/cloudbox/allsites?page=2"
        }
    }
}
```