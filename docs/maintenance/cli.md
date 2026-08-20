---
sidebar_position: 2
---

# CLI Reference

```bash
php next-cli            # List every command
php next-cli <Command> [args]
```

Commands are auto-discovered from `app/Services/Cli/`; the class name is the command name, and it is case-sensitive.

Run the CLI as the user that owns the panel files. Several commands write into `cache/`, and files owned by root break the web server afterwards.

## Migration

```bash
php next-cli Migration new       # Fresh, empty database
php next-cli Migration latest    # Bring an existing database up to date
php next-cli Migration <version> # Migrate to a specific version, forwards or back
```

Migrations are dated files in `db/migrations/`. The current version is stored as `db_version` in the `config` table and shown on `Admin` → `System`.

`new` refuses to run against a database that already has tables — it is for installation only. Migrating to an older version rolls back, which is a real operation and a real risk: take a backup first.

## Config

```bash
php next-cli Config import       # Sync the config table from config/db.json
php next-cli Config migrateFile  # Merge new keys into config/config.php
php next-cli Config reset        # Restore every DB config item to its default
```

`import` adds items new in this release and syncs changed defaults onto items you never customised; your own values are untouched. Run it after every upgrade — `update.sh` does.

`migrateFile` merges keys added to `config.example.php` into your `config.php`, keeping your values, and reports keys you have that the example no longer does.

`reset` discards every customisation. It is a recovery tool.

See [Configuration](../systems/configuration.md) for what the two stores are.

## Cron

```bash
php next-cli Cron
```

The scheduled job. Install it in the system crontab at five-minute intervals; see [Scheduled tasks](../systems/scheduled-tasks.md).

## I18n

```bash
php next-cli I18n list   # Per-locale coverage
php next-cli I18n check  # Missing keys, extra keys, empty values, broken placeholders
php next-cli I18n scan   # Keys used in code but undefined, and the reverse
```

`check` and `scan` exit non-zero on a problem, so they drop straight into a deployment script. See [Localization](../configuration/localization.md).

## Assets

```bash
php next-cli Assets list | check | update [name|all] | pin <name> <version> | download [name|all] | reset [name|all]
```

Front-end library versions. See [Web assets](../systems/web-assets.md).

## ClientDownload

```bash
php next-cli ClientDownload
```

Fetches client binaries from GitHub releases per `config/client.php`, and uploads them to object storage if a backend is configured. Weekly from cron is a reasonable cadence. See [Client downloads](../systems/client-downloads.md).

## Tool

Operational one-offs. Most of them act on **every** account or **every** node — read the description before running one on a live site.

```bash
php next-cli Tool createAdmin [email] [password]
```

Creates an administrator. Prompts when given no arguments. This is how the first account on a new installation is made.

### Bulk credential resets

Command | Effect
---------|--------
`Tool resetPassword` | New sign-in password for every user. Everyone is signed out and locked out until they use password reset
`Tool resetPasswd` | New connection password and UUID for every user. Every client stops working until subscriptions are re-fetched
`Tool clearSubToken` | New subscription token for every user. Every saved subscription URL stops returning anything
`Tool resetNodePassword` | New communication key for every node. Every backend stops talking to the panel until reconfigured
`Tool generateApiToken` | New API token for every user
`Tool generateGa` | New two-factor secret for every user, invalidating their enrolled authenticators

These are incident-response tools: use them when a secret has leaked site-wide, and expect a support wave afterwards. For one account, use the admin panel.

### Traffic

Command | Effect
---------|--------
`Tool resetBandwidth` | Reset every user's traffic allowance
`Tool resetTodayBandwidth` | Reset today's counters
`Tool resetNodeBandwidth` | Reset every node's traffic counter

### Bulk preferences

Command | Effect
---------|--------
`Tool setLocale` | Set every user's language
`Tool setTheme` | Set every user's theme

Both overwrite choices users made for themselves. Reasonable right after adding a language or replacing a theme; rude otherwise.

### Data and mail

Command | Effect
---------|--------
`Tool sendVerifyEmail` | Send a verification link to every unverified address
`Tool updateGeoIP2` | Refresh the MaxMind GeoIP2 database. Needs `maxmind_account_id` and `maxmind_license_key`
`Tool updateAbuseIPDB` | Refresh the AbuseIPDB data. Needs `enable_abuseipdb` and a key

## Test

```bash
php next-cli Test generateSysLog   # Write example entries to the system log
php next-cli Test sendFinanceMail  # Send a finance report now
```

Development aids. `sendFinanceMail` is the practical one: it confirms the mail driver and the report itself without waiting for midnight.
