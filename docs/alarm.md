## 告警API

### 1. 查询告警

#### 方法：
 
`GET`

#### URL：

`127.0.0.1:8000/container/api/v1/cloudbox/monservice/alerts/container_id/alert_type_id?limit=10&offset=0`

#### URL参数:

```
container_id:  云箱id，查询全部时传all
alert_type_id: 告警类型id

```

#### 响应：

```
{
    "message": "query alarm success",
    "code": "OK",
    "data": {
        "count": 1,
        "limit": 10,
        "results": [
            {
                "error_description": "温度过高",
                "location_name": "",
                "timestamp": 1510306145000,
                "deviceid": "01-03-17-09-00-24",
                "level": 1,
                "code": 1001,
                "status": "",
                "carrier": 1,
                "longitude": "0",
                "latitude": "0",
                "speed": "0",
                "temperature": "19.1",
                "humidity": "74.3",
                "num_of_collide": "0",
                "num_of_door_open": "0",
                "battery": "0.8",
                "robert_operation_status": "装货",
                "alarm_status": 1,
                "endpointid": "01-03-17-09-00-24"
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
