---
sidebar_position: 2
---

# Configuration

Settings come from two distinct places. Knowing which one you are touching saves a great deal of confusion, because they behave nothing alike.

Store | Read as | Changed from | Takes effect
-------|---------|--------------|-------------
File config | `$_ENV['key']` | Editing `config/config.php` on the server | Next request
Database config | `Config::obtain('item')` | The admin panel | Immediately

## File config

`config/config.php`, `config/appprofile.php` and the optional `config/client.php` do nothing but assign into the `$_ENV` superglobal. They are per-install, gitignored, and created by copying the committed `*.example.php` templates.

This is where infrastructure and secrets live — things that are fixed when you deploy and that an administrator should not be able to change from a web form:

Group | Examples
-------|----------
Identity | `appName`, `baseUrl`, `logoUrl`
Secrets | `key` (the session signing key), `muKey`, `pwdMethod`
Database | `db_host`, `db_database`, credentials, read/write split
Redis | `redis_host`, `redis_port`, TLS options
Subscriptions | `enable_sub`, `sub_urls`, `sub_token_len`
Rate limits | Every `rate_limit_*` value
Node detection | `detect_gfw_url`, `enable_detect_offline`
Audit banning | `auto_detect_ban_number`, `auto_detect_ban_time`
Assets | `assets_cdn`, `jsdelivr_url`, `custom_assets_cdn_url`
Third parties | `sentry_dsn`, `maxmind_*`, `abuseipdb_*`, `github_access_token`

`config/appprofile.php` is loaded by the web entry point only, not by the CLI.

### Keeping it current across upgrades

New releases add keys. `php next-cli Config migrateFile` merges anything new from `config.example.php` into your `config.php`, keeping your values, and reports keys you have that the example no longer does — those are candidates for deletion. `update.sh` runs it for you.

## Database config

The `config` table holds the admin-tunable settings — everything under `Admin` → `Settings`. Each row carries its item name, its current value, its class (which settings page it belongs to), its type and its default.

Reading it in code:

```php
Config::obtain('checkin_max');   // One item, cast to its declared type
Config::getClass('billing');     // Every item in a class, as an associative array
```

`obtain()` returns the value already cast — an `int` item comes back as an int, a `bool` as a bool, an `array` as a decoded array. Code should never have to think about the fact that the column is a string.

### Where the defaults come from

[`config/db.json`](https://github.com/The-NeXT-Project/NeXT-Panel/blob/dev/config/db.json) is the catalogue: every item the panel knows about, with its class, type, default value and whether it is public.

```bash
php next-cli Config import
```

imports it. This is what happens on a fresh install, and again on every upgrade — it adds items that are new in the release, and syncs a changed default onto installs that never customised that item. Values you *have* customised are left alone.

Doing it on import rather than through a migration is deliberate: a default is not schema, and expressing "this default changed" as a dated migration meant the two could drift apart.

```bash
php next-cli Config reset
```

throws away every customisation and restores the catalogue defaults. It is a recovery tool, not a maintenance one.

### A missing item is an error

Asking for an item that is not in the table raises rather than returning an empty string. An empty string is indistinguishable from a genuinely blank setting, and a typo that silently disabled a feature was worth more than the inconvenience of a loud failure.

If you see one after an upgrade, you skipped `Config import` — run it.

## Which store should a new setting use

Question | Answer
----------|--------
Should an administrator be able to change it from the web? | Database
Is it a credential for the database or Redis themselves? | File — the database cannot configure the database
Is it needed before the database connection exists? | File
Does changing it require a deploy anyway? | File
Otherwise | Database

The `TODO: move these settings to DB` comments in `config.example.php` mark settings that are on the wrong side of this line and are expected to move — mail filtering, audit ban thresholds, node detection, MaxMind credentials.

## The schema and the code

The `config` table's own schema, and the model methods that read it, are documented in [Database Configuration](../design-document/database-setting.md).
