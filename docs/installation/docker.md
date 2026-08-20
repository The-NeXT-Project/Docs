# Docker

The Pro edition ships a turnkey container setup: `docker compose up` gives you a running panel with its database, Redis, Cron and an administrator account already created.

This is the fastest way to get an installation you can look at. For a production deployment, read [Going to production](#going-to-production) before you expose it.

## Requirements

Docker with the Compose plugin. Nothing else — PHP, the extensions, the web server and Cron all live in the image.

## Starting it

From a checkout of the panel:

```bash
docker compose up -d
```

The panel is at `http://localhost:8080`, and you can sign in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `docker-compose.yml`.

## What the first boot does

The container's startup script performs the whole installation, in order:

1. Copies `config.example.php` and `appprofile.example.php` into place, if they are not already there.
2. Injects the database and Redis connection settings, and the site URL, from the environment.
3. Generates `key` and `muKey` if they were not supplied, and persists them.
4. Fixes ownership on the writable directories.
5. Waits for MariaDB to accept connections — up to a minute.
6. Runs `Migration new` and then `Migration latest`, seeding the schema and applying anything pending.
7. Runs `Config import` to populate the settings table.
8. Creates the administrator, but **only if the panel has no users at all**, so restarts do not repeatedly try and fail.
9. Optionally pre-downloads client binaries.

Every step is idempotent. Restarting the container re-runs the script and changes nothing that is already done.

## Environment

Variable | Default | Notes
----------|---------|-------
`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | the bundled `db` service | Point them elsewhere to use an external database
`REDIS_HOST`, `REDIS_PORT` | the bundled `redis` service | —
`APP_URL` | `http://localhost:8080` | Becomes `baseUrl`. Must match how users actually reach the site
`ADMIN_EMAIL`, `ADMIN_PASSWORD` | — | The initial administrator. Only used when the user table is empty
`DOWNLOAD_CLIENTS` | `false` | `true` fetches client binaries on boot. Adds several minutes and a lot of bandwidth
`APP_KEY` | generated | The session signing key
`APP_MUKEY` | generated | The legacy node communication key

### About the generated secrets

Left blank, `APP_KEY` and `APP_MUKEY` are generated once on first boot and persisted in the `config_data` volume. They are never rotated automatically, and that is deliberate: rotating `key` signs every user out, and rotating `muKey` breaks every node still on the legacy API.

For production, set both explicitly so they live in your own configuration management rather than only in a Docker volume.

## Volumes

Volume | Holds
--------|-------
`config_data` | The generated `config/` directory — including the secrets
`clients_data` | Downloaded client binaries
`db_data` | MariaDB
`redis_data` | Redis

Losing `config_data` means losing `key` and `muKey`, which signs everyone out and breaks node authentication. Back it up with the database.

## Cron

Cron runs inside the app container, every five minutes, as `www-data`. Nothing to install — but it does mean the container must stay up for orders to activate and mail to be sent.

## Going to production

The shipped compose file is a demonstration. Before real users touch it:

- **Change every password.** `MYSQL_ROOT_PASSWORD`, `MYSQL_PASSWORD`, `ADMIN_PASSWORD` and the matching `DB_PASSWORD` are all published defaults.
- **Set `APP_KEY` and `APP_MUKEY` explicitly.**
- **Put TLS in front of it.** The container serves plain HTTP on port 80, mapped to 8080. The session cookie is `Secure` and `__Host-`-prefixed, so a browser will refuse to store it over plain HTTP — sign-in cannot work without HTTPS. Terminate TLS at a reverse proxy and set `APP_URL` to the `https://` address.
- **Do not expose the database or Redis ports.** The compose file does not; keep it that way.
- **Pin the image versions** rather than tracking a moving tag.

## Upgrading

```bash
docker compose build --no-cache app
docker compose up -d
```

The startup script re-runs the migration and config-import steps, so the schema and settings catch up automatically. Back up `db_data` and `config_data` first.

## Troubleshooting

```bash
docker compose logs -f app
```

The startup script narrates every step, which makes a failed boot easy to place.

Symptom | Cause
---------|-------
Boot stops at "Waiting for MariaDB" | The database never became healthy. Check its own logs
Sign-in appears to succeed then bounces back | The site is being served over plain HTTP. The session cookie requires HTTPS
No administrator was created | The user table was not empty. Use `docker compose exec app php next-cli Tool createAdmin`
