---
sidebar_position: 1
---

# The Admin Panel

Everything an operator does lives under `/admin`, which is reachable from the **Site admin** link in the user panel's navigation once your account has the administrator flag. There is no separate admin login — the same session, the same two-factor prompt, the same language preference.

## Creating the first administrator

A fresh installation has no accounts at all. Make one from the CLI:

```bash
php next-cli Tool createAdmin
```

It asks for an email address and a password, then for a `y` to confirm. Passing both up front works too:

```bash
php next-cli Tool createAdmin admin@example.com 'a-long-password'
```

The account it creates is an ordinary one carrying the admin flag: level 0, no traffic allowance, email unverified. None of that matters for administering the site, because an admin reaches every node regardless of level — but if you also intend to *use* the service from that account, give it a level and some traffic from `Admin` → `Users` afterwards.

Every later administrator is promoted from `Admin` → `Users` → *edit* by turning on **Administrator**.

:::caution
Administrators bypass a great deal: they can reach every node regardless of level or group, they are exempt from the audit auto-ban by default (`auto_detect_ban_allow_admin`), and they see every user's data. Hand the flag out sparingly.
:::

## Navigation map

The sidebar groups pages by what you are doing rather than by which table they read.

Group | Pages | Covered in
-------|-------|------------
**Home** | Site overview, trends | [below](#the-home-page)
**Manage** | Users, Nodes, Products, Static pages, Documentation, Announcements | [Users](users.md), [Nodes](nodes.md), [Shop](shop.md), [Content](content.md)
**Billing** | Orders, Invoices, Coupons, Gift cards | [Shop](shop.md)
**Support** | Tickets | [Tickets](tickets.md)
**Audit** | Rules, Match log, Ban log | [Audit and logs](audit-and-logs.md)
**Logs** | Sign-ins, Online IPs, Subscriptions, Rebates, Balance, Traffic, Node traffic, Payment gateway, System log | [Audit and logs](audit-and-logs.md)
**Operations** | System status | [below](#system-status)
**Settings** | Fourteen settings pages | [Settings](settings.md), [Integrations](integrations.md)

## The home page

`Admin` → `Home` answers "how is the site doing" in one screen.

The top row is the money: **Revenue today** and **Revenue this month**, counted from invoices actually settled through a gateway. Below it sit the counts — registered users, paying users, orders by state, node availability — and the traffic figures split into used earlier, used today and remaining.

Each donut has a **Chart** / **Table** toggle in its header. The table view is there for the same reason a screen reader user needs it and a support person copying a number needs it: a donut cannot be pasted into a ticket.

### Trends

The **Trends** card plots how the numbers moved rather than where they stand.

Setting | Options
--------|---------
Range | 7, 30 or 90 days
Metrics | New users, New orders, New invoices, Order value, Invoices paid, Gateway revenue

Pick up to six metrics; the chart draws one line each and the row above it shows the period total with a percentage against the immediately preceding period of the same length. A 30-day view therefore compares against the 30 days before it. When there is no earlier period with data — a site younger than two ranges — the comparison reads *No period to compare with* rather than inventing a baseline.

Counts and money are different units, so the chart carries two axes. Choosing only count metrics or only money metrics gives a single axis and an easier read.

Your choice of range and metrics is remembered in the URL, so a trend view is a link you can bookmark or paste to a colleague.

## System status

`Admin` → `System` reports what is installed:

- **NeXT Panel version** — the `PANEL_VERSION` constant of the running code.
- **Database version** — the `db_version` config item, i.e. the newest migration applied.
- **Last daily job run** — when Cron last completed its once-a-day block. A stale value here is the fastest way to notice that Cron has stopped.

**Check for updates** asks the OTA API whether a newer release exists. It reports the version; it does not install anything — see [Upgrading](../maintenance/upgrade.md).

## A note on the tables

Nearly every list page is a DataTable fed by an `ajax` endpoint, which means sorting and paging happen server-side against the live table. Two consequences worth knowing:

- Searching searches the database, not the page you are looking at.
- A column that has nothing meaningful to show renders a dash, not a zero. A gift card that has never been redeemed has no redeemer, not user #0.
