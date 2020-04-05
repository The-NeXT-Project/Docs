# Trojan 使用教程 - Build by @elrepo

> 详细教程查看 https://docs.trojan.today
授权联系 [@elrepo](https://t.me/elrepo)

### 节点编辑

Server 格式: 
```
google.com;port=1443|host=baidu.com
```

### 配置文件

> webapi.enabled mysql.enabled 同时开启时 优先使用 WEBAPI

| 配置名称 | 简介 |
| :--- | :--- |
| node\_id | 必填，节点 ID，错误的 ID 可能导致节点流量无法结算 |
| node\_class | 选填，允许连接的用户等级\(MYSQL对接必填 |
| node\_group | 选填，允许连接的用户分组\(MYSQL对接必填 |
| run\_type | 固定 `server` |
| webapi.enabled | true\|false |
| webapi.host | 选填，面板API对接地址 |
| webapi.token | 选填，token |
| mysql.enabled | true\|false |
| mysql.server\_addr | 选填，面板数据库 IP 地址 |
| mysql.server\_port | 选填，数据库端口 |
| mysql.database | 选填，数据库名称 |
| mysql.username | 选填，数据库用户名 |
| mysql.password | 选填，数据库密码 |
| mysql.cafile | 选填，数据库连接密钥 |

### 完整示例

```json
{
    "node_id": "203",
    "node_class":"1",
    "node_group":"1",
    "run_type": "server",
    "local_addr": "0.0.0.0",
    "local_port": 443,
    "remote_addr": "127.0.0.1",
    "remote_port": 80,
    "password": [
        
    ],
    "webapi": {
        "enabled": false,
        "host": "https://baidu.com",
        "token": "114514"
    },
    "log_level": 1,
    "ssl": {
        "cert": "/path/to/certificate.crt",
        "key": "/path/to/private.key",
        "key_password": "",
        "cipher": "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384",
        "cipher_tls13": "TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_256_GCM_SHA384",
        "prefer_server_cipher": true,
        "alpn": [
            "http/1.1"
        ],
        "alpn_port_override": {
            "h2": 81
        },
        "reuse_session": true,
        "session_ticket": false,
        "session_timeout": 600,
        "plain_http_response": "",
        "curves": "",
        "dhparam": ""
    },
    "tcp": {
        "prefer_ipv4": false,
        "no_delay": true,
        "keep_alive": true,
        "reuse_port": false,
        "fast_open": false,
        "fast_open_qlen": 20
    },
    "mysql": {
        "enabled": false,
        "server_addr": "127.0.0.1",
        "server_port": 3306,
        "database": "trojan",
        "username": "trojan",
        "password": "",
        "cafile": ""
    }
}
```
### 二进制运行

从 GitHub Releases 选择你需要的版本，下载二进制文件：
```bash 
https://github.com/du5/trojan-releases/releases
```


守护进程

```text
cat <<EOF > /lib/systemd/system/trojan.service
[Unit]
Description=trojan
After=network.target
[Service]
ExecStart=$PWD/trojan -c $PWD/config.json
WorkingDirectory=$PWD
Restart=always
LimitNOFILE=512000
[Install]
WantedBy=multi-user.target
EOF
```

添加自启动

```text
systemctl enable trojan
```

### Docker 运行 

```bash
$ docker run -v /path/config:/config --name=trojan gtary/trojan
```