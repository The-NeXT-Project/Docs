# 通用订阅

通用订阅是为了解决目前各个协议，各个客户端均采用一套完全独立且不兼容的订阅下发规范，导致在前端适配上往往出现落后于客户端更新、前端每次更新功能均要修改部分/全部的订阅下发部分代码逻辑的情况。在增加开发难度的同时也可能导致部分老旧的协议在缺少文档的情况下无法进行很好的兼容。

## 下发范例

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
        },
        {
            "name":"SSR_Node_2",
            "id":"2",
            "type":"ssr",
            "address":"node2.sspanel.org",
            "port":"8388",
            "password":"shadowsocksr",
            "encryption":"none",
            "protocol":"",
            "protocol_param":"",
            "obfs":"",
            "obfs_param":"",
            "remark":"This is a shadowsocksr node."
        },
        {
            "name":"V2Ray_Node_3",
            "id":"3",
            "type":"v2ray",
            "address":"node3.sspanel.org",
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
            "name":"Trojan_Node_4",
            "id":"4",
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
