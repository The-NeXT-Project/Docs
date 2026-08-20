---
sidebar_position: 2
---

# Getting Connected

A **subscription** is a URL that hands your client software the current list of servers, already configured. You paste it in once; the client refreshes it on its own afterwards, so when the operator adds or moves a node you get the change without doing anything.

The subscription card on your dashboard has two tabs.

## Client subscription

One link per protocol, for a client that speaks that protocol and nothing else.

Link | For
------|-----
**V2Ray** | Vmess clients
**Trojan** | Trojan clients
**AnyTLS** | AnyTLS clients

Each link carries only the nodes of that type. Which of these are offered depends on the site.

## Universal subscription

One link carrying every node your account can use, in a format a modern multi-protocol client understands.

Format | Client
--------|--------
**Clash** | Clash, Clash.Meta, ClashX.Meta, Clash Nyanpasu, Stash, Shadowrocket
**SingBox** | sing-box and its GUIs (SFA, SFI, SFM)
**V2Ray Json** | V2Ray core, V5 configuration
**Json** | Not a client format. A small JSON document describing your account — level, expiry, traffic used and remaining, and the URLs above

Use a universal link where you can. It is one link instead of three, and it keeps working when the operator adds a node of a protocol you were not using before.

## Importing it

The dashboard lists the clients the operator recommends for your platform. Each one gives you:

- **Import into &lt;client&gt;** — a one-tap deep link that hands the subscription straight to the app, if it is installed.
- **Download** — the installer, either from the site or from the app store.

If the deep link does nothing, the app is not installed or does not have the URL scheme registered. Copy the link with the copy button next to it and paste it into the app's own "add subscription" or "add profile" box instead.

### Refreshing

Clients refresh on their own schedule; the Clash subscription tells them to check every six hours. Every client also has a manual "update profile" action, which is what to use when the operator has just told you a node changed.

Your client can see your remaining traffic and expiry date, because the subscription response carries them in a header. Most clients show them next to the profile name.

## Connection details

Underneath the subscription links are the raw credentials — your connection password and UUID — for setting a client up by hand. You do not need them for normal use.

## Which nodes you get

**Usage** → **Nodes** lists the servers your account may use, with each one's traffic rate and current status. A node you cannot use because your level is too low is shown greyed out with an explanation and a link to the shop, rather than hidden — so you can see what you would be buying.

### Traffic rates

A node's **rate** is the multiplier applied to what you use there. At `1x`, a gigabyte costs a gigabyte. At `0.5x` it costs half; at `2x`, double. Free nodes are marked as such.

Some nodes charge **dynamically** — the rate follows the clock, cheapest overnight, most expensive at peak. **Usage** → **Traffic rate** draws the whole 24-hour curve for each of them. If your usage is something you can schedule, a large download at 4am can cost a fraction of the same download at 9pm.

## When something stops working

Symptom | Likely cause
---------|--------------
Nothing connects, panel says traffic remaining | Check your account has not expired — an expired level drops you to whatever the site gives free users
Nothing connects, panel says no traffic left | Buy a traffic pack, or wait for the reset if the site grants free traffic monthly
The subscription URL returns nothing | It was reset. Fetch the new one from your dashboard. Changing your sign-in password resets it on most sites
Subscription updates, but nodes fail | Your connection password or UUID was reset. Re-import the subscription
One node fails, others work | That node is down or blocked. The node list shows its status
Everything is slow | Check whether the node is heavily used, and whether your account or the node has a speed limit

If you are signed in from a new address and the site notifies you about it, that notification is a security feature, not an error — but if it was not you, change your sign-in password.
