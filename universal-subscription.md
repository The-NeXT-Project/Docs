# 通用订阅

## 使用范例

### SSPanel-UIM 订阅

请求路径
```
/sub/UserSubscriptionKey/all
```

下发范例

```json
{
    "version": "1",
    "sub_name":"SSPanel",
    "user_email":"user@sspanel.org",
    "user_name":"ssp_user",
    "user_class":"999",
    "user_class_expire_date":"1989-06-04 04:00:00",
    "user_total_traffic":"9785653487206",
    "user_used_traffic":"7036874417766",
    "nodes":[
        {
            "name":"SS_Node_1",
            "id":"1",
            "type":"ss",
            "address":"node1.sspanel.org",
            "port":"8388",
            "password":"shadowsocks",
            "encryption":"aes-128-gcm",
            "plugin":"",
            "plugin_option":"",
            "remark":"This is a shadowsocks node."
        }
        {
            "name":"V2Ray_Node_2",
            "id":"2",
            "type":"vmess",
            "address":"node2.sspanel.org",
            "port":"443",
            "uuid":"",
            "alterid":"",
            "security":"auto",
            "flow":"",
            "encryption":"none",
            "network":"",
            "header_type":"",
            "host":"",
            "path":"",
            "tls":"",
            "enable_vless":"",
            "remark":"This is a vmess/vless node."
        },
        {
            "name":"Trojan_Node_3",
            "id":"3",
            "type":"trojan",
            "address":"node4.sspanel.org",
            "host":"node4.sspanel.org",
            "port":"443",
            "uuid":"",
            "security":"tls",
            "mux": "0",
            "transport":"none",
            "transport_plugin":"",
            "transport_method":"",
            "allow_insecure":"0",
            "servicename":"",
            "path":"",
            "remark":"This is a trojan node."
        }
    ]
}
```

### Clash 订阅

请求路径
```
/sub/UserSubscriptionKey/clash
```

与原有订阅系统的 `/link/UserSubscriptionKey?clash=1` 所下发的 yaml 配置等效