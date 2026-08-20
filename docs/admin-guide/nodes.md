---
sidebar_position: 3
---

# Managing Nodes

A node is one proxy server as the panel knows it: an address, a protocol, who is allowed on it, and how its traffic is counted. `Admin` → `Nodes` lists them; **Add** and the row's *edit* action open the same form.

The panel does not install or configure the server itself. It stores the settings a backend fetches over the [Server API](../design-document/server-api.md) and the parameters it hands to a user's subscription.

## Identity

Field | What it is
-------|-----------
**Name** | Shown to users on their node list and in their subscriptions
**Address** | The hostname or IP a client connects to
**IPv4 / IPv6** | The node's own addresses. Used by the API's IP check, by the GFW detector, and refreshed by Cron when the hostname resolves elsewhere
**Type** | The protocol the node speaks
**Tags** | Free-form display labels. Existing tags across all nodes are offered as suggestions, so a set stays consistent instead of drifting into near-duplicates
**Communication key** | The bearer token the backend authenticates with. **Reset communication key** issues a new one — the backend stops working until it is updated

Supported types:

Value | Protocol | Notes
------|----------|-------
1 | Shadowsocks 2022 | Single-port multi-user only
2 | TUIC |
3 | WireGuard |
4 | Hysteria2 |
5 | AnyTLS |
6 | NaïveProxy |
11 | Vmess |
14 | Trojan |

The form offers the four types that the subscription generators cover today — Trojan, Vmess, TUIC and Shadowsocks 2022. The rest exist in the data model for backends that fetch their own configuration.

Everything protocol-specific — ports, TLS, transport, SNI, obfuscation — lives in **Custom config**, a JSON blob passed through to the backend and to the subscription. See [Custom Config](../configuration/custom-config.md) for the full field list and worked examples per protocol.

## Who may use it

Field | Effect
-------|-------
**Level** | Only accounts at this level or above see the node. `0` makes it a free node
**Node group** | `0` makes the node visible to everyone. Any other value restricts it to accounts in that same group — an account in group 3 sees group 0 nodes and group 3 nodes, nothing else
**Speed limit (Mbps)** | Per-node cap. The effective limit for a connection is the lower of the node's and the account's

Administrators are exempt from the group restriction, and a node's user list always includes them regardless of level — so an admin account can be used to test any node without giving it a paid level.

## Traffic accounting

Field | Effect
-------|-------
**Traffic rate** | The multiplier applied to traffic used on this node. `0.5` bills half, `2` bills double. Capped at 999.99
**Traffic used** | What the node has reported this period. **Reset traffic** zeroes it
**Traffic limit** | When the node's own usage reaches this, it stops serving users — the API answers `out_of_bandwidth`. `0` is unlimited
**Traffic reset day** | Day of month the node's counter goes back to zero. A value past the end of a short month falls back to that month's last day, so 31 works in February

### Dynamic rate

With **Dynamic rate** on, the multiplier follows the clock instead of being a constant — cheap traffic overnight, expensive at peak. You give four numbers:

Field | Meaning
-------|--------
**Maximum rate** and the hour it applies | The peak of the curve
**Minimum rate** and the hour it applies | The trough
**Curve** | `Logistic` or `Linear`

`Linear` interpolates straight between the two points. `Logistic` uses an S-curve, so the rate sits near its minimum for most of the off-peak stretch and climbs quickly as peak approaches — usually the one you want, because it does not start charging more at 3pm for an 10pm peak.

The rate that applies is the one for the hour the traffic is reported in. Users can see the whole 24-hour curve for every dynamic node on their **Traffic rate** page, which is the point of the feature: it only shifts demand if people can see when it is cheap.

The minimum hour must not be later than the maximum hour, and rates must be between 0 and 999. Invalid combinations fall back to a flat rate of 1.

## Copying a node

**Duplicate** clones every setting — including the custom config and the dynamic-rate curve — into a new node with a fresh communication key. This is the fast path for a second server in the same region: duplicate, change the name and address, done.

## Availability

Two independent checks decide whether a node is shown as down.

**Offline detection** (`enable_detect_offline` in `config.php`) compares the node's last heartbeat against the clock on every Cron run. A backend that has stopped reporting is marked offline. Notifications are batched — a rack of ten nodes dropping at once produces one message listing all ten, not ten messages.

**GFW detection** (`Settings` → `Scheduled tasks` → `Detect nodes blocked by the GFW`) runs hourly and asks an external [NetStatus API](../server/netstatus-api.md) instance to TCP-ping the node from inside the censored network. `detect_gfw_port` and `detect_gfw_url` in `config.php` configure it. A node that answers the panel but not the prober is reachable but blocked, which is a different problem from being down and gets its own notification.

Both feed the IM notifications configured under `Settings` → `IM` → `Notifications`.

## Node traffic history

`Admin` → `Logs` → `Node traffic` shows how much each node moved per day, with a stacked chart over the period and a table underneath.

Recording is off by default. Turn on **Record daily node traffic** under `Settings` → `Logs` → `Node logs` and set how many days to keep; the daily job clears anything older. Records already collected stay visible after you turn it off again.

The chart plots the busiest nodes individually and folds the rest into *Other nodes*, so a site with sixty nodes still produces a readable chart.
