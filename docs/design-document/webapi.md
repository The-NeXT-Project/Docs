# WebAPI

Routes are prefixed with `/mod_mu/`, all requests must have a key parameter (i.e. muKey in config) and have WebAPI functionality enabled in the panel. All return values are json encoded unless otherwise noted.

## User

Route | Method | Parameters | Return Value | Description
-----|------|-----|-------|----
`/users` | GET | node_id | See the following table | Get the users that can be connected to the currently requested node (as determined by the node_id parameter)

Node Type | Return Data
--------|--------
Shadowsocks | method, node_speedlimit, port, passwd
Shadowsocks2022 | method, node_speedlimit, passwd(base64 encoded)
TUIC | node_speedlimit, passwd, uuid
Vmess  | node_speedlimit, uuid
Trojan | node_speedlimit, uuid

Note that Shadowsocks node type is **Multi Port Mode Only**, and Shadowsocks2022 is **Single Port Multi-User Mode Only**, any MU implementation not using Shadowsocks2022 protocol is **Not standard compliant**, thus we will not support such implementation in any way.

---
Route | Mode | Parameters | Description
-----|------|-----|-------
`/users/traffic` | POST | node_id, u, d, user_id | Report user traffic usage

---
Route | Mode | Parameters | Description
-----|------|-----|-------
`/users/aliveip` | POST | node_id, ip, user_id | Report the current online IP of the user

---
Route | Mode | Parameters | Description
-----|------|-----|-------
`/users/detectlog` | POST | node_id, list_id, user_id | Detect rule id for reporting user

## Node

Route | Method | Parameters | Return Value | Description
-----|------|-----|-------|----
`/nodes/{id}/info` | GET | node_id | node_speedlimit, sort, server, custom_config, type, version | Get the node settings for the current requesting node

## Func

Route | Method | Parameters | Return Value | Description
-----|------|-----|-------|----
`/func/detect_rules` | GET | N/A | rules | Get current detect rules

---
Route | Method | Parameters | Return Value | Description
-----|------|-----|-------|----
`/func/ping` | GET | N/A | N/A | Ping? Pong!
