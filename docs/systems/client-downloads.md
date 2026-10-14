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

:::note
`config/client.php` belongs to your install, and `update.sh` never touches it. A client a release adds to, renames in or drops from `config/client.example.php` reaches your site only when you copy the change across, so compare the two after an upgrade:

```bash
diff config/client.example.php config/client.php
```
:::

### What ships by default

Client | Subscription | One-tap import | Obtained from
-------|--------------|----------------|--------------
Clash Nyanpasu | Clash | Yes | Hosted: Windows x64 installer, macOS Apple-silicon DMG, Linux x64 AppImage
ClashX.Meta | Clash | Yes | Hosted: macOS zip
Clash Meta for Android | Clash | Yes | Hosted: universal APK
sing-box | SingBox | Yes | Hosted: SFW (Windows x64), SFM (macOS universal pkg), SFL (Linux amd64 `.deb`), SFA (Android universal APK)
Stash | Clash | Yes | App Store, paid
Shadowrocket | Clash | Yes | App Store, paid
F-Droid Basic | — | — | F-Droid, for installing other open-source Android apps

The platform tabs list them in this order:

Tab | Clients
----|--------
Windows | Clash Nyanpasu, sing-box
macOS | Clash Nyanpasu, ClashX.Meta, sing-box
Linux | Clash Nyanpasu, sing-box
Android | Clash Meta for Android, sing-box, F-Droid Basic
iOS | Stash, Shadowrocket

Every hosted file comes from the latest GitHub release of the client's own project, so the default catalogue needs nothing from you beyond running `ClientDownload`.

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
            ['platform' => 'linux',   'remote' => 'Clash.Nyanpasu_%tagName1%_amd64.AppImage', 'local' => 'Clash.Nyanpasu.AppImage'],
            ['platform' => 'macos',   'remote' => 'Clash.Nyanpasu_%tagName1%_aarch64.dmg',    'local' => 'Clash.Nyanpasu_aarch64.dmg'],
        ],
    ],
],
```

The key (`clash_nyanpasu`) is the client's id. It is what `client_config` refers to and what `cache/clients.json` records the downloaded version under, so keep it stable.

Field | Meaning
-------|---------
`name` | Shown in the UI and in the button labels
`sub_type` | Which universal subscription the client's copy button, QR code and import link use: `clash` or `singbox`. Each type used on a tab also adds a "Subscription for …" line at the top of that tab. Leave it out for an app that takes no subscription
`import` | Deep-link template for one-tap import. `%sub%` is the user's universal subscription base (`https://…/sub/<token>`, with no suffix), `%sub_b64%` the base64 of the full link for `sub_type` (Shadowrocket's scheme wants that), `%name%` the site name. Leave it out if the client has no import scheme
`paid` | Whether the client is paid software. Its store button then reads **Buy** instead of **Install**, so users are not surprised
`download` | Present when the client ships a binary the panel can host
`store` | Present when the client is installed from an app store on some platform: a list of `['platform' => …, 'url' => …]`

The `download` block:

Field | Meaning
-------|---------
`source` | `github_release` takes the latest release. `github_pre_release` takes the newest release of any kind, pre-releases included
`repo` | The GitHub repository, as `owner/name`
`files` | One entry per file: `platform` (`windows`, `macos`, `linux`, `android` or `ios`), `remote` (the asset's name on the release) and `local` (the name it is saved and served under)

In `remote`, `%tagName%` expands to the release tag and `%tagName1%` to the tag without its leading `v` (`v1.2.0` → `1.2.0`), which is how most projects name their assets. `local` takes no placeholders. The dashboard links to it exactly as written, so it has to stay the same from one release to the next.

A platform gets one button per client, for that client's first file on it. A second file for the same platform, say an arm64 build beside the x64 one, is still downloaded and may be requested by name, but nothing on the dashboard links to it. A hosted file wins over a store link for the same platform.

`$_ENV['client_config']` at the end of the file lists the platform tabs, in display order, and which clients each one shows, in order. A client can be in the catalogue without being offered. An id listed on a tab where the client has neither a file nor a store link is skipped rather than drawn as a broken button.

## Fetching the binaries

```bash
php next-cli ClientDownload
```

For each catalogue entry with a `download` block, it asks GitHub for the latest release, compares the tag against `cache/clients.json`, and downloads anything that has moved. Unchanged clients are skipped, so a repeat run is cheap.

A failed download never leaves you worse off than before:

- Each file goes to `<local>.download` first and replaces the old file only once it has arrived in full. If a download fails, the previous version stays in place and users can still download it.
- The new tag is written to `cache/clients.json` only after **every** file of that client has arrived. If one fails, the next run tries the client again instead of thinking it is up to date.
- A client whose release cannot be looked up, because of a rate limit or a renamed repository, is skipped, and the rest carry on.

To force a client to be fetched again, delete its id from `cache/clients.json`.

Weekly is a reasonable cadence. It does not belong in the five-minute job, because it moves hundreds of megabytes. Put it in the crontab of the user that owns the panel files (`crontab -u www-data -e`, or `nginx` on RHEL):

```bash
0 4 * * 1 /usr/bin/php /path/to/your/site/next-cli ClientDownload
```

Two guards worth knowing about:

- **It refuses to run as the wrong user.** If the effective user differs from the owner of the panel files, it exits rather than writing files the web server cannot read afterwards.
- **It needs the catalogue.** Without `config/client.php` it exits with a message rather than doing nothing quietly.

### GitHub token

Each client costs one GitHub API request per run, to look up its latest release. The downloads themselves come from github.com and do not count. Without a token, GitHub allows 60 API requests an hour per IP address, and a shared or busy server address can use them up before the job starts. Set `$_ENV['github_access_token']` in `config.php` to raise the limit to 5,000 an hour. For public repositories, a fine-grained personal access token with **Public repositories (read-only)** access and no permissions is enough, as is a classic token with no scopes.

## Serving them

Downloaded files land in `public/clients/`. What happens next depends on `Admin` → `Settings` → `Object storage`.

**With no backend configured**, the web server serves them straight from disk at `/clients/<local>`. Fine for a small site, but every download competes with the panel for bandwidth, and anyone who has the URL can download the file, signed in or not.

**With a backend configured**, `ClientDownload` uploads each file to the bucket as it fetches it, and nothing stays in `public/clients/`. The dashboard links to `/user/clients/<local>`, which only signed-in users can open. It redirects to a presigned URL valid for **Presigned URL lifetime** minutes (10 by default). The bucket stays private, so nothing is publicly listable, and the transfer never touches the panel.

Backends: Cloudflare R2, Alibaba Cloud OSS, Tencent Cloud COS, and anything S3-compatible (MinIO, Backblaze B2, Wasabi).

The requested filename is checked against the `local` names in the catalogue before a URL is minted, so the endpoint cannot be used to mint URLs for arbitrary objects in the bucket.

## The dashboard UI

The download card is built from the catalogue, one tab per platform. Each client gets up to three buttons:

- **Download &lt;client&gt;** points at the hosted file. A store entry reads **Install &lt;client&gt;**, or **Buy &lt;client&gt;** if it is paid, and opens the store page in a new tab;
- **Copy the &lt;type&gt; subscription link**, with a QR-code button beside it, copies the link for the client's `sub_type`;
- **Import into &lt;client&gt;** builds the deep link from the `import` template and the user's own subscription.

Store-only entries — Stash and Shadowrocket on iOS, F-Droid Basic on Android — carry a `store` block instead of a `download` block. The panel cannot host an App Store app, and pretending otherwise would produce a broken button.
