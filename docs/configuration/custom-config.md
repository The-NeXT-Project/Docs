# Custom Config

## List of configurable options

```json
{
    // Generic configuration
    "offset_port_user": "", // Port used in user subscription.
    "offset_port_node": "", // Port used in node server.
    "host": "", // SNI, works on certain Vmess transport protocols involved TLS, Trojan, TUIC and AnyTLS.
    "allow_insecure": "0", // Skip TLS verification, same as host.
    // Shadowsocks 2022
    "method": "",
    "server_key": "",
    // Vmess
    "tls": "0",
    "network": "",
    "security": "",
    "encryption":"",
    "path": "",
    "header": {
        "type": "http",
        "request": {},
        "response": {}
    },
    // Trojan
    "servicename": "",
    "mux": "0",
    "network": "",
    "path": "",
    "header": {
        "type": "http",
        "request": {},
        "response": {}
    },
    // AnyTLS
    "padding_scheme": [
        "stop=8",
        "0=30-30",
        "1=100-400",
        "2=400-500,c,500-1000,c,500-1000,c,500-1000,c,500-1000",
        "3=9-9,500-1000",
        "4=500-1000",
        "5=500-1000",
        "6=500-1000",
        "7=500-1000"
    ], // If padding scheme is empty, the default value will be used.
    "client-fingerprint": "chrome",
    "idle-session-check-interval": 30,
    "idle-session-timeout": 30,
    "min-idle-session": 0,
    // Clash related, only used for Clash Universal Subscription, does not affect node configuration distribution.
    // Refer to the documentation at https://github.com/MetaCubeX/mihomo/blob/Alpha/docs/config.yaml.
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

## Vmess

### tcp

``` json
{
    "offset_port_node": "12345",
    "network": "tcp",
}
```

### tcp+tls

```json
{
    "offset_port_node": "443",
    "host": "hk.domain.com",
    "network": "tcp",
    "security": "tls",
}
```

### ws

```json
{
    "offset_port_node": "80",
    "host": "hk.domain.com",
    "network": "ws",
    "path": "/some_path"
}
```

### ws+tls

```json
{
    "offset_port_node": "443",
    "host": "hk.domain.com",
    "network": "ws",
    "security": "tls",
    "path": "/some_path"
}
```

### grpc+tls

```json
{
    "offset_port_node": "443",
    "host": "hk.domain.com",
    "network": "grpc",
    "security": "tls",
    "servicename": "some_name"
}
```

## Trojan

### tcp

``` json
{
    "offset_port_node": "443",
    "host": "hk.domain.com"
}
```

### ws

``` json
{
    "offset_port_node": "443",
    "host": "hk.domain.com",
    "network": "ws",
    "path": "/some_path"
}
```

### grpc

``` json
{
    "offset_port_node": "443",
    "host": "hk.domain.com",
    "network": "grpc",
    "servicename": "some_name"
}
```

## Shadowsocks 2022

``` json
{
    "offset_port_node": "8080",
    "method": "2022-blake3-aes-128-gcm",
    "server_key": "zP6flOl9PSsHr019zGSV6Q=="
}
```

Server key can be generated with `openssl rand -base64 16` command.

## TUIC

``` json
{
    "offset_port_node": "8443",
    "host": "server_name",
    "allow_insecure": "0"
}
```

## AnyTLS

``` json
{
    "offset_port_node": "8443",
    "host": "server_name",
    "allow_insecure": "0",
    "padding_scheme": [
        "stop=8",
        "0=30-30",
        "1=100-400",
        "2=400-500,c,500-1000,c,500-1000,c,500-1000,c,500-1000",
        "3=9-9,500-1000",
        "4=500-1000",
        "5=500-1000",
        "6=500-1000",
        "7=500-1000"
    ],
    "client_fingerprint": "chrome",
    "idle_session_check_interval": "30",
    "idle_session_timeout": "30",
    "min_idle_session": "0"
}
```

## Port Forward

``` json
{
    "offset_port_user": "42069",
    "offset_port_node": "1919"
}
```

The user connection (inside the subscription) port is `42069` and the node listening port is `1919`.

### Offset Port Selection Priority for the User Subscription

```
"offset_port_user" ==> "offset_port_node" ==> 443
// 443 is the default port for all protocols
```
