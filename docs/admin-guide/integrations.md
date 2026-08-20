---
sidebar_position: 9
---

# Integrations

The settings pages that connect the panel to something outside it. All of them store their credentials in the database `config` table, so they can be changed from the admin panel without a deploy.

## Payment gateways

`Settings` → `Payment gateways`. The **Gateway selection** tab picks which gateways are offered to users; each gateway then has its own tab for credentials. Several may be enabled at once, and the user chooses on the invoice page.

Gateway | Suits
---------|------
**Stripe** | Cards, worldwide
**PayPal** | PayPal balance and cards
**Alipay Face to Face** | Alipay, direct merchant account
**EPay** | Aggregators speaking the EPay protocol — Alipay, WeChat Pay, QQ Wallet, USDT

### Webhooks

Stripe and PayPal both confirm payment by calling back to the panel, and both need to be told where. **Set the webhook** on their tab registers the panel's callback URL with the gateway using the credentials you just saved, so you do not have to copy URLs into their dashboards by hand.

Callbacks land on `/payment/notify/{type}`, which is deliberately outside the authenticated route groups — the gateway is not signed in. Authenticity comes from the signature or endpoint secret instead, which is why `Endpoint Secret` (Stripe) and the client secret (PayPal) matter as much as the API key.

Callbacks are idempotent. A gateway that retries, or fires the same event twice, pays the invoice once; a genuine second payment for an already-settled invoice is refunded to the account's balance rather than kept. Every callback is recorded in `Admin` → `Logs` → `Payment gateway` with its transaction ID.

Once a payment is confirmed the order activates immediately rather than waiting for the next Cron tick — the user gets what they paid for while they are still looking at the page.

### Amount limits and fees

Stripe and PayPal each take a **Minimum** and **Maximum payment amount**, shown to the user before they choose, so they are not bounced by the gateway after committing.

Both, plus EPay, can pass their costs on:

Setting | Effect
--------|-------
Customer pays a fixed fee / Fixed fee amount | Adds a flat amount to the charge
Customer pays the processing fee / Processing fee percentage | Adds a percentage

Left off, the site absorbs the fee. The defaults in the fields (2.9% for Stripe, 4.4% for PayPal, 7% for EPay) are starting points, not quotes — use your own contracted rate.

## Email

`Settings` → `Email`. Pick a provider on the **Provider** tab, fill in its own tab, then use **Send a test email** to confirm before relying on it.

Provider | Notes
---------|-------
**SMTP** | Anything with a mailbox. Host, port, credentials, TLS
**Mailgun**, **Sendgrid**, **Mailchimp**, **Resend**, **Postal** | API-based senders
**AWS SES** | Access key, secret, region
**AlibabaCloud DM** | Access key, secret, endpoint, account name
**OCI Email Delivery** | Oracle Cloud. Needs the tenancy, user and compartment OCIDs, the API key fingerprint and its private key, plus the HTTPS sending endpoint from the console
**None** | No mail is sent at all

With the driver set to **None**, anything that depends on email quietly stops working: verification, password reset, announcement mailings, the daily traffic report. Registration with **Email verification** on becomes impossible to complete. Set a provider before turning verification on.

### Sending limits

Setting | Default | Protects against
--------|---------|------------------
Email verification link lifetime (seconds) | 3600 | A link that stays valid forever
Password reset link lifetime (seconds) | 3600 | Same
Messages one IP may request per hour | 3 | One host hammering the send endpoint
Messages one address may request per hour | 3 | Using the site to mail-bomb a third party

Both limits matter: without the address limit, an attacker with a botnet can still bury someone's inbox.

## CAPTCHA

`Settings` → `CAPTCHA`. Choose a provider, fill in its tab, then turn it on per form.

Form | Setting
------|---------
Registration | CAPTCHA on registration
Sign-in | CAPTCHA on sign-in
Password reset | CAPTCHA on password reset
Check-in | CAPTCHA on check-in

Provider | Credentials
---------|-------------
**Turnstile** | Cloudflare. Site Key, Secret
**hCaptcha** | Site Key, Secret
**reCAPTCHA Enterprise** | Google Cloud. Key, Project ID, API Key
**Geetest** | ID, Key
**Alibaba Cloud Captcha 2.0** | Scene ID, Instance Prefix, Region, Access Key ID and Secret
**Tencent Cloud Captcha** | CaptchaAppId, App Secret Key, plus a Cloud API Secret ID and Key

Turnstile is the least intrusive default. The Chinese providers are worth the extra fields when your users are inside mainland China, where the Google- and Cloudflare-hosted widgets are unreliable; Alibaba Cloud Captcha additionally asks which region its instance lives in, mainland or Singapore.

