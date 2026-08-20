---
sidebar_position: 7
---

# Scheduled Tasks

Everything that happens without someone pressing a button happens here. Order activation, expiry, traffic resets, the message queue, node detection, reports — all of it is one command run every five minutes.

```bash
php next-cli Cron
```

## Installing it

```
*/5 * * * * /usr/bin/php /path/to/panel/next-cli Cron >> /var/log/nextpanel-cron.log 2>&1
```

Run it as the user that owns the panel files, not as root: the job writes cache files, and files owned by root break the web server afterwards.

Five minutes is what the panel is designed around. Longer, and paid orders sit unactivated and queued messages sit unsent. Shorter gains nothing — the per-tick work is bounded, and the queue drain stops after five minutes precisely so that runs cannot overlap.

:::caution
A panel with no Cron looks completely healthy. Users sign in, nodes serve traffic, payments are taken. What silently stops is delivery: orders never activate, packages never expire, mail is never sent, node status is never checked. If something has "stopped working for no reason", check `Admin` → `System` → **Last daily job run** first.
:::

## What runs on every tick

Order | Job
-------|-----
1 | Activate pending orders, by type: TABP, traffic packages, time packages, balance top-ups
2 | Cancel unpaid orders past their timeout, if enabled
3 | Clean up cancelled orders past their timeout, if enabled
4 | Expire paid accounts whose level has run out
5 | Send traffic usage notifications for thresholds crossed
6 | Refresh node IP addresses from their hostnames
7 | Detect offline nodes, if enabled
8 | Drain the message queue

Order matters in one place: expiry is checked before activation, so a package that just ran out is retired and its successor activated on the same tick rather than the next.

## What runs hourly

At minute zero, when enabled:

- **GFW detection** — asks a [NetStatus API](../server/netstatus-api.md) instance to probe each node from inside the censored network. A node that answers the panel but not the prober is reachable but blocked.
- **Audit banning** — counts audit matches per user since their last ban and bans those over the threshold, then lifts bans that have served their time.

## What runs daily

At the hour and minute set under `Settings` → `Scheduled tasks` → `Daily job`, and guarded so it cannot run twice in one day:

- database cleanup, honouring each log's retention setting;
- node bandwidth counter resets, for nodes whose reset day is today;
- free-user traffic resets;
- the daily traffic report;
- idle-account detection, if enabled;
- dropping subscription links and invite codes of idle accounts, if enabled;
- the system diary notification, if enabled;
- today's traffic counters reset;
- the daily job notification to the IM group, if enabled.

The completion time is written back to the `config` table, which is both the guard against a second run and what `Admin` → `System` displays.

### Reset day edge cases

A node whose bandwidth reset day is 31 would never reset in February. The job treats a day past the end of the current month as that month's last day, so it resets on the 28th or 29th instead.

## What runs at fixed times

Job | When
-----|------
Daily finance report | 00:00, if enabled
Weekly finance report | 00:00 Monday, if enabled
Monthly finance report | 00:00 on the 1st, if enabled
AbuseIPDB database refresh | 00:00, if `enable_abuseipdb` is set and a key is configured

These are keyed to midnight rather than to the configurable daily-job time, because a finance report covering "yesterday" should be cut at the day boundary.

## The message queue

The last job on every tick drains the queue, stopping after five minutes so runs cannot pile up. See [Notifications](notifications.md#the-message-queue) for how claiming and failure handling work.

## Other CLI jobs

Two commands are worth scheduling separately, on their own cadence:

```bash
php next-cli ClientDownload     # Fetch new client releases
php next-cli Tool updateGeoIP2  # Refresh the MaxMind database
```

Weekly is reasonable for both. Neither belongs in the five-minute job: `ClientDownload` moves hundreds of megabytes, and the GeoIP database is published monthly.

## Watching it

`Admin` → `System` shows the last daily-job completion. Everything else the job does — successes, failures, timeouts — goes to `Admin` → `System log`, which is the first place to look when a scheduled thing did not happen.
