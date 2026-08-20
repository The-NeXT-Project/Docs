---
sidebar_position: 1
---

# Getting Started

This section is written for the people who use the service rather than the people who run it. Site operators are welcome to copy any of it into their own `Documentation` section and adapt the details — every site turns different features on.

## Signing up

Registration is at `/auth/register`. Depending on how the site is configured you may need an invite link from an existing user, and you may be asked to solve a CAPTCHA.

If the site requires **email verification**, you get a message with a link. Until you click it you may not be able to buy anything or check in — that is the site protecting itself against throwaway accounts, not a fault.

Forgotten passwords are reset from `/password/reset`. The link that arrives is short-lived, typically an hour.

## The dashboard

`/user` is home. It answers the three questions you actually have:

**How much traffic is left.** A bar splits your allowance into used before today, used today, and remaining. When you drop below the site's warning threshold a banner appears with a link to buy more.

**When does my account expire.** Under the traffic bar, if you have a paid level: your level, the days left, and the date.

**How do I connect.** The subscription card, which is the whole of the next page.

If the site records hourly usage you also get a chart of the last day, which is the quickest way to spot something running in the background that you did not intend.

Announcements from the operator sit at the bottom, pinned ones first.

## Daily check-in

If the site has check-in enabled, a card offers a traffic reward once a day. The amount is drawn at random between a minimum and a maximum the operator sets. Some sites want your email verified first, and some put a CAPTCHA on it.

Missing a day forfeits it; there is no accumulation.

## Getting help

Section | For
---------|-----
**Announcements** | What the operator is telling everyone — outages, new nodes, price changes
**Documentation** | The operator's own guides. Some sites show these to paying users only
**Tickets** | A private conversation with the operator. See [Support](support.md)

## Where everything is

Menu | Contains
------|----------
**Home** | Dashboard, and the check-in card
**Account** → Overview | Sign-in history, subscription fetches, currently online IPs
**Account** → Settings | Everything you can change. See [Your account](account.md)
**Account** → Invite and earn | Your invite link and what it has earned. See [Check-in and invites](rewards.md)
**Usage** → Nodes | The servers your account can use
**Usage** → Traffic rate | The hourly rate curve of any node that charges dynamically
**Support** | Announcements, Documentation, Tickets, Audit
**Billing** | Orders, Invoices, Balance history, Traffic history
**Shop** | Products

## Switching language

The language switcher is in the top right, next to your avatar. Guests get one at the bottom of the sign-in and registration pages.

Switching reloads the page you are on, so you keep your place. Choosing a language while signed in also saves it to your account, so it follows you to another device — and applies to the emails and bot messages the site sends you, not just the web pages.
