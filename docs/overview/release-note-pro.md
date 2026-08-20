---
sidebar_position: 5
---

# Release Note (Pro Edition)

## 24.5.1-Pro

Database version `2026081100`

Everything below is what the Pro edition adds or changes relative to Free Edition [24.5.1](release-note-free.md). It is grouped by subsystem rather than by date, because most of these arrived as several commits over time and the grouping is what you need when deciding whether an upgrade affects you.

### Upgrade notes

Read these before upgrading a live site.

- **Sessions are now JWTs.** The old cookie bundle is cleared on first sign-in after the upgrade. Nobody is signed out by the upgrade itself, but `$_ENV['key']` must be a long random string — it is now the signing key, and changing it invalidates every session at once.
- **`paylist` was renamed to `payment_gateway_log`.** Handled by migration; anything reading that table directly needs updating.
- **The Discord bot must be re-initialised** after upgrading, or its new slash commands never register. `Settings` → `IM` → **Initialise the bot**.
- **The sing-box profile follows the 1.13 schema.** Users should re-fetch their subscription.
- **Shadowsocks support is 2022-only.** Non-2022 single-port multi-user implementations are not standards-compliant and are no longer carried.
- **DB config defaults now sync on `Config import`** rather than through migrations. `update.sh` runs it; a manual upgrade must.

### Authentication and security

- Sessions are signed JWTs in a `__Host-`-prefixed cookie, replacing the legacy cookie bundle. Tokens are bound to the account's credentials, so changing a password or email address invalidates every outstanding session; IP and device are stored as keyed hashes rather than in the clear; sign-out denylists the token in Redis for exactly its remaining lifetime. See [Authentication](../systems/authentication.md).
- Hashing, refund handling, check-in and theme resolution hardened.
- Rate limiting extended to the authentication and password routes, and to the new Server API.
- **List endpoints return only the columns their page displays.** They used to hand back whole rows, so the admin user list shipped every account's password hash, node password, API token and 2FA secret to the browser alongside the fifteen columns it actually draws. Their search and sort parameters are validated rather than trusted as well.
- IM account IDs are treated as opaque strings, fixing precision loss on large Discord and Slack IDs.

### Node API

- **Server API V1** (`/api/server/v1`), replacing `/mod_mu`. Each node authenticates with its own bearer key rather than a shared site-wide `muKey`; the key *is* the node's identity, so no endpoint takes a `node_id` and no node can read or report as another. Adds a heartbeat endpoint, ETag support on `info`, structured error codes and `Retry-After` on rate limits. See [Server API V1](../design-document/server-api.md).
- `/mod_mu` remains available for backends that have not migrated, and gained header-based authentication, but receives no new features.
- Node communication keys are now unique.

### Shop and billing

