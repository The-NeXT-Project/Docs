# Custom Config

## List of configurable options

```json
{
    // Generic configuration
    "offset_port_user": "", // Port used in user subscription.
    "offset_port_node": "", // Port used in node server.
    "host": "", // SNI, works on certain Vmess transport protocols involved TLS, Trojan, TUIC, Hysteria2, AnyTLS and NaïveProxy.
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
    // Snell
    "version": 4, // Snell protocol version.
    "psk": "", // Server pre-shared key. Empty makes the account's connection password the key itself.
    "obfs": "", // Obfuscation mode: "http", "tls" (mihomo only) or empty for none.
    "obfs_host": "", // Host header sent when "obfs" is set.
    "reuse": false, // Connection reuse, from version 4.
    "mode": "", // sing-box traffic shaping, version 6 only.
    // Hysteria2
    "obfs": "salamander", // Obfuscation type. Only read when "obfs_password" is set.
    "obfs_password": "", // Empty leaves obfuscation off.
    "up_mbps": 0, // Upload bandwidth. 0 leaves the client on BBR.
    "down_mbps": 0, // Download bandwidth. 0 leaves the client on BBR.
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
    // NaïveProxy
    "quic": false, // Dial over HTTP/3 instead of HTTP/2.
    "congestion_control": "", // QUIC congestion control, only read when "quic" is on. Empty leaves the client default.
    "insecure_concurrency": 0, // Concurrent connections. 0 leaves the client default.
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

## Snell

``` json
{
    "offset_port_node": "8443",
    "version": 4,
    "psk": "server_pre_shared_key",
    "obfs": "http",
    "obfs_host": "bing.com",
    "udp": true,
    "reuse": false
}
```

Snell keys its users in two layers, the way Shadowsocks 2022 does. `psk` is the server's own pre-shared key, and the account's connection password is then its user key; leaving `psk` empty means the connection password *is* the pre-shared key, for a node that gives every user their own.

Only sing-box can express the two-layer form — mihomo has a single `psk` field and no per-user key — so a node that sets `psk` reaches `/singbox` alone, while one that leaves it empty reaches `/clash` as well. Versions divide the same way: mihomo speaks 1 through 5, sing-box only 4 and 6, so version 4 is the one both draw and a node on any other version is left out of the profile that cannot express it.

`obfs` is the obfuscation mode rather than a type — `http` for either client, `tls` for mihomo alone, and empty for none. mihomo's credential-carrying modes (`shadow-tls`, `restls`, `jls`) are not offered, since they need secrets of their own. `obfs_host` is the `Host` header sent with them. `udp` is honoured from version 3 and `reuse` from version 4, and both are dropped for older versions that have no such option. Version 6 also reads `mode`, sing-box's traffic shaping (`default`, `unshaped` or `unsafe-raw`).

## Hysteria2

``` json
{
    "offset_port_node": "8443",
    "host": "server_name",
    "allow_insecure": "0",
    "obfs": "salamander",
    "obfs_password": "obfs_secret",
    "up_mbps": 0,
    "down_mbps": 0
}
```

The account's connection password is the authentication secret, so a node needs neither it nor the UUID in its custom config. Obfuscation stays off until `obfs_password` is set — `obfs` then names the type (`salamander` or `gecko`) for both sing-box and mihomo. Leaving `up_mbps` and `down_mbps` at zero omits them, which is how both clients are told to negotiate the rate with BBR instead of being pinned to a number the node never measured.

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

## NaïveProxy

``` json
{
    "offset_port_node": "8443",
    "host": "server_name",
    "allow_insecure": "0",
    "quic": false,
    "congestion_control": "bbr",
    "insecure_concurrency": 0
}
```

The account's UUID is the user name and its connection password the secret, so a node needs neither in its custom config. `"quic": true` switches both the sing-box outbound and the `/naive` link to HTTP/3 (`naive+quic://`).

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
