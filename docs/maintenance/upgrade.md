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

The development branch does not carry the built page bundle, so `update.sh dev` builds it on your server. That needs **Node.js 22.12 or newer** (not 23) and npm; on Debian and Ubuntu, `apt install nodejs npm`. The script checks for Node before it fetches anything and stops without changing your install if it is missing.

```bash
bash update.sh dev
```

:::caution The first upgrade to a version with the page bundle
If your install is older than the page bundle, the `update.sh` it runs is the old one: it fetches the new code and builds nothing, and every page then answers with an error. The run ends with a warning saying so. Install Node.js first, then run `bash update.sh dev` a second time; the second run uses the new script and builds the bundle.
:::

:::caution
`update.sh dev` runs `git reset --hard origin/dev`. Any local modification to a tracked file is discarded, including anything changed under `public/assets`. Commit or stash first.
:::

## What update.sh does

Both modes run the same five steps and finish by checking the page bundle. `dev` first fetches the code, updates Composer dependencies and builds the page bundle; the release archive comes with the bundle already built, so `oss` builds nothing and needs no Node.js.

Step | Command | Why
------|---------|-----
Clear the template cache | `rm -r cache/smarty/compile/*` | Compiled templates from the old version would otherwise be reused
Clear the translation cache | `rm -f cache/translation/*` | Compiled catalogues from the old version would otherwise be reused, so new strings show as their raw keys
Migrate the config file | `php next-cli Config migrateFile` | Merges keys new in this release into your `config/config.php`
Import the DB config | `php next-cli Config import` | Adds settings new in this release and syncs changed defaults
Migrate the database | `php next-cli Migration latest` | Applies every new migration
Check the page bundle | `php next-cli Frontend check` | Says whether `public/build` belongs to the code beside it

`dev` builds the bundle with `npm ci --omit=dev` and `npm run build`, into a directory beside the live one that it then swaps in, so the site keeps serving the old bundle until the new one is complete. If the build fails, the old bundle stays and the script tells you; fix the error and run it again.

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
New text shows as raw keys such as `user.setting.title` | The translation cache was not cleared. Run `rm -f cache/translation/*`
Every page shows an error right after an upgrade | The page bundle is missing or was built from older code. `php next-cli Frontend check` says which; run `bash update.sh dev` again, or `npm ci --omit=dev && npm run build`
Styling is broken | The web server is not serving `public/assets`, or a file there was changed or deleted. Restore it with `git checkout -- public/assets`
The panel is up but nothing activates | Cron is not running, or is running as the wrong user
