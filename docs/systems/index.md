---
sidebar_position: 1
---

# How It Works

The guides tell you which buttons to press. This section explains what is behind them — the subsystems, why they are shaped the way they are, and the consequences that are not obvious from the settings page.

Read it when a setting does not behave the way you expected, when you are integrating something, or before changing anything on a live site.

## The subsystems

Subsystem | What it owns | Page
-----------|--------------|------
**Configuration** | Two separate stores, one in files and one in the database | [Configuration](configuration.md)
**Authentication** | Sessions, two-factor, CAPTCHA, rate limiting | [Authentication](authentication.md)
**Shop** | Orders, invoices, payment, activation, expiry | [The shop pipeline](shop-pipeline.md)
**Subscriptions** | Turning nodes into client configuration | [Subscriptions](subscriptions.md)
**Notifications** | The message queue, mail drivers, IM bots | [Notifications](notifications.md)
**Scheduled tasks** | Everything that happens without a request | [Scheduled tasks](scheduled-tasks.md)
**Client downloads** | Fetching client binaries and serving them | [Client downloads](client-downloads.md)
**Web assets** | The front-end libraries the panel ships | [Web assets](web-assets.md)
**Localization** | Four languages across panel, email and bots | [Localization](../configuration/localization.md)
**Node API** | How backends talk to the panel | [Server API V1](../design-document/server-api.md)

## The shape of the application

NeXT Panel is a PHP application on [Slim 4](https://www.slimframework.com/), with Eloquent as the ORM and Smarty as the template engine. MariaDB holds the durable state; Redis holds everything that can be lost without consequence — rate-limit counters, OAuth state, revoked session IDs.

A request goes: `public/index.php` loads the config files and the global constants, boots the database and error handling, builds the Slim app, and applies the routes. Routes are grouped by the middleware that guards them:

Prefix | Middleware | Who
--------|-----------|-----
`/user` | `User` | A signed-in account
`/admin` | `Admin` | A signed-in account with the admin flag
`/auth`, `/password` | `Guest` | Not signed in
`/mod_mu` | `NodeToken` | A node, using the legacy shared key
`/api/server/v1` | `ServerApiV1` | A node, using its own bearer key
`/payment/notify` | none | A payment gateway, authenticated by signature instead

The CLI (`php next-cli`) uses a lighter bootstrap that deliberately loads only `config.php`. That is not an oversight — `Config migrateFile` treats every `$_ENV` key as belonging to `config.php`, so loading `appprofile.php` or `client.php` there would make it report their keys as deprecated. Commands that need other config load it themselves.

## Two things that are easy to get wrong

**There are two configuration systems.** Settings you change in the admin panel live in the database and take effect immediately. Settings in `config/config.php` need a deploy. Neither reads the other. [Configuration](configuration.md) explains which belongs where.

**Cron is not optional.** Order activation, expiry, traffic resets, the message queue and every detection job run from it. A panel with no Cron looks fine and quietly stops delivering what people paid for. [Scheduled tasks](scheduled-tasks.md) covers what runs when.
