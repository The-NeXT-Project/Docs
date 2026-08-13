# Localization

The panel ships in four languages, and everything a user sees — the panel itself, emails, and IM bot replies — is rendered in whichever one applies to them.

Locale | Language | `<html lang>`
--------|---------|-------------
`en_US` | English | `en-US`
`zh_CN` | 简体中文 | `zh-CN`
`zh_TW` | 繁體中文 | `zh-TW`
`ja_JP` | 日本語 | `ja-JP`

## Which language a visitor gets

The panel picks the first of these that gives an answer:

1. The signed-in user's **language** preference, set on their `Settings` page or by an admin on `Admin → Users → Edit`.
2. The `locale` cookie, written when anyone — guest or user — uses the language switcher.
3. The browser's `Accept-Language` header, if auto-detection is on.
4. The site default, `$_ENV['locale']` in `config/config.php`.

Guests get a language switcher at the bottom of the sign-in, registration and password pages; signed-in users get one in the top-right of the navbar next to their avatar. Switching reloads the page you are on — you keep your place instead of being sent back to the dashboard. Picking a language as a signed-in user also saves it to the account, so it follows them to another device.

```php
// config/config.php
$_ENV['locale'] = 'zh_TW';          // Default site language
$_ENV['locale_auto_detect'] = true; // Match the browser's Accept-Language when
                                    // the visitor has not chosen a language yet
```

Set `locale_auto_detect` to `false` if you want every visitor to land on the site default regardless of their browser, e.g. because your audience is entirely in one region and the browser language is a poor signal.

`Accept-Language` matching understands script and region subtags, so `zh-Hans`, `zh-SG` and `zh-CN` all resolve to Simplified Chinese, while `zh-Hant`, `zh-HK` and `zh-MO` resolve to Traditional Chinese. A header the panel cannot match at all falls through to the site default.

## Emails and bot messages

Emails are rendered in the recipient's own language, not the language of whoever triggered them. That includes queued mail: the recipient's locale is recorded when the message is queued, because Cron sends it later with no request context.

The same applies to IM bot replies — a user whose account is set to Japanese gets Japanese menus from the Telegram and Discord bots. Messages sent to a group or channel have no single recipient, so those use the site default.

Password reset and email verification go to an address that may not be signed in, so those use the language of the request that asked for them, which is the one the visitor is looking at.

## Editing or adding translations

Translations live in `locale/<locale>/<domain>.php`, one file per domain:

Domain | Covers
--------|---------
`common` | Buttons, statuses, shared table headers, dialogs, error pages, DataTables
`auth` | Sign in, registration, password reset, email verification
`user` | The user panel and the messages its pages return
`bot` | IM bot replies and site notifications
`email` | Email subjects, bodies and the shared template chrome

Each file returns a nestable array:

```php
// locale/en_US/user.php
return [
    'setting' => [
        'update_success' => 'Saved',
        'email_taken' => 'That email address is already in use',
    ],
];
```

Placeholders are written `%name%` and are filled in by the panel, so keep them intact and in a position that reads naturally in the target language:

```php
'node_added' => '%node_name% has been added',
```

`en_US` is the reference: every key in it must exist in the other three. After editing, check the catalogues before deploying:

```bash
php next-cli I18n list   # Per-locale coverage
php next-cli I18n check  # Missing keys, extra keys, empty values, broken placeholders
php next-cli I18n scan   # Keys the code asks for but no catalogue defines
```

`check` and `scan` exit non-zero when they find a problem, so they drop straight into a deployment script.

:::note
Translations are read from disk on each request and are not cached separately, so an edit takes effect immediately — no cache to clear.
:::

:::caution
The admin panel is not translated yet and renders in Chinese regardless of the selected language. Everything a regular user can reach is translated.
:::
