---
sidebar_position: 9
---

# Web Assets

The front-end libraries the panel ships — Tabler, DataTables, htmx, ApexCharts, TinyMCE and the rest — are described in one catalogue and can be served from three different places.

## The catalogue

`App\Services\Assets::PACKAGES` is the single source of truth: for each library, its npm package name, the version shipped with the release, the files it contributes, and the path each file lives at on the site.

It feeds both consumers: the `assets` array handed to templates, and the `Assets` CLI (which packages to query on npm, which files to download).

The in-site path doubles as the custom-CDN path, minus the `/assets` prefix, so each file is declared once and works in all three delivery modes.

Two entry kinds are special:

- **`vendored`** packages (TinyMCE) ship as a whole directory. Their local copy is maintained in git rather than downloaded file by file.
- **`extra`** files (the Tabler icon webfonts) are downloaded alongside their package but never exposed to templates. They exist because a stylesheet references them, not because a template does.

Adding or moving a library means editing the catalogue and nothing else.

## Where assets are served from

`$_ENV['assets_cdn']` in `config.php`:

Mode | Serves from | Needs
------|-------------|-------
`local` | `public/assets/` on your own server | The files on disk
`jsdelivr` | jsDelivr, addressed by npm package and version | Nothing
`custom` | Your own CDN at `custom_assets_cdn_url` | The files uploaded there

`jsdelivr_url` picks which jsDelivr hostname to use — `fastly.jsdelivr.net`, `cdn.jsdelivr.net` or `testingcf.jsdelivr.net`.

In `jsdelivr` mode a version change takes effect on the next page load, because the version is part of the URL. In `local` and `custom` mode the files must actually be present at the new version first.

## Changing versions

Two tools do this, and the difference matters.

### Per-install: the CLI

```bash
php next-cli Assets list                  # Current version of each package
php next-cli Assets check                 # Compare against the latest on npm
php next-cli Assets update [name|all]     # Pin to the latest on npm
php next-cli Assets pin <name> <version>  # Pin one package to a version
php next-cli Assets download [name|all]   # Download local copies at current versions
php next-cli Assets reset [name|all]      # Drop pins, back to the shipped defaults
```

Pins are written to `cache/assets.json`, which is gitignored. The catalogue defaults are layered under them, so a corrupt or missing pin file simply falls back to the shipped versions rather than breaking the site.

This is the administrator's tool. It never touches the source.

In `local` or `custom` mode, a pin is only half the job — run `Assets download` afterwards, or the site will reference a version that is not there.

### Shipped defaults: the dev script

```bash
composer update-assets
composer update-assets -- --dry-run
```

[`dev/update-assets.php`](https://github.com/The-NeXT-Project/NeXT-Panel/blob/dev/dev/update-assets.php) rewrites the `version` values in the catalogue itself and refreshes `public/assets`, so the bump reaches every install on their next upgrade.

It is a dev-machine tool: it needs neither `config.php` nor a database, and it is excluded from the Docker image.

Before bumping anything it issues a `HEAD` for every path the package declares at the new version, and refuses the bump if a path has moved. That check exists because a library once silently relocated its distribution files and the bump shipped a broken page.

Its rewrite is anchored on both the catalogue key and the npm package name and must match exactly once. If it cannot, it bails out and asks for a hand edit rather than guessing.

## `public/assets` is tracked by git

The vendored copies are committed, which has one practical consequence: `Assets download` leaves you with a dirty working tree, and `./update.sh dev` does a hard reset. Commit or stash before upgrading, or the downloaded files are discarded.

Upgrades of these libraries produce very large diffs. That is expected — treat `public/assets` as third-party code.

## Certificates

The CLI verifies TLS against the CA bundle shipped with Composer when PHP's `curl.cainfo` is unset, which it often is on minimal container images. Without that fallback, `Assets check` and `Assets download` fail on a correctly configured server for reasons that have nothing to do with the panel.
