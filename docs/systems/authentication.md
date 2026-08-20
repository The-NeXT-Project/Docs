---
sidebar_position: 3
---

# Authentication and Sessions

## Sessions

A signed-in session is a JSON Web Token in a cookie. There is no server-side session table and no PHP session file; the token carries everything needed to identify the user, and the panel verifies it on each request.

### The cookie

```
__Host-np_token
```

The `__Host-` prefix is not decoration. A browser refuses to store a cookie with that prefix unless it is `Secure`, has `Path=/`, and has **no** `Domain` attribute — which makes it host-only. The consequence that matters: a sibling subdomain cannot plant a session cookie on the panel. Without the prefix, anything that can write cookies for `example.com` can write one for `panel.example.com`, which is a session-fixation route.

The cookie is also `HttpOnly` and `SameSite=Lax`.

### What is in the token

Standard claims — issuer, audience, subject, JWT ID, issued-at, not-before, expiry — plus three of the panel's own:

Claim | Contents
-------|----------
`sv` | An HMAC over the account's password hash and email address
`iph` | A keyed hash of the client IP at sign-in
`dvh` | A keyed hash of the user agent at sign-in

The IP and user agent are hashed rather than stored, so a token that leaks does not disclose where or with what its owner signed in.

The `sv` claim is what makes credential changes effective. Because it is derived from the password hash and email, changing either makes every outstanding token fail validation at once — no denylist to populate, no session table to sweep. This is why changing a user's email address from the admin panel signs them out.

### Key derivation

Both keys come from `$_ENV['key']` via HKDF, with distinct context strings for signing and for MACs, so the two are cryptographically separate despite sharing a source.

:::caution
Changing `$_ENV['key']` invalidates every session on the site immediately. That is the intended way to force a global sign-out, and the reason the key must be a long random string rather than something guessable.
:::

### Binding to IP and device

Two `config.php` switches tighten a session to where it was created:

```php
$_ENV['enable_login_bind_ip'] = true;
$_ENV['enable_login_bind_device'] = true;
```

With IP binding on, a token stops working from a different address. There is one exception: a request relayed by a known node is accepted, because the source address legitimately changes when a user browses the panel through the service they are paying for.

Device binding compares the user agent. It costs users a sign-in whenever their browser updates its version string, so it is a real trade-off rather than free security.

### Signing out

Signing out clears the cookie and writes the token's ID into a Redis denylist for exactly as long as the token had left to live. Two details are deliberate: the token is verified *before* being denylisted, so nobody can plant arbitrary keys in Redis by posting garbage at the logout route; and the entry expires with the token, so the denylist cannot grow without bound.

An expired or forged token needs no denylisting — it can never authenticate in the first place.

### The upgrade from the old scheme

Earlier versions stored a bundle of cookies carrying the user's ID, email and a key, scoped to an explicit domain. Signing in now clears those first — a host-only `setcookie()` cannot delete a domain-scoped cookie, so it is done explicitly with the domain attached — and issues a token instead. Users are not signed out by the upgrade; they simply get a token the next time they sign in.

## Two-factor authentication

Standard TOTP, compatible with any authenticator app. The user scans a QR code containing an `otpauth://` URL, confirms with a test code before it is armed, and is then asked for the code at each sign-in.

The secret is generated when the account is created, whether or not two-factor is ever turned on, so enabling it is a single step. An administrator can turn it off from the user edit page — the only recovery path when someone loses their authenticator.

## CAPTCHA

Six providers, one interface: Turnstile, hCaptcha, reCAPTCHA Enterprise, Geetest, Alibaba Cloud Captcha 2.0 and Tencent Cloud Captcha. The provider is chosen once and applies to every form.

Each is enabled per form — registration, sign-in, password reset, check-in — because the forms have different risk profiles. Registration and check-in create accounts and hand out traffic; sign-in is already covered by rate limiting.

The panel does two things per provider: hand the front end whatever the widget needs to render (site key, scene ID, region, language), and verify the token the widget produced against the provider's API on submission. A verification that fails to reach the provider fails closed.

Widget language follows the panel's current locale where the provider supports it, so a user reading the site in Japanese does not get a Chinese challenge.

## Rate limiting

Redis counters, configured entirely in `config.php`:

```php
$_ENV['enable_rate_limit'] = true;
$_ENV['rate_limit_site_id'] = 0;        // Distinguishes sites sharing one Redis
$_ENV['rate_limit_auth_ip'] = 60;       // Auth requests per IP per 10 minutes
$_ENV['rate_limit_password_ip'] = 60;   // Password requests per IP per 10 minutes
$_ENV['rate_limit_sub_ip'] = 10;        // Subscription fetches per IP per minute
$_ENV['rate_limit_sub'] = 10;           // Subscription fetches per user per minute
$_ENV['rate_limit_webapi_ip'] = 120;    // Legacy WebAPI per IP per minute
$_ENV['rate_limit_webapi'] = 1200;      // Legacy WebAPI, site-wide, per minute
$_ENV['rate_limit_server_api_ip'] = 60; // Server API per IP per minute
$_ENV['rate_limit_server_api'] = 60;    // Server API per node per minute
```

Most limits come in pairs, per-IP and per-subject, and both must pass. The pairing is the point: a per-IP limit alone is defeated by a botnet, and a per-user limit alone lets one host attack many accounts.

Subscription fetches are limited per user as well as per IP because a leaked subscription URL being polled by a hundred clients is a real load pattern, and it is not the IP that identifies it.

The Server API answers a rate-limited request with `429` and a `Retry-After` header, so a well-behaved backend backs off rather than retrying immediately.

`rate_limit_site_id` namespaces the counters. Several panels sharing one Redis instance need distinct values or they will consume each other's budgets.

## Linking IM accounts

Telegram, Discord and Slack accounts are linked through OAuth, initiated from the user's settings page. The state parameter is generated per attempt and held in Redis for five minutes, which is what stops a linking flow being replayed or a victim being tricked into linking an attacker's account.

Linked IDs are stored and compared as opaque strings. Discord and Slack IDs exceed what an integer can safely hold, and treating them as numbers loses precision on the largest ones.

## Passwords

Hashed with bcrypt by default; `argon2i` and `argon2id` are available via `$_ENV['pwdMethod']`. The `salt` setting is ignored by all three — each algorithm generates and stores its own salt, which is what you want.

Password reset is a token mailed to the account's address, valid for `email_password_reset_ttl` seconds (an hour by default) and usable once. Both the sending IP and the target address are rate limited, so the reset endpoint cannot be used to bury someone's inbox.
