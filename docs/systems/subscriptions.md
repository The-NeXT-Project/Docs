---
sidebar_position: 5
---

# Subscriptions

A subscription turns the node table into a configuration file a client can consume. It is the panel's most-hit endpoint by a wide margin — every client refreshes on its own schedule — which is why it is rate limited on two axes and why its output is deliberately cheap to produce.

## The URL

```
https://<sub host>/sub/{token}/{format}
```

The token identifies the account and lives in the `link` table, one row per user, generated on first use. `$_ENV['sub_token_len']` sets its length (16 by default, minimum 8).

`$_ENV['sub_urls']` lists the hostnames the endpoint answers on. A request whose `Host` header is not in that list is refused — so a subscription URL cannot be served from an arbitrary hostname pointed at the same server, and you can move subscriptions to a separate hostname from the panel. The first entry is the one the panel builds links with.

Setting `$_ENV['enable_sub']` to `false` turns the whole endpoint off.

## Formats

Format | Path | Content type
--------|------|--------------
Json | `/json` | `application/json`
Clash | `/clash` | `application/yaml`
sing-box | `/singbox` | `application/json`
V2Ray Json | `/v2rayjson` | `application/json`
V2Ray | `/v2ray` | `text/plain`
Trojan | `/trojan` | `text/plain`
AnyTLS | `/anytls` | `text/plain`

The first four are *universal*: one link, every node the account can use, in a format a multi-protocol client understands. The last three carry only nodes of that protocol, for clients that speak one. Those three can be turned off individually under `Admin` → `Settings` → `Subscription`.

The Json format is not a client format at all — it is a small document describing the account (level, expiry, traffic used and remaining) and listing the universal URLs. It exists for tooling.

The response formats and a sample payload are in [Universal Subscription](../configuration/universal-subscription.md).

## Headers

Every response carries:

```
Subscription-Userinfo: upload=…; download=…; total=…; expire=…
```

which is how a client shows your remaining traffic and expiry next to the profile name.

Clash responses additionally carry `Content-Disposition` (naming the profile after the site), `Profile-Update-Interval: 6` (refresh every six hours) and `Profile-Web-Page-Url` (a link back to the panel from inside the client).

## Which nodes appear

A node is included when all of these hold:

- it is enabled;
- its level is at or below the account's level;
- its group is 0, or matches the account's group;
- it has bandwidth left — a node at its own traffic limit drops out of every subscription.

Administrators skip the group check. Nodes are ordered by level, then by name, so the cheap ones sort together and the ordering is stable between refreshes — clients that remember a selected node by index do not end up somewhere else after an update.

The user-facing node list shows nodes above the account's level as well, greyed out with an explanation. The subscription does not: sending a client a node it cannot authenticate to produces confusing failures rather than an upsell.

## Node configuration

Protocol-specific settings — ports, TLS, transport, SNI, obfuscation, padding — come from each node's **Custom config**, a JSON blob. The same blob feeds the backend over the [Server API](../design-document/server-api.md) and the subscription generators, so a node is described once.

[Custom Config](../configuration/custom-config.md) documents every field with worked examples per protocol.

The panel ships a default rule set for the Clash and sing-box profiles. The sing-box default tracks the current schema, so it is worth re-fetching subscriptions after a panel upgrade that mentions the sing-box profile.

## Invalidating a link

Action | Effect on existing clients
--------|---------------------------
**Reset the subscription URL** | The old URL stops returning anything. Configurations already downloaded keep working
**Reset the connection password** | Existing node configurations stop authenticating. The subscription must be fetched again
Banning the account | The subscription stops returning anything immediately

The two resets solve different problems and are separate for that reason. A shared link is fixed by rotating the token; leaked credentials need the connection password rotated, which disconnects the user until they re-import.

**Reset the subscription link when the account password changes** (on by default) ties the first to sign-in password changes, so a compromised account does not leave a working subscription behind.

## Rate limiting

```php
$_ENV['rate_limit_sub_ip'] = 10;  // Per IP, per minute
$_ENV['rate_limit_sub'] = 10;     // Per subscription token, per minute
```

Both must pass. The per-token limit is the one that matters here: a leaked URL polled by a hundred clients arrives from a hundred addresses, so a per-IP limit alone would never see it.

## Logging

**Record subscription fetches** (`Admin` → `Settings` → `Logs` → `User logs`) records each fetch with its client user agent, kept for a configurable number of days. It is off by default because it grows by one row per client per refresh interval — on a site with a thousand users on six-hourly refresh, four thousand rows a day.

It is worth turning on temporarily when diagnosing "my subscription stopped updating": the log answers whether the request arrived at all, and from which client.

With it on, **Notify the user of a subscription fetch from a new IP** becomes available.

## Behind a CDN

Cache rules will happily serve one user's subscription to another. If the site is behind Cloudflare, bypass the cache for the subscription path — see [Common Questions](../q-and-a/common-questions.md).
