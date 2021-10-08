# 自定义配置使用教程

## 可配置选项一览

```json
{
    //通用
    "offset_port_user": "", //前端/订阅中下发的端口
    "offset_port_node": "", //节点服务器下发的端口
    "server_sub": "", //前端/订阅中下发的服务器地址
    "host": "", //SNI
    //SSR单端口多用户
    "mu_port": "443", //只可填写一个。如果不填则会按照 节点服务器下发的端口 -> 前端/订阅中下发的端口 的顺序取值
    "mu_encryption": "none",
    "mu_protocol": "auth_aes128_md5",
    "mu_obfs": "plain",
    "mu_suffix": "cloudfront.net",
    //V2Ray
    "v2_port": "",
    "tls": 0,
    "enable_vless": 0,
    "alter_id": "",
    "network": "",
    "security": "",
    "path": "",
    "verify_cert": true,
    "obfs":"",
    "header": {
        "type": "http",
        "request": {},
        "response": {}
    },
    //Trojan
    "trojan_port": "",
    "allow_insecure": 0,
    "grpc": 0,
    "servicename": "",
    "enable_xtls": "",
    "flow": ""
}
```