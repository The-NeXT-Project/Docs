---
sidebar_position: 9
---

# Web Assets

The front-end libraries the panel ships - Tabler, DataTables, htmx, ApexCharts, TinyMCE and the rest - are described in one catalogue, and pages load them only from the copies shipped with the release.

## The catalogue

`App\Services\Assets::PACKAGES` is the single source of truth: for each library, its npm package name, the version shipped with the release, the files it contributes, and the path each file lives at on the site.

It feeds the `assets` array handed to templates, the `Assets` CLI (which packages to look up on npm) and the dev script that bumps versions (which files to download).

**`extra`** files are downloaded alongside their package but never exposed to templates. They exist because something else loads them, not because a template does: TinyMCE fetches its theme, model, icons, enabled plugins and light/dark skins from its base URL at runtime. Only the `.min` files the editor actually requests are listed, so the local TinyMCE folder holds 24 files rather than the whole npm package. Enabling another editor plugin means adding its `plugin.min.js` to the catalogue as well.

**Fonts and images a stylesheet references** with a relative `url()` - the Tabler icon font subsets, the flag and payment SVGs, the JSON editor icons - are not listed in the catalogue at all. They are read out of the shipped stylesheet and downloaded next to it, because upstream changes them without notice: Tabler Icons 3.51 split its single font into about fifty subset files, and while the catalogue still listed the old font, every icon on the site failed to load.

Adding or moving a library means editing the catalogue and nothing else.

## Where assets are served from

Always `public/assets/` on your own server. Every asset URL is a local path with the shipped version appended (`/assets/css/tabler.min.css?v=<version>`), so browsers fetch the new files after an upgrade instead of mixing cached old CSS with new JavaScript.

There is no CDN mode and no way to change a version on a single install. Older releases had `assets_cdn`, `custom_assets_cdn_url` and per-install pins in `cache/assets.json`; these are ignored now, and `update.sh` removes the two settings from `config.php`. A leftover `cache/assets.json` can be deleted.

`jsdelivr_url` is still in `config.php`, but only for the sing-box rule-set URLs in subscriptions. Pages never load from it.

## Checking versions

```bash
php next-cli Assets list    # Version of each package shipped with this release
php next-cli Assets check   # Compare against the latest on npm
```

Both are read-only. A newer release on npm reaches your install with a panel upgrade.

## Changing versions: the dev script

```bash
composer update-assets
composer update-assets -- --dry-run
composer update-assets -- --refresh    # Re-download the current versions, no bump
```

[`dev/update-assets.php`](https://github.com/The-NeXT-Project/NeXT-Panel/blob/dev/dev/update-assets.php) rewrites the `version` values in the catalogue itself and refreshes `public/assets`, so the bump reaches every install on their next upgrade. It is the only way to change a version.

It is a dev-machine tool: it needs neither `config.php` nor a database, and it is excluded from the Docker image.

Before bumping anything it issues a `HEAD` for every path the package declares at the new version, and refuses the bump if a path has moved. That check exists because a library once silently relocated its distribution files and the bump shipped a broken page.

Its rewrite is anchored on both the catalogue key and the npm package name and must match exactly once. If it cannot, it bails out and asks for a hand edit rather than guessing.

After writing a new stylesheet it downloads every font and image that stylesheet references. `--refresh` does the same at the versions already in the catalogue, to fill in files that are missing. Neither deletes files a new stylesheet no longer references; remove those by hand before committing.

Commit the catalogue and `public/assets` together. The test suite fails if a file the catalogue names, or a file a shipped stylesheet references, is missing.

## `public/assets` is tracked by git

The local copies are committed, so `./update.sh dev`, which does a hard reset, restores them to the shipped state. Don't edit them on a server; local changes are discarded on the next upgrade.

Upgrades of these libraries produce very large diffs. That is expected - treat `public/assets` as third-party code.

## Certificates

The CLI and the dev script verify TLS against the CA bundle shipped with Composer when PHP's `curl.cainfo` is unset, which it often is on minimal container images. Without that fallback, `Assets check` fails on a correctly configured server for reasons that have nothing to do with the panel.
