---
sidebar_position: 3
---

# Your Account

Everything you can change lives at **Account** → **Settings**, grouped into four tabs.

## Three passwords, not one

This trips people up, so it is worth being precise. Your account has three separate secrets and they do different jobs.

Secret | What it is for | Where it lives
--------|----------------|----------------
**Sign-in password** | Signing in to this website | Settings → Sign-in
**Connection password / UUID** | Authenticating to the proxy nodes | Settings → Usage
**Subscription URL** | Fetching your node list | Settings → Usage

Changing your sign-in password does not change how your client connects — except that most sites also reset the subscription URL when you do, so you will need to fetch the new one.

## Profile

**Account email.** Shown with whether it is verified. Some sites do not allow changing it; the field says so when that is the case. If it is unverified, this is where you re-send the verification message.

**Username.** Your display name.

**Linking an IM account.** Link Telegram, Discord or Slack and you can get notifications there instead of by email, and use the bot to check your account without opening the site. **Preferred contact method** decides which channel the site uses; with nothing linked, it emails you regardless.

## Sign-in

**Change sign-in password.** Needs your current one. Every session on the account is signed out afterwards, including on your other devices — that is deliberate, since the usual reason to change a password is that something is wrong.

**Multi-factor authentication.** Scan the QR code with any TOTP app, then use **Test** to confirm the code matches before turning it on. With it enabled, signing in asks for the six-digit code as well as the password.

:::caution
Save the secret somewhere safe, or keep the app's own backup working. If you lose your authenticator, only the site operator can turn two-factor off for you.
:::

## Usage

**Reset the subscription URL.** The old URL stops returning anything. Configurations your client already downloaded keep working — this stops new fetches, it does not disconnect you. Use it when you have shared the link with someone by mistake.

**Reset the connection password.** This changes the connection password *and* the UUID, which does disconnect you. Existing node configurations stop authenticating, so you must fetch the subscription again afterwards. Use it when you think your credentials, rather than just your link, have leaked.

Resetting both, in that order, is the full "make everything I handed out useless" action.

**Daily traffic report.** Choose whether the site sends you a daily summary, and whether it arrives by email or through your linked IM account.

## Other

**Theme** and **Theme mode.** Theme mode has three settings: Light, Dark, and Auto, which follows your operating system.

**Language.** Applies to the panel, the emails the site sends you and the messages its bots send you — not just the web pages.

**Delete account data.** Only present if the operator allows self-service deletion. It asks for your sign-in password and cannot be undone.

## Account overview

**Account** → **Overview** is the record rather than the settings:

- your last ten sign-ins, with the address and its approximate location;
- your last ten subscription fetches, with which client made them;
- the addresses currently online on your account.

Locations are estimated from a GeoIP database and are often off by a city or more — do not treat one as proof of anything. What is worth looking at is the *pattern*: a sign-in from a country you have never been to, or more addresses online than you own devices.

If the site notifies you of sign-ins or subscription fetches from new addresses, those notifications draw on the same data.
