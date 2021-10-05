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
    "mu_port": "443", //只可填写一个。如果不填则会按照 偏移端口-> 入口端口 的顺序取值
    "mu_encryption": "none",
    "mu_protocol": "auth_aes128_md5",
    "mu_obfs": "plain",
    "mu_suffix": "cloudfront.net",
    //V2Ray
    "enable_vless": 0,
    "alter_id": "",
    "network": "",
    "security": "",
    "path": "",
    "header": {
        "type": "http",
        "request": {},
        "response": {}
    },
    //Trojan
    "allow_insecure": 0,
    "grpc": 0,
    "servicename": "",
    "enable_xtls": 0,
    "flow": ""
}
```