---
sidebar_position: 6
---

# Notifications

One subsystem covers everything the site sends out: email, IM messages, and the announcements and reports that go to many people at once.

## The message queue

Sending mail is slow and sending ten thousand of them inside a web request is not an option. Anything addressed to more than one person — an announcement mailing, a finance report, a batch of traffic warnings — is written into the `message_queue` table and drained by Cron.

Email and IM share the queue. A queued row records the destination, which channel it is for, the template and its parameters, and the recipient's locale.

### Locale at enqueue time

The `locale` column is the important one. Cron sends the message later, in a process with no request context and no signed-in user, so "what language does this person read" cannot be worked out at send time. It is recorded when the message is queued and used when it is rendered.

This is what makes a single announcement arrive in four languages, each recipient getting their own.

### Draining

Each Cron run works the queue until it is empty or five minutes have passed, whichever comes first — the next run is due at that point, and overrunning would stack Cron processes on top of each other.

Rows are claimed one at a time with `FOR UPDATE SKIP LOCKED` and deleted inside the same transaction that sends them. Two consequences:

- Two Cron processes racing cannot send the same message twice; the second skips the locked row.
- A message that fails to send is *not* retried. It has already left the queue, and the failure is logged. Retrying blindly is worse: a permanently bad address would be attempted forever, and a message that actually went out before the error would be duplicated.

If mail is not arriving, look in the system log rather than at the queue — a drained queue with failures logged looks identical to a queue that worked.

## Instant notifications

Some notifications should not wait for the next Cron tick. A ticket reply is the clear case: the user is waiting, and the delay is the whole experience.

Those are sent inside the request that caused them. The cost is that the send time is charged to that request, so it is used only for single-recipient notifications. Anything addressed to a group still goes through the queue.

## Which channel a user gets

A user links a Telegram, Discord or Slack account and picks a **preferred contact method**. With nothing linked, or with email preferred, the site emails their account address.

Three kinds of message do not follow that preference:

Message | Goes where | Why
---------|-----------|-----
Password reset | Email | The recipient may not be signed in, and may have lost access to their account
Email verification | Email | It is verifying that address
Group and channel notices | The configured group | No single recipient

## Credential reset notices

Changing any of the three account secrets — sign-in password, subscription link, connection password and UUID — notifies the account owner, naming which one changed and when. Controlled by **Notify the user when their credentials are reset**, on by default.

The reasoning is worth stating: if the user did it, the message is noise they will ignore. If they did not, it is the first sign that someone else is inside the account. That asymmetry is why it defaults to on.

## Email drivers

Ten drivers behind one interface, chosen under `Admin` → `Settings` → `Email`:

SMTP, Mailgun, Sendgrid, Mailchimp, Resend, Postal, AWS SES, AlibabaCloud DM, OCI Email Delivery, and `None`.

With `None` selected the mailer accepts messages and discards them. Verification, password reset, announcement mailings and the daily traffic report all stop working — silently, from the user's point of view. Set a provider before turning email verification on.

**Send a test email** on the settings page is the fastest confirmation that credentials and sender identity are right.

### Templates

Mail templates live under `template/email/<theme>/` and are styled to match the panel's web theme, so a message looks like it came from the site the user signed up to. Every message is rendered in the recipient's locale, using the same translation catalogues the web pages use.

### Sending limits

`email_request_ip_limit` and `email_request_address_limit` (three per hour each, by default) cap how often verification and reset messages may be requested. Both matter: an attacker with many addresses defeats the per-IP limit, and one host attacking many accounts defeats the per-address limit.

## IM bots

Three platforms, one interface: Telegram, Discord and Slack.

### What a bot does for a user

Once an account is linked, the bot is a small client for the panel:

Command | Does
---------|------
`/checkin` | The daily check-in, without opening the site
`/menu` | The user centre — account state, sign-in history, online IPs, rebate history, subscription history
`/ping` | Reports the account, group or channel ID. Useful when configuring the bot
`/unbind` | Unlinks the account
`/help` | Lists the commands

The menu also offers resetting the subscription link and the connection password, which is exactly the thing a user needs when they are away from a browser and their link has leaked.

Replies are in the user's own language, resolved from the linked account.

### Group and channel notices

Site events can be pushed to a group or channel: nodes added, updated or deleted, nodes going offline or coming back, nodes becoming blocked or recovering, the daily job completing, the system diary, and announcements. Each is a separate switch under `Settings` → `IM settings` → `Notifications`.

These have no single recipient, so they render in the site's default language rather than anyone's preference.

Node offline and online notices are batched. A rack of ten nodes dropping produces one message listing all ten — the alternative was ten notifications in the same second, which reads as a bug and hides the shape of the outage.

### Group management

Telegram groups can be tied to the panel: only linked accounts may join, members are removed when they unlink, and the bot can be kept quiet so a busy group stays readable while the bot still answers in private. An allow-list of group IDs stops anyone adding your bot to a group of their own.

### Setting up

Each platform needs one registration step after the credentials are saved — **Set the webhook** for Telegram, **Initialise the bot** for Discord (which registers its slash commands). Re-run the Discord one after an upgrade that changes the command set, or the new commands will not appear.

**Send a test message** confirms delivery before you rely on any of it.
