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
NeXT Desktop | Json | Yes, from releases after 1.0.0 | Hosted, from a private repository: Windows x64 installer, macOS Apple-silicon DMG, Linux x86_64 AppImage
Stash | Clash | Yes | App Store, paid
Shadowrocket | Clash | Yes | App Store, paid
F-Droid Basic | — | — | F-Droid, for installing other open-source Android apps

The platform tabs list them in this order:

Tab | Clients
----|--------
Windows | Clash Nyanpasu, sing-box, NeXT Desktop
macOS | Clash Nyanpasu, ClashX.Meta, sing-box, NeXT Desktop
Linux | Clash Nyanpasu, sing-box, NeXT Desktop
Android | Clash Meta for Android, sing-box, F-Droid Basic
iOS | Stash, Shadowrocket

Every hosted file comes from the latest GitHub release of the client's own project, so the default catalogue needs nothing from you beyond running `ClientDownload`. NeXT Desktop is the exception: its repository is private, so it also needs a token, set up as described [below](#next-desktop). Until it has one, `ClientDownload` skips it and its download button leads to a missing file, so remove `next_desktop` from `client_config` if you will not be offering it.

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
`sub_type` | Which universal subscription the client's copy button, QR code and import link use: `clash`, `singbox`, or `json` (the account manifest NeXT Desktop reads). Each type used on a tab also adds a "Subscription for …" line at the top of that tab. Leave it out for an app that takes no subscription
`import` | Deep-link template for one-tap import. `%sub%` is the user's universal subscription base (`https://…/sub/<token>`, with no suffix), `%sub_b64%` the base64 of the full link for `sub_type` (Shadowrocket's scheme wants that), `%name%` the site name. Leave it out if the client has no import scheme
`paid` | Whether the client is paid software. Its store button then reads **Buy** instead of **Install**, so users are not surprised
`download` | Present when the client ships a binary the panel can host
`store` | Present when the client is installed from an app store on some platform: a list of `['platform' => …, 'url' => …]`

The `download` block:

Field | Meaning
-------|---------
`source` | `github_release` takes the latest release. `github_pre_release` takes the newest release of any kind, pre-releases included
`repo` | The GitHub repository, as `owner/name`
`private` | `true` for a private repository. See [Private repositories](#private-repositories)
`token` | Optional. A token for this entry alone, used instead of `github_access_token`
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

### Private repositories

A client whose releases live in a private repository is marked `'private' => true` in its `download` block. The public github.com download links answer 404 for a private repository whatever token you send, so for such an entry `ClientDownload` works through the GitHub API instead. It looks the release up with the token and finds each file in the release's asset list. It then requests the file from the API, which redirects to GitHub's file server. The token goes to `api.github.com` only and is not sent on to the file server.

The token is the entry's own `token` if it has one, otherwise `github_access_token`. It needs read access to that repository:

- **Fine-grained token** (recommended): the repository's owner as resource owner, **Only select repositories** with that repository, and **Contents: Read-only** under repository permissions. A fine-grained token can also read every public repository, so the same token can serve as `github_access_token`.
- **Classic token**: the `repo` scope. That grants access to every private repository your account can reach, so prefer a fine-grained one.

What goes wrong, and what `ClientDownload` says:

- **No token at all**: the entry is skipped with a message naming the two places a token can go. No request is made.
- **A token that cannot read the repository, or has expired**: GitHub answers 404 or 401 to the release lookup, the entry is skipped, and its old files stay in place.
- **A `remote` name the release does not have**: that file is reported as missing from the release, and the client's version is not recorded, so the next run tries again.

`config/client.php` now holds a secret. Keep it out of anything you share, as you would `config.php`.

## NeXT Desktop

NeXT Desktop is the panel's own desktop client, for Windows, macOS and Linux. A user pastes their universal subscription link once, and it shows their traffic, class and expiry beside the connect button. It runs either sing-box or mihomo, both bundled, with the profiles the panel generates. The [user guide](../user-guide/next-desktop.md) covers using it.

The example catalogue ships it as `next_desktop`, last on the three desktop tabs:

```php
'next_desktop' => [
    'name' => 'NeXT Desktop',
    'sub_type' => 'json',
    'import' => 'next-desktop://install-config?url=%sub%&name=%name%',
    'paid' => false,
    'download' => [
        'source' => 'github_release',
        'repo' => 'The-NeXT-Project/NeXT-Desktop',
        'private' => true,
        'token' => '',
        'files' => [
            ['platform' => 'windows', 'remote' => 'NeXT-Desktop-%tagName1%-windows-x64-setup.exe', 'local' => 'NeXT-Desktop-setup.exe'],
            ['platform' => 'macos',   'remote' => 'NeXT-Desktop-%tagName1%-macos-arm64.dmg',        'local' => 'NeXT-Desktop.dmg'],
            ['platform' => 'linux',   'remote' => 'NeXT-Desktop-%tagName1%-linux-x86_64.AppImage', 'local' => 'NeXT-Desktop.AppImage'],
        ],
    ],
],
```

To offer it:

1. **Get a token.** Your GitHub account needs read access to `The-NeXT-Project/NeXT-Desktop`. Create a fine-grained token with `The-NeXT-Project` as resource owner, **Only select repositories** → `NeXT-Desktop`, and **Contents: Read-only**. If the organisation requires approval for fine-grained tokens, the token works once it is approved.
2. **Put it in the entry**, as `'token' => 'github_pat_…'` in `config/client.php`, or set it as `github_access_token` in `config.php` so every client uses it.
3. **Fix the sing-box profile on an older install.** NeXT Desktop bundles sing-box 1.14, which refuses the `'detour' => 'direct'` that older copies of `config/appprofile.php` set on the `http_clients` entry, so the profile cannot download its rule sets and will not start. `appprofile.example.php` no longer sets it. Delete that line from your own `config/appprofile.php`; upgrades never update the file.
4. **Run `php next-cli ClientDownload`** and check that it reports all three NeXT Desktop files as saved.

On an install that predates the entry, also copy the `next_desktop` block into `config/client.php` and add `'next_desktop'` to the `windows`, `macos` and `linux` lists in `client_config`.

**Import into NeXT Desktop** opens a `next-desktop://` link carrying the bare universal link, which the app turns into the Json manifest itself. The app asks before adding a new subscription, and only updates one it already has. The installer registers the scheme on Windows (the portable zip does not), the app bundle on macOS, and the app itself on its first start on Linux. Only releases after 1.0.0 handle it: on 1.0.0 the button does nothing, and users copy the Json link from the button beside it and paste it in instead. The `json` type also adds a "Subscription for Json" line to each desktop tab.

The release also has Windows arm64, Intel Mac and Linux arm64 builds, a portable Windows zip and a Linux tarball. To host one of them, add a file entry with its asset name and a fixed `local` name. Only the first file for each platform gets a button, as with every client, so users need the direct link to anything else.

Without object storage, the hosted installers are public: anyone with the `/clients/…` URL can download them. Configure a backend if downloads should be limited to signed-in users.

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
