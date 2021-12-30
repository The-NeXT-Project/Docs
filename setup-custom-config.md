# 自定义配置使用教程

## 可配置选项一览

```json
{
    //通用
    "offset_port_user": "", //前端/订阅中下发的端口
    "offset_port_node": "", //节点服务器下发的端口
    "server_user": "", //前端/订阅中下发的服务器地址
    "host": "", //SNI
	//SS
	"plugin": "", //SS插件
	"plugin_option": "", //SS插件参数
    //SSR单端口多用户
    "mu_port": "443", //只可填写一个。如果不填则会按照 节点服务器下发的端口 -> 前端/订阅中下发的端口 的顺序取值
	"mu_password": "xxxxxx",//單端口密碼
    "mu_encryption": "none",
    "mu_protocol": "auth_aes128_md5",
    "mu_obfs": "plain",
    "mu_suffix": "cloudfront.net",
    //V2Ray
    "v2_port": "",
    "tls": "0",
    "enable_vless": "0",
    "alter_id": "",
    "network": "",
    "security": "",
	"encryption":"",
    "path": "",
    "verify_cert": "true",
    "obfs":"",
    "header": {
        "type": "http",
        "request": {},
        "response": {}
    },
    //Trojan
    "trojan_port": "",
    "allow_insecure": "0",
    "grpc": "0",
    "servicename": "",
    "enable_xtls": "",
    "flow": "",
	//Trojan-Go
	"mux": "0",
	"transport": "none",
	"transport_plugin": "",
	"transport_method": ""
}
```

# V2ray

## tcp示例

``` json
{
	"offset_port_node": "12345",
	"server_sub": "hk.domain.com",
	"alter_id": "2",
	"network": "tcp",
	"security": "none",
}
```

## tcp+http示例

```json
{
	"offset_port_node": "12345",
	"server_sub": "hk.domain.com",
	"alter_id": "2",
	"network": "tcp",
	"security": "none",
	"header": {
        "type": "http",
        "request": {
            "path": ["/"],
  			"headers": {
    			"Host": ["www.baidu.com"]
            }
        },
        "response": {}
    }
}
```

## tcp+tls示例

```json
{
	"offset_port_node": "443",
	"server_sub": "hk.domain.com",
	"host": "hk.domain.com",
	"alter_id": "2",
	"network": "tcp",
	"security": "tls",
}
```

## ws示例

```json
{
	"offset_port_node": "80",
	"server_sub": "hk.domain.com",
	"host": "hk.domain.com",
	"alter_id": "2",
	"network": "ws",
	"security": "none",
	"path": "/v2ray"
}
```

## ws+tls示例

```json
{
	"offset_port_node": "443",
	"server_sub": "hk.domain.com",
	"host": "hk.domain.com",
	"alter_id": "2",
	"network": "ws",
	"security": "tls",
	"path": "/v2ray"
}
```

## grpc+tls示例

```json
{
	"offset_port_node": "443",
	"server_sub": "hk.domain.com",
	"host": "hk.domain.com",
	"alter_id": "2",
	"network": "grpc",
	"security": "tls",
	"servicename": "some_name"
}
```

## 中转端口示例
在任一配置中设置 `offset_port_user` 为用户连接端口

``` json
{
	"offset_port_user": "8888",
	"offset_port_node": "12345",
	"server_sub": "hk.domain.com",
	"alter_id": "2",
	"network": "tcp",
	"security": "none",
}
```

此时用户连接端口为8888，节点监听端口为12345

## 启用vless
在任一配置中设置 `enable_vless: 1` 为用户连接端口

``` json
{
	"offset_port_node": "443",
	"server_sub": "hk.domain.com",
	"host": "hk.domain.com",
	"alter_id": "2",
	"network": "tcp",
	"security": "tls",
	"enable_vless": "1"
}
```
请开启vless同时务必使用tls或者xtls。

## 启用xtls
在任一配置中设置 `security: xtls`。

``` json
{
	"offset_port_node": "443",
	"server_sub": "hk.domain.com",
	"host": "hk.domain.com",
	"alter_id": "2",
	"network": "tcp",
	"security": "xtls",
	"enable_vless": "1"
}
```

# Trojan

## tcp示例

``` json
{
	"offset_port_node": "443",
	"server_sub": "hk.domain.com",
	"host": "hk.domain.com"
}
```

## grpc示例

``` json
{
	"offset_port_node": "443",
	"server_sub": "hk.domain.com",
	"host": "hk.domain.com",
	"grpc": "1",
	"servicename": "some_name"
}
```

## 中转示例
在任一配置中设置 `offset_port_user` 为用户连接端口
``` json
{
	"offset_port_user": "443",
	"offset_port_node": "12345",
	"server_sub": "hk.domain.com",
	"host": "hk.domain.com"
}
```
此时用户连接443，节点监听12345

## 启用xtls

在任一配置中设置 `enable_xtls: 1`。

``` json
{
	"offset_port_node": "443",
	"server_sub": "hk.domain.com",
	"host": "hk.domain.com",
	"enable_xtls": "1"
}
```