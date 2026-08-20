---
sidebar_position: 1
---

# Upgrade

## Before you start

Take a backup of both the site files and the database. Migrations can be rolled back, but a failed upgrade halfway through is not a state you want to reason about without one. See [Backup your site](../advanced/backup-your-site.md).

Check `Admin` → `System` for the version you are on and the database version, so you know what changed.

## Release edition

Download the latest `NeXT-Panel-*.zip` from the releases page and overwrite the existing files, keeping `config/` intact. Then:

```bash
bash update.sh oss
```

## Development branch

```bash
bash update.sh dev
```

:::caution
`update.sh dev` runs `git reset --hard origin/dev`. Any local modification to a tracked file is discarded — including files written by `next-cli Assets download`, since `public/assets` is tracked. Commit or stash first.
:::

## What update.sh does

Both modes run the same four steps; `dev` adds fetching the code and updating Composer dependencies first.

Step | Command | Why
------|---------|-----
Clear the template cache | `rm -r cache/smarty/compile/*` | Compiled templates from the old version would otherwise be reused
Migrate the config file | `php next-cli Config migrateFile` | Merges keys new in this release into your `config/config.php`
Import the DB config | `php next-cli Config import` | Adds settings new in this release and syncs changed defaults
Migrate the database | `php next-cli Migration latest` | Applies every new migration

Running them by hand does the same thing, which is what to do if the script fails partway and you want to see each step's output.

## Afterwards

Check | How
-------|-----
The panel loads | Open it
The database version advanced | `Admin` → `System`
Cron still runs | `Admin` → `System` → **Last daily job run**, on the next daily boundary
Nothing new is broken | `Admin` → `System log`

Two upgrade-specific steps, when the release notes mention them:

- **Discord commands changed** — re-run **Initialise the bot** on `Settings` → `IM`, or the new commands never register.
- **The sing-box profile changed** — tell users to re-fetch their subscription, or their client keeps the old schema.

## Troubleshooting

Symptom | Cause
---------|-------
A config item is reported missing | `Config import` did not run. Run it
Pages render with the old layout | The Smarty compile cache was not cleared
Styling is broken in `local` asset mode | `public/assets` was reset by `git reset --hard`. Re-run `next-cli Assets download`
The panel is up but nothing activates | Cron is not running, or is running as the wrong user