- **TABP upgrades.** A running time-and-traffic pack can be traded up mid-cycle for the price difference, credited by whichever is smaller — remaining days or remaining traffic. Adds the `superseded` order state so genuine expiries stay countable. See [Shop](../configuration/shop.md#upgrading-a-tabp).
- **Gift cards redeem into a package or balance**, not just balance. Cards issued before the change carry their face value over and redeem unchanged.
- Orders activate the moment a gateway confirms payment rather than waiting for the next Cron tick.
- Gateway callbacks are idempotent, and a genuine duplicate payment is refunded to the account's balance.
- The gateway that actually paid an invoice, and its transaction ID, are recorded.
- Cancelling a paid order refunds it to the account's balance.
- Cancelled-order cleanup, a `class_expire` purchase window, and the missing TABP type checks.
- Gateway amount limits are shown to the user before they commit; the customer can be made to bear a fixed or percentage processing fee.
- PayPal moved back to `srmklive/paypal` now that it is maintained again.

### Admin panel

- **Trends on the home page.** Up to six metrics over 7, 30 or 90 days, with period totals and a comparison against the preceding period. Range and metrics live in the URL, so a view is a link.
- **Node traffic logging.** Daily per-node traffic, with a stacked chart and a retention setting; the busiest nodes are plotted individually and the rest folded into *Other nodes*.
- Every donut on the home page has a chart/table toggle.
- Admin lists render a dash where a zero would be meaningless.
- Node display tags, drawn from a shared tag list so a set stays consistent.
- Announcements gained a title field and a user-facing detail page.
- DataTables rebuilt on the 3.0 core with the Bootstrap 5 layer, fixing header drift and rows escaping their card.
- **Every list is now processed entirely on the server.** Lists used to be fetched whole and paged in the browser, so a large log took as long to open as it took to download. All of them now fetch one page at a time and page, sort and search in the database, which also means searching matches what is stored rather than the text drawn in the cell, and only columns the database can order by offer a sortable header. Sizes sort by their real byte count instead of alphabetically.

### Localization

- **Translation rebuilt as a first-class subsystem** on `symfony/translation`: four locales (`en_US`, `zh_CN`, `zh_TW`, `ja_JP`), six domains, fallback chains, plurals and placeholders, and `next-cli I18n list|check|scan` with CI enforcement.
- **The admin panel is translated**, not just the user-facing side.
- Switching language keeps the visitor on the page they switched from.
- Queued email records the recipient's locale at enqueue time, so each message renders in its own recipient's language.

### Notifications

- Email and IM share one message queue; queued work is claimed with `FOR UPDATE SKIP LOCKED` and drained with a five-minute ceiling per run.
- Ticket reply notifications are delivered immediately rather than on the next Cron tick.
- Multi-level bandwidth warnings — one notification per threshold crossed — plus a final notice when traffic runs out.
- Users are told when any of their three credentials is reset, and which one.
- Node offline and online notifications are batched into one message.
- Mail templates restyled to match the Tabler web theme.
- **OCI Email Delivery** added as a mail driver.

### LLM

- Function calling across every backend, with a read-only toolbox: the ticket author's account, traffic, orders and invoices, plus the site's documentation, announcements, products and nodes.
- LLM replies can be previewed and edited before sending, and individual replies edited or deleted afterwards.
- The assistant's display name is configurable, and the reply language can be pinned or set to follow the user.
- Vertex AI authenticates through Google's official auth library; Gemini thought signatures are returned with tool results.
- Backends and default models modernised; the Hugging Face backend dropped in favour of the OpenAI-compatible one.
- Tickets render as Markdown.

### CAPTCHA

- **Alibaba Cloud Captcha 2.0** and **Tencent Cloud Captcha** added as providers, both region-aware, bringing the total to six.

### Object storage and clients

- Pluggable object storage backed by DB config: Cloudflare R2, Alibaba Cloud OSS, Tencent Cloud COS and any S3-compatible service. Client downloads are served as short-lived presigned URLs from a private bucket.
- The client catalogue is a single source of truth for the downloader, the download allow-list and the dashboard UI.
- sing-box macOS (SFM) alongside SFA; store-only entries for Shadowrocket and F-Droid Basic; Clash Mi removed.

### Web assets

- `Assets::PACKAGES` as the single catalogue, with `next-cli Assets` for per-install pins and `composer update-assets` for shipped defaults. The dev script verifies every declared path at the new version before bumping.
- Falls back to Composer's CA bundle when `curl.cainfo` is unset.

### Protocols

- **AnyTLS** support, including its own subscription format.
- The default sing-box profile follows the 1.13 schema.
- Multiple subscription hostnames via `sub_urls`.

### Logging

- Every bandwidth allocation is logged with its source, so a user's traffic history is complete.
- Cron writes to the system log; log fields are truncated to their column widths, and an entry with no usable client address falls back to `::1` rather than being dropped.

### Infrastructure

- Turnkey Docker setup for the panel.
- Config item lookups fail loudly when an item is missing, instead of returning an empty string.
- `Config migrateFile` no longer reports `client.php` keys as deprecated.
- Code style enforced with Pint; CI runs on PHP 8.4 and 8.5.
