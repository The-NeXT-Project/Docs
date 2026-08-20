---
sidebar_position: 8
---

# Settings Reference

Everything under `Admin` → `Settings` is stored in the database `config` table and takes effect immediately — there is no cache to clear and no file to redeploy. The other half of the panel's configuration lives in `config/config.php` and needs a deploy; [Configuration](../systems/configuration.md) explains which is which and why.

The settings menu is grouped into **Users and access**, **Billing**, **Messaging** and **System**. Every page works the same way: tabs across the top, a filter box on the right that searches every tab at once, and one **Save** button that saves the whole page.

This page covers the site-behaviour pages. The third-party ones — payment, email, CAPTCHA, IM, LLM, object storage — are in [Integrations](integrations.md), and the shop rules are in [Shop](shop.md#site-wide-purchase-rules).

## Registration

`Settings` → `Registration` decides who may sign up and what they get.

Setting | Default | Notes
--------|---------|-------
Registration mode | Open to everyone | Also *By user invitation only* and *Closed*
Email verification | Off | Requires a working [email provider](integrations.md#email)
Groups assigned at random on registration | — | Comma-separated node group IDs; each new account is dropped into one at random. Useful for spreading load across node sets

### What a new account starts with

Setting | Default
--------|---------
Level on registration | 0
Days the registration level lasts | 0
Traffic granted on registration (GB) | 0
Concurrent IP limit | 0 (unlimited)
Speed limit | 0 (unlimited)

Giving a non-zero level and a few days is how you run a trial: the account behaves like a paying one until the clock runs out.

## User accounts

`Settings` → `User accounts` holds the rules that apply to accounts in general.

Setting | Default | Notes
--------|---------|-------
Let users change their email address | On | Off pins the address to what registration or an admin set
Let users delete their own account | Off | On adds a delete button to their settings, guarded by their password

### Traffic

Setting | Default | Notes
--------|---------|-------
Traffic granted when the level expires (GB) | 0 | What a lapsed paying account falls back to
Traffic reset day for free users | 0 | Day of the month. Zero never resets
Traffic granted on reset | 0 | GB granted on that day

The last two are the monthly free allowance; both must be non-zero for anything to happen. Per-account overrides live on the user edit page.

## Invitations

`Settings` → `Invitations` configures the referral programme. Every user gets an invite link on their **Invite and earn** page; these settings decide what it is worth.

### On registration

Setting | Goes to
--------|---------
Starting balance for the invitee | The person signing up
Traffic reward for the inviter (GB) | The person who invited them

### On payment

Setting | Options
--------|---------
Rebate mode | *No rebate*, or *Rebate when the invitee pays an invoice*
Rebate percentage | Percentage of each invoice the inviter earns
How the rebate is capped | *Cap the number of rebates*, or *Cap the total rebate amount*
Rebates allowed per invitee | Used by the count cap. Zero or less means no limit
Total rebate allowed per invitee | Used by the amount cap

The two caps are alternatives, not a pair — pick the one that matches how you think about the cost. A count cap ("first three payments only") is easy to explain; an amount cap ("up to 20 per referral") bounds the spend regardless of package size.

Rebates are paid into the inviter's balance and recorded in `Admin` → `Logs` → `Rebates`. A shadow-banned account neither earns rebates nor counts as a referrer.

## Subscription

`Settings` → `Subscription` decides which per-protocol subscription formats are offered, and what happens to a link when a password changes.

Setting | Default | Notes
--------|---------|-------
Reset the subscription link when the account password changes | Enabled | The safe default: a leaked password does not leave a working subscription behind
Enable the Vmess subscription | Enabled |
Enable the Trojan subscription | Enabled |
Enable the AnyTLS subscription | Enabled |

The universal formats — Json, Clash, sing-box, V2Ray Json — are always available; these three switches only cover the single-protocol links. The subscription feature as a whole, and the hostnames it answers on, are set in `config.php` (`enable_sub`, `sub_urls`, `sub_token_len`).

## Support

Covered in [Tickets](tickets.md#settings).

## Notifications

`Settings` → `Notifications` gathers everything the site sends unprompted, whether it goes to a user or to you. How each message reaches its recipient — email, IM, or not at all — is a per-user choice; see [Notifications](../systems/notifications.md).

### Account activity

Setting | Default | Effect
--------|---------|-------
Notify the user of a sign-in from a new IP | Off | Requires the sign-in log
Notify the user of a subscription fetch from a new IP | Off | Requires the subscription log
Notify the user when their credentials are reset | On | Tells them which secret changed and what to do next

The first two read the logs under [Logs](#logs), so turning the log off silences the notification too.

### Traffic usage notifications

Rather than one warning at a fixed point, the panel notifies at every threshold an account crosses on the way down.

Setting | Notes
--------|-------
How remaining traffic is measured | *Remaining traffic as a percentage*, *Remaining traffic in MB*, or off
Remaining traffic thresholds | Comma-separated, in whichever unit you chose — for example `50,20,10` or `5120,2048,1024`
Notify the user when their traffic runs out | A final notice telling them they can no longer connect

Each threshold notifies once. Crossing 50%, then 20%, then 10% produces three messages, not three copies of the same one. Topping the account up resets the state, so the next descent notifies again from the top.

### Daily traffic report

Setting | Default | Notes
--------|---------|-------
Send the daily traffic report to new users | Off | Whether new accounts are opted in by default
Send the daily traffic report to email-verified users only | Off | —
Send the daily traffic report to active users only | Off | Skips idle accounts, which is most of the volume on an older site

Users choose their own delivery — email, IM, or not at all — on their settings page.

### Finance reports

Daily, weekly and monthly revenue summaries, emailed to administrators. The weekly report goes out on Monday, the monthly on the first of the month, all three at midnight.

## Logs

`Settings` → `Logs` decides what the panel records and how long it keeps it. Each switch has its own **Days to keep**, and the daily job deletes anything older. Logging everything forever is not free: the subscription log in particular grows by one row per client refresh per user.

### User logs

Setting | Default | Effect
--------|---------|-------
Record sign-ins | On | Feeds `Logs` → `Sign-ins` and the new-IP notification
Record subscription fetches | Off | Every fetch, with the client's user agent
Days to keep the subscription log | 7 | —
Record hourly traffic usage | Off | Powers the hourly chart on the user dashboard
Days to keep the traffic log | 7 | —

### Node logs

Setting | Default | Effect
--------|---------|-------
Record daily node traffic | Off | Powers `Logs` → `Node traffic`
Days to keep the node traffic log | 30 | —

## Scheduled tasks

`Settings` → `Scheduled tasks` configures what the Cron job does. The job itself must be installed in the system crontab; see [Scheduled tasks](../systems/scheduled-tasks.md) for what runs when.

### Daily job

Setting | Default | Notes
--------|---------|-------
Hour the daily job runs | 0 | 0–23
Minute the daily job runs | 0 | 0–59

The daily block — database cleanup, node bandwidth resets, free-user traffic resets, the daily traffic report — runs on the first Cron tick that matches this time, and is guarded so it cannot run twice within a day. `Admin` → `System` shows when it last completed.

### Detection jobs

Setting | Default | Notes
--------|---------|-------
Detect nodes blocked by the GFW | Off | Hourly; needs a [NetStatus API](../server/netstatus-api.md) endpoint in `config.php`
Ban accounts that trip the audit rules | Off | Hourly; see [Audit](audit-and-logs.md#matches-and-bans)

### Idle accounts

Setting | Default
--------|---------
Detect idle accounts | Off
Days without a check-in before an account counts as idle | 90
Days without a sign-in before an account counts as idle | 90
Days without use before an account counts as idle | 90
Drop the subscription link and invite code of idle accounts | Off

All three windows must be exceeded for an account to be idle.

## Other settings

`Settings` → `Other settings` is the remainder: what users can see, and check-in.

### Documentation

Setting | Default | Effect
--------|---------|-------
Show the documentation | On | The `/user/docs` section
Show the documentation to paying users only | Off | Restricts it

### Audit

Setting | Default | Effect
--------|---------|-------
Show the audit rules | On | Users can read the rules they are matched against
Show the audit log | On | Users can see their own matches

### Check-in

Setting | Default | Effect
--------|---------|-------
Check-in | Off | Adds the daily check-in card to the dashboard
Require email verification to check in | Off | —
Minimum / Maximum check-in traffic reward (MB) | 1 / 50 | The reward is drawn at random between them

A CAPTCHA can be required on check-in — see [Integrations](integrations.md#captcha).

### Traffic warning

Setting | Default | Effect
--------|---------|-------
Remaining traffic warning threshold (%) | 10 | Below this, a paying user sees a banner on their dashboard linking to traffic packages. Zero disables it
