---
sidebar_position: 8
---

# Client Downloads

The panel can host the client software its users need, so a new user has one place to go rather than hunting GitHub releases. Three things read from one catalogue, which is the point of the design.

## The catalogue

`config/client.php` — copied from `config/client.example.php` — defines every client the site offers. It is the single source of truth for:

1. the `ClientDownload` CLI, which decides which binaries to fetch;
2. the download allow-list in the user-facing controller, which decides what may be requested;
3. the per-platform download UI on the user dashboard.

Adding, removing or renaming a client means editing the catalogue and nothing else.

### An entry

```php
'clash_nyanpasu' => [
    'name' => 'Clash Nyanpasu',
    'sub_type' => 'clash',
    'import' => 'clash-nyanpasu://subscribe-remote-profile?url=%sub%&name=%name%',
    'paid' => false,
    'download' => [
        'source' => 'github_release',
        'repo' => 'LibNyanpasu/clash-nyanpasu',
        'files' => [
            ['platform' => 'windows', 'remote' => 'Clash.Nyanpasu_%tagName1%_x64-setup.exe', 'local' => 'Clash.Nyanpasu.exe'],
            ['platform' => 'linux',   'remote' => 'clash-nyanpasu_%tagName1%_amd64.AppImage', 'local' => 'Clash.Nyanpasu.AppImage'],
            ['platform' => 'macos',   'remote' => 'Clash.Nyanpasu_%tagName1%_aarch64.dmg',    'local' => 'Clash.Nyanpasu_aarch64.dmg'],
        ],
    ],
],
```

Field | Meaning
-------|---------
`name` | Shown in the UI
`sub_type` | Which universal subscription the import button uses — `clash` or `singbox`
`import` | Deep-link template for one-tap import. `%sub%` is the user's universal subscription base, `%name%` the site name
`paid` | Whether the client itself is paid software, so users are not surprised
`download` | Present when the client ships a binary the panel can host
`store` | Present when the client is installed from an app store on some platform

`source` is `github_release` or `github_pre_release`. In `remote`, `%tagName1%` expands to the release tag without a leading `v`, which is how most projects name their assets.

`$_ENV['client_config']` at the end of the file lists which clients appear on which platform tab, and in what order. A client can be in the catalogue without being offered.

## Fetching the binaries

```bash
php next-cli ClientDownload
```

For each catalogue entry with a `download` block, it asks GitHub for the latest release, compares the tag against `cache/clients.json`, and downloads anything that has moved. Unchanged clients are skipped, so a repeat run is cheap.

Weekly from cron is a reasonable cadence. It does not belong in the five-minute job — it moves hundreds of megabytes.

Two guards worth knowing about:

- **It refuses to run as the wrong user.** If the effective user differs from the owner of the panel files, it exits rather than writing files the web server cannot read afterwards.
- **It needs the catalogue.** Without `config/client.php` it exits with a message rather than doing nothing quietly.

GitHub rate-limits unauthenticated API requests aggressively. Set `$_ENV['github_access_token']` in `config.php` — any token with no scopes is enough — or the job will start failing on a site with more than a handful of clients.

## Serving them

Downloaded files land in `public/clients/`. What happens next depends on `Admin` → `Settings` → `Object storage`.

**With no backend configured**, the panel serves them from disk. Fine for a small site; every download competes with the panel for web server bandwidth.

**With a backend configured**, `ClientDownload` uploads each file to the bucket as it fetches it, and a user clicking download is redirected to a presigned URL valid for **Presigned URL lifetime** minutes (10 by default). The bucket stays private — nothing is publicly listable — and the transfer never touches the panel.

Backends: Cloudflare R2, Alibaba Cloud OSS, Tencent Cloud COS, and anything S3-compatible (MinIO, Backblaze B2, Wasabi).

The requested filename is checked against the catalogue before a URL is minted, so the endpoint cannot be used to mint URLs for arbitrary objects in the bucket.

## The dashboard UI

The download card is built from the catalogue, grouped by platform tab. Each client gets an import button, a download button, or both:

- **Import into &lt;client&gt;** builds the deep link from the `import` template and the user's own subscription;
- **Download** points at `/user/clients/{name}` for a hosted binary, or straight at the app store for a store-only entry.

Store-only entries — Stash and Shadowrocket on iOS, F-Droid Basic on Android — carry a `store` block instead of a `download` block. The panel cannot host an App Store app, and pretending otherwise would produce a broken button.
