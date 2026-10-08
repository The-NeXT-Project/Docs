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

Five minutes is what the panel is designed around. Longer, and paid orders sit unactivated and queued messages sit unsent. Shorter gains nothing — the per-tick work is bounded.

## Overlapping runs

A run holds a lock on `cache/cron.lock` for as long as it works. If the previous run is still going when the next tick fires, the new one prints `Previous cron run is still in progress, skipping this one` and exits, so two runs never process the same orders or send the same report side by side. The lock belongs to the process, so a run that crashes or is killed releases it and the next tick proceeds normally; there is no stale lock file to delete.

The message queue stops draining 270 seconds after the run started, which frees the lock before the next five-minute tick. A run that still overruns costs one skipped tick, not a pile of stacked processes.

If the lock file cannot be opened (for example `cache/` is not writable by the Cron user), the run says so and continues without the lock. Cron keeps working; it just loses the overlap protection until the permissions are fixed.

## Missed ticks catch up

The hourly, daily and midnight jobs do not need a tick to land on their exact minute. Each remembers the last slot it ran for (`last_hourly_job_time`, `last_daily_job_time` and `last_midnight_job_time` in the `config` table), and runs on the first tick after a newer slot is due. A late tick, a skipped tick or a server that was down for a few hours therefore runs each job once when Cron comes back, rather than losing the day. However long the gap, a job catches up once, not once per missed slot.

A slot is recorded before its jobs start, so a job that fails partway is not retried on the next tick; that keeps a half-sent report from going out twice. Check `Admin` → `System log` when a scheduled job did not do what you expected.

On a fresh install or the first run after upgrading, a slot that has never been recorded is only written down, not run, so the first tick does not send a report for a period the panel never covered. The first real run is at the next slot.

:::caution
A panel with no Cron looks completely healthy. Users sign in, nodes serve traffic, payments are taken. What silently stops is delivery: orders never activate, packages never expire, mail is never sent, node status is never checked. If something has "stopped working for no reason", check `Admin` → `System` → **Last daily job run** first.
:::

## What runs on every tick

Order | Job
-------|-----
1 | Activate pending orders, by type: TABP, traffic packages, time packages, balance top-ups
2 | Cancel unpaid and partially paid orders past their timeouts, if enabled
3 | Clean up cancelled orders past their timeout, if enabled
4 | Expire paid accounts whose level has run out
5 | Send traffic usage notifications for thresholds crossed
6 | Refresh node IP addresses from their hostnames
7 | Detect offline nodes, if enabled
8 | Drain the message queue

Order matters in one place: expiry is checked before activation, so a package that just ran out is retired and its successor activated on the same tick rather than the next.

## What runs hourly

Once per clock hour, on the first tick at or after minute zero, when enabled:

- **GFW detection** — asks a [NetStatus API](../server/netstatus-api.md) instance to probe each node from inside the censored network. A node that answers the panel but not the prober is reachable but blocked. Each probe gives up after 10 seconds, and a probe that returns no usable answer is skipped rather than counted as blocked, so a slow or broken NetStatus endpoint does not mark healthy nodes down.
- **Audit banning** — counts audit matches per user since their last ban and bans those over the threshold, then lifts bans that have served their time.

## What runs daily

On the first tick at or after the hour and minute set under `Settings` → `Scheduled tasks` → `Daily job`, once per day (see [Missed ticks catch up](#missed-ticks-catch-up)). The minute does not need to be a multiple of five:

- database cleanup, honouring each log's retention setting;
- node bandwidth counter resets, for nodes whose reset day is today;
- free-user traffic resets;
- the daily traffic report;
- idle-account detection, if enabled;
- dropping subscription links and invite codes of idle accounts, if enabled;
- the system diary notification, if enabled;
- today's traffic counters reset;
- the daily job notification to the IM group, if enabled.

The slot it ran for is written to the `config` table, which is both the guard against a second run and what `Admin` → `System` displays.

### Reset day edge cases

A node whose bandwidth reset day is 31 would never reset in February. On the last day of a month the job also resets every node and free user whose reset day that month does not have, so a reset day of 29, 30 or 31 falls on the 28th or 29th instead.

The date used is the slot's, not the clock's. A daily job set for 23:00 that only catches up at 00:10 still resets the nodes and users due on the day it was meant for.

## What runs at fixed times

Job | When
-----|------
Daily finance report | 00:00, if enabled
Weekly finance report | 00:00 Monday, if enabled
Monthly finance report | 00:00 on the 1st, if enabled
AbuseIPDB database refresh | 00:00, if `enable_abuseipdb` is set and a key is configured

These are keyed to midnight rather than to the configurable daily-job time, because a finance report covering "yesterday" should be cut at the day boundary. They catch up like the daily job, and the weekly and monthly checks look at the midnight being caught up, so a Monday report missed overnight still goes out on Monday morning.

## The message queue

The last job on every tick drains the queue, stopping 270 seconds after the run started so the lock is free for the next tick. See [Notifications](notifications.md#the-message-queue) for how claiming and failure handling work.

## Other CLI jobs

Two commands are worth scheduling separately, on their own cadence:

```bash
php next-cli ClientDownload     # Fetch new client releases
php next-cli Tool updateGeoIP2  # Refresh the MaxMind database
```

Weekly is reasonable for both. Neither belongs in the five-minute job: `ClientDownload` moves hundreds of megabytes, and the GeoIP database is published monthly.

## Watching it

`Admin` → `System` shows the last daily-job slot. Everything else the job does — successes, failures, timeouts — goes to `Admin` → `System log`, which is the first place to look when a scheduled thing did not happen.