Registration and check-in are the two that actually need protecting — one creates accounts, the other hands out traffic. Turning CAPTCHA on for sign-in mostly annoys legitimate users, since [rate limiting](../systems/authentication.md#rate-limiting) already covers credential stuffing.

## IM

`Settings` → `IM` covers three bots and the notifications they carry. See [Notifications](../systems/notifications.md#im-bots) for what the bots do once linked.

### Telegram

Field | Notes
-------|-------
Bot Token | From BotFather
Bot account username | Used to build the link users click to bind their account
Group ID | The group notifications go to
Webhook Token | A secret the panel checks on incoming updates. **Reset the webhook token** rolls it

**Set the webhook** registers the panel's callback URL with Telegram. Do this after saving the token, and again after rolling the webhook token.

Group behaviour:

Setting | Effect
--------|-------
Only linked accounts may join the group | Non-members are removed
Remove the member when they unlink | Keeps the group and the user list in step
The bot does not answer commands in groups | Keeps a busy group readable; the bot still answers in private
Let the bot join groups outside the allow list / Group IDs the bot may join | Stops anyone adding your bot to their own group
Send a welcome message | Greets a new member, mentioning their level if they pay
Any message triggers /help | Only useful in a dedicated support group

### Discord

Field | Notes
-------|-------
App ID, App Public Key, Bot Token | From the Discord developer portal
Client ID, Client Secret | Needed for account linking via OAuth
Guild ID, Channel ID | Where channel notifications go

**Initialise the bot** registers the slash commands with Discord. Run it after saving, and again whenever the command set changes with a panel upgrade.

### Slack

App Token, Client ID and Secret, Team ID and Channel ID. Same shape: OAuth for linking, a channel for notifications.

### Notifications

The **Notifications** tab decides which site events reach the group or channel:

Event | Default
-------|---------
Node added | On
Node updated / deleted | Off
Node became blocked / stopped being blocked | Off
Node went offline / came online | Off
Daily job | On
System diary | Off
Announcement created | On
Announcement updated | Off

Node offline and online notifications are batched: ten nodes dropping at once produce one message listing all ten.

**Send a test message** on each bot's tab confirms delivery before you rely on it.

## LLM

`Settings` → `LLM` configures the model that drafts ticket replies and writes documentation. Pick a backend on the **Backend** tab and fill in its own tab.

Backend | Credentials
---------|-------------
**OpenAI** | API Key, Base URL, Model ID
**OpenAI compatible** | Anything speaking the OpenAI API — DeepSeek, xAI, Groq, OpenRouter, Alibaba Cloud Model Studio, a Hugging Face inference endpoint, or a local Ollama
**Anthropic** | API Key, Model ID
**Google AI** | API Key, Model ID
**Vertex AI** | A service account key file path (tokens renew automatically), or a hand-entered access token valid for one hour, or the ambient application default credentials
**AWS Bedrock** | Access key, secret, region, Model ID. Cross-region inference needs the inference profile ID with its region prefix
**Cloudflare Workers AI** | Account ID, API Token, Model ID

Shared settings:

Setting | Notes
--------|-------
System prompt | The assistant's standing instructions. The shipped one tells it to look things up rather than guess, and to ignore instructions embedded in ticket text. Blank sends only the reply-language instruction
Reply language | *Follow the user* answers in the language the question was asked in. A specific language pins every answer. Unset lets each backend decide, which is inconsistent across a multilingual user base
Maximum tokens | 8192. A reasoning model spends this budget on its thinking too, so do not set it low
Reply display name | The name on LLM-written ticket replies, `AI Assistant` by default

All backends support function calling, which is what lets the assistant look up an account, an order or a product before answering. See [Tickets](tickets.md#llm-assisted-replies) for what it can reach.

## Object storage

`Settings` → `Object storage` decides where client downloads are served from.

Backend | Credentials
---------|-------------
**None (serve locally)** | Files are served from `public/clients/` by the panel itself
**Cloudflare R2** | Account ID, Bucket, Access Key ID and Secret
**Alibaba Cloud OSS** | Region, Endpoint, Bucket, Access Key ID and Secret
**Tencent Cloud COS** | Region, Bucket, SecretId, SecretKey, optional custom domain
**S3 compatible** | Endpoint, Region, Bucket, Access Key ID and Secret — MinIO, Backblaze B2, Wasabi and the like

With a backend configured, a download link is a presigned URL valid for **Presigned URL lifetime** minutes (10 by default). The bucket itself stays private; the panel mints a short-lived URL per click.

Serving locally is fine for a small site. Client binaries are large and every download competes with the panel for bandwidth, which is the reason to move them off the web server as the site grows. See [Client downloads](../systems/client-downloads.md) for how the binaries get into the bucket in the first place.
