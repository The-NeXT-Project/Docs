## List of configurable options

```json
{
    //generic
    "offset_port_user": "", //port in subscription
    "offset_port_node": "", //Port in node server
    "host": "", //SNI
    //Shadowsocks
    "plugin": "", //SIP002 plugin
    "plugin_option": "", //plugin parameters
    //Shadowsocks 2022
    "method": "",
    "server_key": "",
    //Vmess
    "tls": "0",
    "allow_insecure": "0",
    "network": "",
    "security": "",
    "encryption":"",
    "path": "",
    "header": {
        "type": "http",
        "request": {},
        "response": {}
    },
    //Trojan
    "allow_insecure": "0",
    "servicename": "",
    "mux": "0",
    "network": "",
    "path": "",
    "header": {
        "type": "http",
        "request": {},
        "response": {}
    },
    //Clash related, only used for Clash Universal Subscription, does not affect node configuration distribution
    //Refer to the documentation at https://github.com/MetaCubeX/mihomo/blob/Alpha/docs/config.yaml
    "udp": "1",
    "plugin-opts": {
        // Corresponds to the plugin-opts configuration in the Clash Yaml file.
    },
    "ws-opts": {
        // Corresponds to the ws-opts configuration in the Clash Yaml file.
    },
    "h2-opts": {
        // Corresponds to the h2-opts configuration in the Clash Yaml file.
    },
    "http-opts": {
        // Corresponds to the http-opts configuration in the Clash Yaml file.
    },
    "grpc-opts": {
        // Corresponds to the grpc-opts configuration in the Clash Yaml file.
    }
}
```

# Vmess

## tcp

``` json
{
    "offset_port_node": "12345",
    "network": "tcp",
}
```

## tcp+tls

```json
{
    "offset_port_node": "443",
    "host": "hk.domain.com",
    "network": "tcp",
    "security": "tls",
}
```

## ws

```json
{
    "offset_port_node": "80",
    "host": "hk.domain.com",
    "network": "ws",
    "path": "/some_path"
}
```

## ws+tls

```json
{
    "offset_port_node": "443",
    "host": "hk.domain.com",
    "network": "ws",
    "security": "tls",
    "path": "/some_path"
}
```

## grpc+tls

```json
{
    "offset_port_node": "443",
    "host": "hk.domain.com",
    "network": "grpc",
    "security": "tls",
    "servicename": "some_name"
}
```



# Trojan

## tcp

``` json
{
    "offset_port_node": "443",
    "host": "hk.domain.com"
}
```

## ws

``` json
{
    "offset_port_node": "443",
    "host": "hk.domain.com",
    "network": "ws",
    "path": "/some_path"
}
```

## grpc

``` json
{
    "offset_port_node": "443",
    "host": "hk.domain.com",
    "network": "grpc",
    "servicename": "some_name"
}
```

# Shadowsocks 2022

``` json
{
    "offset_port_node": "8080",
    "method": "2022-blake3-aes-128-gcm",
    "server_key": "zP6flOl9PSsHr019zGSV6Q=="
}
```

Server key can be generated with `openssl rand -base64 16` command.

# TUIC

``` json
{
    "offset_port_node": "8443",
    "host": "server_name",
    "insecure": "0"
}
```

# Port Forward

``` json
{
    "offset_port_user": "8888",
    "offset_port_node": "12345"
}
```

At this point, the user connection (inside the subscription) port is 8888 and the node listening port is 12345
