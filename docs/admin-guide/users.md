---
sidebar_position: 2
---

# Managing Users

`Admin` → `Users` lists every account on the site. The list is searched and sorted server-side, so a search matches every row in the table, not just the page in front of you.

## Adding an account by hand

**Add a user** needs an email address; everything else is optional.

Field | Left blank
-------|------------
Sign-in email | Required, and must not already exist
Sign-in password | One is generated at random and shown to you once, in the success message
Account balance | `-1` applies the site default; any other number is taken literally
Referred by | No referrer. Give a user ID here to attribute the account to an inviter

The new account takes the same defaults a self-registration would (`Admin` → `Settings` → `Registration`), so an account you create by hand and one someone signs up for start out identical.

## Editing an account

The edit page is grouped by what the field controls.

### Identity and access

Field | Notes
-------|-------
**Email** | Changing it invalidates every signed-in session on that account, because a session is bound to the credentials it was issued against — see [Sessions](../systems/authentication.md)
**Account password** | Fill this in *only* to reset it. Left blank, the existing password is untouched. Setting one also invalidates the account's sessions
**Display name** | The username the user picked
**Administrator** | Grants the whole of `/admin`
**Two-factor authentication** | Read-write: switching it off is how you rescue a user who lost their authenticator
**Email verified** | Mark an address verified without sending a mail
**Display language** | Overrides what the user chose. Affects the panel, their emails and their bot replies

### Service entitlement

Field | Notes
-------|-------
**Account level** | The user's level. A node is visible to an account whose level is at or above the node's own level
**Level expires at** | When the level drops back to 0. This is what a TABP or time package extends
**Traffic limit** | Total traffic the account may use this period
**Node group** | Restricts the account to nodes in the same group. `0` means no group restriction
**Concurrent IP limit** | How many addresses may be online at once. `0` is unlimited
**Speed limit (Mbps)** | Per-account cap, `0` for none. The effective limit is the lower of the account's and the node's
**Account balance** | Site currency the user can spend on invoices
**Free traffic granted on reset / Traffic reset day** | Per-account override of the free-user monthly traffic reset

Changing **Traffic limit** by hand is recorded in the traffic history the user can see (`Admin` → `Logs` → `Traffic`), with the administrator as the source. Every allocation is logged this way — check-in rewards, order activations, resets and manual edits alike — so a user asking "where did my traffic go" can be answered from the record.

### Moderation

Field | What it does
-------|--------------
**Ban the account** | The user can still sign in but is sent to a page explaining the ban; nodes stop accepting them
**Reason for the manual ban** | Shown to the user on that page. Write something they can act on
**Shadow banned** | The account keeps connecting normally and is told nothing, but every action with a cost attached is refused: buying, paying an invoice, redeeming a gift card, checking in for the daily traffic reward, changing the email address or username, and opening or replying to a ticket. It also stops earning its inviter a rebate, and stops being accepted as a referrer. Use it for an account you suspect of fraud but do not want to alert
**Account note** | Administrator-only. Never shown to the user

## Deleting an account

Deleting removes the account and its data. Users can also delete their own account when **Let users delete their own account** is on under `Admin` → `Settings` → `User accounts`; they must confirm with their sign-in password.

## Idle accounts

An account counts as idle when it has gone past all three windows configured under `Admin` → `Settings` → `Scheduled tasks` → `Idle accounts`: days without a check-in, without a sign-in, and without using the service. The daily job flags them when **Detect idle accounts** is on, and the **Idle** column on the user list shows the result.

Turning on **Drop the subscription link and invite code of idle accounts** additionally clears those two values for flagged accounts on each daily run, which frees the tokens and stops a long-abandoned link from being fetched forever.

## Resetting a user's credentials

There are three separate secrets on an account, and they solve different problems:

Secret | Reset from | Effect
--------|-----------|--------
Sign-in password | The user's `Settings`, the password-reset email, or the admin edit page | Signs out every session
Connection password / UUID | The user's `Settings`, or `Tool resetPasswd` | Existing node configurations stop working; the subscription must be fetched again
Subscription token | The user's `Settings`, or `Tool clearSubToken` | The old subscription URL stops returning anything; configurations already downloaded keep working

When **Notify the user when their credentials are reset** is on (`Settings` → `Other settings`), the user is told which one changed and what they need to do about it.

Site-wide equivalents exist on the CLI for an incident — see the [CLI reference](../maintenance/cli.md).
