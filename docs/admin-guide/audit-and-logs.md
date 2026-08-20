---
sidebar_position: 7
---

# Audit and Logs

## The audit system

Auditing is content matching done on the node, not on the panel. The panel stores the rules, hands them to backends over the API, and records what the backends report back.

### Rules

`Admin` → `Audit` → `Rules`.

Field | Notes
-------|-------
**Rule name** | Shown in the match log and to users, if rules are public
**Rule type** | *Hexadecimal packet match* or *Plain-text packet match*
**Regular expression** | What the audited content is matched against
**Description** | A short explanation. This is what a user reads when they want to know why they were flagged

Whether users can see the rules and their own matches is controlled by **Show the audit rules** and **Show the audit log** under `Settings` → `Other settings` → `Feature visibility`. Showing the rules is generally the right call: a user who can read the rule can stop tripping it.

### Matches and bans

`Admin` → `Audit` → `Match log` lists every report a node has made — which user, which node, which rule, when.

Automatic banning is off by default. Turn on **Ban accounts that trip the audit rules** under `Settings` → `Scheduled tasks` → `Detection jobs` and it runs hourly. The thresholds live in `config.php`, not in the database:

```php
$_ENV['auto_detect_ban_allow_admin'] = true; // Administrators are never auto-banned
$_ENV['auto_detect_ban_allow_users'] = [];   // User IDs exempt from auto-banning
$_ENV['auto_detect_ban_number'] = 30;        // Matches since the last ban that trigger the next
$_ENV['auto_detect_ban_time'] = 60;          // Ban length, in minutes
```

The count is *since that user's last ban*, not since forever, so a user who serves a ban starts again from zero rather than being re-banned on their next match. The ban lifts automatically once its length has elapsed — the same hourly run that bans also unbans.

Auto-bans are recorded with reason `DetectBan`, which is how the unban job knows which bans are its to lift. A manual ban set from `Admin` → `Users` carries your own reason and is never lifted automatically.

`Admin` → `Audit` → `Ban log` shows each ban with the window it covered, how many matches fell inside it, and when it ends.

## The logs

Everything under `Admin` → `Logs` is a searchable, server-side-paged table.

Log | Records | Controlled by
-----|---------|---------------
**Sign-ins** | Every sign-in attempt with IP and result | **Record sign-ins**
**Online IPs** | Addresses currently connected, per user and node | Always on; fed by node reports
**Subscriptions** | Every subscription fetch, with the client's user agent | **Record subscription fetches**
**Node traffic** | Daily traffic per node | **Record daily node traffic**
**Traffic** | Every change to a user's traffic allowance | **Record hourly traffic usage** (hourly usage); allocations are always logged
**Balance** | Every change to a user's balance, with a note | Always on
**Rebates** | Invitation rebates paid out | Always on
**Payment gateway** | Every callback a gateway made, with its transaction ID | Always on
**System log** | Application-level events and errors | Always on

The switches and their retention periods live under `Settings` → `Other settings` → `Logs`. Each logged table has its own **Days to keep**, and the daily job deletes anything older. Logging everything forever is not free: the subscription log in particular grows by one row per client refresh per user.

### Which log answers which question

Question | Log
----------|-----
"Someone else is using my account" | Sign-ins, then Online IPs
"My subscription stopped updating" | Subscriptions — did the fetch arrive at all, and from which client
"I paid and got nothing" | Payment gateway, then Orders
"Where did my traffic go" | Traffic — every allocation, with its source
"Why is my balance different" | Balance — every change carries a note
"The site threw an error" | System log

### The system log

`Admin` → `System log` records application events with a severity, the request context and, where there is one, a stack trace. Open a row to read the detail.

Log fields are truncated to their column widths on the way in rather than overflowing, and an entry with no usable client address is recorded against `::1` instead of being dropped — a log you can read is worth more than a log that is exactly right.
