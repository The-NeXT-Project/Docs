## 可配置选项一览

```json
{
    //通用
    "offset_port_user": "", //前端/订阅中下发的端口
    "offset_port_node": "", //节点服务器下发的端口
    "server_user": "", //前端/订阅中下发的服务器地址
    "host": "", //SNI
    //Shadowsocks
    "plugin": "", //SIP002插件
    "plugin_option": "", //插件参数
    //V2Ray
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
    "allow_insecure": "0",
    "grpc": "0",
    "servicename": "",
    "enable_xtls": "",
    "flow": "",
    //Trojan-Go
    "mux": "0",
    "transport": "none",
    "transport_plugin": "",
    "transport_method": "",
    //Clash 相关，仅用于 Clash 通用订阅，不影响节点配置下发
    //参考文档 https://dreamacro.github.io/clash/configuration/configuration-reference.html
    "udp": "1",
    "plugin-opts": {
        // 对应 Clash yaml 文件中 plugin-opts 的配置
    },
    "ws-opts": {
        // 对应 Clash yaml 文件中 ws-opts 的配置
    },
    "h2-opts": {
        // 对应 Clash yaml 文件中 h2-opts 的配置
    },
    "http-opts": {
        // 对应 Clash yaml 文件中 http-opts 的配置
    },
    "grpc-opts": {
        // 对应 Clash yaml 文件中 grpc-opts 的配置
    }
}
```

# Vmess

## tcp示例

``` json
{
    "offset_port_node": "12345",
    "server_sub": "hk.domain.com",
    "alter_id": "0",
    "network": "tcp",
    "security": "none",
}
```

## tcp+http示例

```json
{
    "offset_port_node": "12345",
    "server_sub": "hk.domain.com",
    "alter_id": "0",
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
    "alter_id": "0",
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
    "alter_id": "0",
    "network": "ws",
    "security": "none",
    "path": "/some_path"
}
```

## ws+tls示例

```json
{
    "offset_port_node": "443",
    "server_sub": "hk.domain.com",
    "host": "hk.domain.com",
    "alter_id": "0",
    "network": "ws",
    "security": "tls",
    "path": "/some_path"
}
```

## grpc+tls示例

```json
{
    "offset_port_node": "443",
    "server_sub": "hk.domain.com",
    "host": "hk.domain.com",
    "alter_id": "0",
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
    "alter_id": "0",
    "network": "tcp",
    "security": "none",
}
```

此时用户连接端口为8888，节点监听端口为12345

# Trojan

## tcp示例

``` json
{
    "offset_port_node": "443",
    "server_sub": "hk.domain.com",
    "host": "hk.domain.com"
}
```

## ws示例

``` json
{
    "offset_port_node": "443",
    "server_sub": "hk.domain.com",
    "host": "hk.domain.com",
    "network": "ws",
    "path": "/some_path"
}
```

## grpc示例

``` json
{
    "offset_port_node": "443",
    "server_sub": "hk.domain.com",
    "host": "hk.domain.com",
    "network": "grpc",
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

# Shadowsocks 2022

``` json
{
    "offset_port_node": 8080,
    "method": "2022-blake3-aes-128-gcm",
    "server_key": "zP6flOl9PSsHr019zGSV6Q=="
}
```

# TUIC

``` json
{
    "offset_port_node": 8443,
    "host": "server_name",
    "insecure": false,
}
```
