---
sidebar_position: 4
---

# The Shop Pipeline

Every purchase, redemption and admin grant follows the same path. That uniformity is the design: a gift card redemption leaves an order and an invoice behind exactly as a card payment does, so the billing history is complete and there is one activation code path to reason about.

```
Product  ──►  Order  ──►  Invoice  ──►  Payment  ──►  Activation  ──►  Expiry
```

What each product type *grants* is covered in [Shop](../configuration/shop.md). This page is about the machinery around it.

## Order states

State | Reached when | Leaves for
-------|--------------|------------
`pending_payment` | The order is created | `pending_activation` on payment, `cancelled` on timeout
`pending_activation` | Its invoice is settled | `activated` when its turn comes
`activated` | It is live on the account | `expired` when it runs out, `superseded` on upgrade
`expired` | Its time or traffic ran out | terminal
`superseded` | An upgrade closed it out early | terminal
`cancelled` | Abandoned, or cancelled by an admin | terminal

`superseded` exists as a separate state rather than reusing `expired` so that genuine expiries stay countable. A dashboard that counts expired orders should not be inflated by every upgrade.

## Invoice states

State | Meaning
-------|--------
`unpaid` | Nothing received
`partially_paid` | Balance applied, gateway payment outstanding
`paid_gateway` | Settled through a gateway
`paid_balance` | Settled from account balance
`paid_admin` | Marked paid by an administrator
`refunded_balance` | Refunded to the account's balance
`cancelled` | Cancelled with its order

The three `paid_*` states are distinguished because the question "how much revenue did we take" has a different answer from "how many invoices were settled" — balance payments were already counted when the balance was topped up.

## Payment

### Gateway callbacks

A gateway confirms payment by calling `/payment/notify/{type}`, which sits outside every authenticated route group. The gateway is not signed in; authenticity comes from its signature or endpoint secret.

Callbacks are idempotent. Gateways retry, and some deliver the same event more than once. The panel settles the invoice on the first callback that matches; a later duplicate finds it already paid and does nothing. A genuine *second payment* for an invoice already settled is refunded to the account's balance rather than quietly kept.

The transaction ID and the gateway that actually paid are both recorded on the invoice, and every callback lands in `Admin` → `Logs` → `Payment gateway`. When a user insists they paid, that log settles it.

### Activation happens at payment

Once a callback confirms payment, the order is activated in the same request rather than waiting for Cron. A user who has just paid sees what they bought while they are still on the page.

Cron remains the backstop. It picks up anything the callback could not activate — an order queued behind a package that has not expired yet, or one whose activation raced with something else.

### The claim

A gateway callback and a Cron tick can reach the same order simultaneously. Before activating, the order is claimed atomically: exactly one of them wins and proceeds; the loser observes that the order is already claimed and moves on. Without it, a package could be granted twice.

Retiring an old order and claiming its replacement happen in one transaction. Otherwise an admin cancelling the new order in the gap would leave the user with the old package already voided and the new one never activated.

## Activation and queueing

Order activation runs on every Cron tick, once per product type.

Type | Queue behaviour
------|-----------------
**TABP** | One active per user. The rest queue, at most one activated per user per Cron cycle
**Traffic package** | Activates immediately, stacking onto the current allowance
**Time package** | Activates immediately for a free user, or a paying user already on that level. Otherwise queues until the current level expires
**Balance top-up** | Activates immediately; several may be processed at once

The TABP queue is worked oldest-first, but expiry is checked *before* activation on each pass, so a package that just ran out is retired and its successor activated in the same cycle rather than the next.

One subtlety worth knowing for support: an upgrade order can sit behind an ordinary queued order that will never activate while the current package runs. The queue therefore tries every waiting order rather than only the first, or the upgrade would never get its turn.

## Cancellation and cleanup

Job | Default | Effect
-----|---------|-------
Cancel unpaid orders | On, after 6 hours | Cancels the order and its invoice. Skips orders whose invoice is partially paid
Cancel partially paid orders | Off, after 48 hours | Separate switch, because real money is involved. Refunds what was collected to the balance. Timed from the partial payment, not from the order — the user is waiting on money that already left their account
Clean up cancelled orders | Off, after 720 hours | Deletes cancelled orders and their invoices outright

An administrator cancelling an order refunds whatever its invoice collected to the account's balance as part of the cancellation. A partially paid order cancels the same way as a fully paid one. An order that has reached `activated`, `expired`, `superseded` or `cancelled` cannot be cancelled — it has already been delivered or is already closed.

### What "collected" means on a partially paid invoice

Paying an invoice from an insufficient balance deducts the paid part from the invoice's `price`, so `price` afterwards is the *outstanding* amount, not the original one. The invoice never records what it took. The collected amount is therefore derived as the order's price minus whatever is still outstanding.

The same derivation covers an invoice paid part from balance and then settled through a gateway: nothing is outstanding, so the whole order price was collected. Refunding the invoice's `price` there would have quietly dropped the part paid from balance.

### Refunds only ever go to balance

There is no gateway refund path, by design. Money returns to the account's balance whether it arrived from a balance payment, a gateway, or an administrator marking the invoice paid. A gateway refund would move money without a corresponding entry in the panel's ledger, and the balance history would stop reconciling.

## Purchase eligibility

Two different checks run, and which one refuses matters.

**The account check** (`ShopLimit::checkUserLimit`) runs before anything is created: shadow ban, email verification if required, the unpaid-order cap, the active-TABP cap, and the window before level expiry within which a TABP may be bought. Failing it creates nothing — and for a gift card, spends nothing.

**Activation** runs after the money is settled. A card or order that gets this far is committed; if the product cannot activate this instant it is left `pending_activation` for Cron. Nothing is lost, it just arrives later.

The distinction is the whole reason a gift card turned away for having a package still running is not consumed, while one that is accepted and queued is.

## Expiry

The daily job retires paid accounts whose level has run out, dropping them to the free tier and granting whatever **Traffic granted when the level expires** is set to. Free-user traffic resets run on the configured day of the month.

Traffic exhaustion is not expiry. An account that has used its allowance stops being served by nodes — unless `$_ENV['keep_connect']` is on, in which case it is throttled to 1 Mbps instead of cut off, which most users find less alarming than a total outage.
