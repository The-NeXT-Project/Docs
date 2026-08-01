# Server API V1

Server API V1 is the interface node backends use to talk to the panel. It replaces the legacy [WebAPI](webapi.md) (`/mod_mu`), which remains available for backends that have not migrated yet.

All routes are prefixed with `/api/server/v1`. Requests and responses are JSON, and the WebAPI switch (`webAPI` in `config.php`) must be enabled in the panel.

## Authentication

Every request carries the node communication key in the `Authorization` header:

```
Authorization: Bearer <node communication key>
```

The key is generated per node when the node is created and can be regenerated from the admin panel (Node → Reset communication key). **The key identifies the node**: the panel resolves the requesting node from the key alone, so there is no `node_id` parameter anywhere in this API, and a node can only ever read or report data as itself.

Differences from the legacy WebAPI:

- The shared site-wide `muKey` is not accepted.
- Keys are never passed in the query string.
- With `checkNodeIp` enabled, the request IP must match the authenticated node's own `ipv4`/`ipv6` address (or loopback), not merely any node's address.

## Conventions

### Status codes

Code | Meaning
-----|--------
`200` | Success
`304` | Resource unchanged (see ETag below)
`400` | Request body is not valid JSON or has the wrong shape
`401` | Missing/malformed `Authorization` header, or unknown key
`403` | Request refused (see error codes)
`429` | Rate limited; the response carries a `Retry-After` header

### Envelopes

Success responses wrap their payload in `data`:

```json
{ "data": { ... } }
```

Error responses carry a machine-readable `code` and a human-readable `message`:

```json
{ "error": { "code": "node_disabled", "message": "Node is not enabled." } }
```

Backends should branch on `code`, never on `message`.

Code | Status | Meaning
-----|--------|--------
`api_disabled` | 403 | `webAPI` is disabled on this panel
`unauthenticated` | 401 | Missing/malformed header or unknown key
`rate_limited` | 429 | Too many requests from this IP or node
`node_disabled` | 403 | The node exists but is disabled in the panel
`ip_mismatch` | 403 | `checkNodeIp` is on and the request IP is not the node's address
`out_of_bandwidth` | 403 | The node's bandwidth limit is exhausted
`invalid_body` | 400 | Malformed JSON or wrong payload shape

### ETag

All `GET` endpoints return a weak `ETag` header. Send it back via `If-None-Match`; if the resource is unchanged the panel answers `304` with an empty body. Poll loops should always use this — user lists rarely change between polls.

### Rate limits

When `enable_rate_limit` is on, requests are limited per IP (`rate_limit_server_api_ip`) and per node (`rate_limit_server_api`), both defaulting to 60 per minute.

## Endpoints

### `PUT /heartbeat`

Reports that the node is alive. Replaces the implicit heartbeat the legacy WebAPI performed as a side effect of fetching the user list. The body is optional:

```json
{ "online_user": 42 }
```

`online_user`, when present, must be a non-negative integer and updates the online-user count shown in the admin panel. Unknown fields are ignored.

Response:

```json
{ "data": { "timestamp": 1753940000, "panel": "NeXT-Panel", "version": "..." } }
```

`timestamp` is the panel's clock, letting backends detect clock skew.

### `GET /info`

Node settings for the requesting node. ETag-enabled.

```json
{
  "data": {
    "node_speedlimit": 0,
    "sort": 14,
    "server": "node.example.com",
    "custom_config": { ... },
    "type": "NeXT-Panel",
    "version": "..."
  }
}
```

### `GET /users`

Users allowed to connect to the requesting node, honoring node class, node group, account expiry, bans, traffic quota (`keep_connect` throttles exhausted users to 1 Mbps instead of dropping them), and per-user IP limits. ETag-enabled.

`data` is an array of user objects; fields depend on the node type (`sort`):

Node Type | Fields per user
----------|----------------
Shadowsocks2022 (1) | `id`, `node_speedlimit`, `passwd` (derived user PK, base64)
TUIC (2) | `id`, `node_speedlimit`, `passwd`, `uuid`
Vmess (11), Trojan (14) | `id`, `node_speedlimit`, `uuid`
Others | `id`, `node_speedlimit`, `passwd`

Returns `403` with `out_of_bandwidth` when the node's bandwidth limit is exhausted.

### `GET /detect_rules`

Current detect (audit) rules. ETag-enabled. `data` is an array of rule objects.

### `POST /users/traffic`

Batch report of user traffic since the last report, in bytes:

```json
{ "traffic": [ { "user_id": 123, "u": 1048576, "d": 8388608 } ] }
```

Traffic rates (static or dynamic) are applied panel-side. Entries referencing unknown users — e.g. deleted between polls — are skipped, not fatal:

```json
{ "data": { "accepted": 41, "skipped": 1 } }
```

Do **not** send the legacy aggregate pseudo-entry (the `user_id`-less row): every entry must name a user, and the online-user count now travels via `PUT /heartbeat`.

### `POST /users/online`

Batch report of currently connected user IPs:

```json
{ "online": [ { "user_id": 123, "ip": "1.2.3.4" } ] }
```

IPv4 addresses are stored as IPv4-mapped IPv6. Invalid IPs are skipped. Response is the same `accepted`/`skipped` envelope.

### `POST /users/detect_logs`

Batch report of detect rule hits:

```json
{ "logs": [ { "user_id": 123, "rule_id": 4 } ] }
```

`rule_id` is the id of the matched detect rule (the legacy `list_id`). Response is the same `accepted`/`skipped` envelope.

## Migrating from the legacy WebAPI

Legacy (`/mod_mu`) | Server API V1
-------------------|---------------
`GET /users?node_id=N` (implicit heartbeat) | `PUT /heartbeat`
`GET /nodes/{id}/info` | `GET /info`
`GET /users?node_id=N` | `GET /users`
`GET /func/detect_rules` | `GET /detect_rules`
`POST /users/traffic?node_id=N` | `POST /users/traffic`
`POST /users/aliveip?node_id=N` | `POST /users/online`
`POST /users/detectlog?node_id=N` | `POST /users/detect_logs`
`GET /func/ping` | `PUT /heartbeat`

Behavioral changes to account for:

- Authenticate with the node's own communication key in the `Authorization` header; drop `muKey` and all `node_id`/`key` parameters.
- Check HTTP status codes and `error.code` instead of the `ret` field; errors no longer come back as `200`.
- Fetching `/users` no longer marks the node alive — send heartbeats explicitly.
- Traffic reports must not include the aggregate pseudo-entry, and partially invalid batches are applied partially (watch `skipped`).
