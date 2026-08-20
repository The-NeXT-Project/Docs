---
sidebar_position: 4
---

# Shop, Orders and Billing

This page is the operator's view: how to put something on sale and what to do when a purchase goes sideways. For what each product type *means* — how a TABP differs from a time package, how an upgrade is priced, what a gift card hands out — see [Shop](../configuration/shop.md).

## Products

`Admin` → `Products` lists everything the shop can sell, on sale or not.

### Creating one

Field | Notes
-------|-------
**Name** | What the user sees on the product page
**Type** | Traffic and time package (TABP), Traffic package, or Time package
**Price** | In site currency
**Status** | *On sale* or *Delisted*. Delisting hides it from the shop; orders already placed are unaffected
**Stock** | Units left. A negative number means unlimited. Each sale decrements it

What the product grants:

Field | Applies to
-------|-----------
**Traffic (GB)** | TABP, Traffic package
**Duration (days)** | TABP
**Level** and **Level duration (days)** | TABP, Time package
**Node group** | TABP, Time package
**Speed limit (Mbps)** | TABP, Time package
**Concurrent IP limit** | TABP, Time package

Purchase limits, all optional:

Field | Effect
-------|-------
**Level required to buy** | Hides the product from accounts below that level
**Node group required to buy** | Hides it from accounts outside that group
**New users only** | Restricts it to accounts that have never bought anything

**Duplicate** copies a product wholesale — the quick way to build a family of packages that differ only in size.

:::note
Editing or delisting a product does not change what an already issued gift card hands out. The card carries a copy of the grant, taken when it was minted.
:::

### Site-wide purchase rules

`Admin` → `Settings` → `Shop` holds the rules that apply to every product:

Setting | Default | Effect
--------|---------|-------
Require email verification to purchase | Off | An unverified account cannot buy
Maximum unpaid orders per user | 0 (no limit) | Stops a user piling up orders they never pay
Maximum active TABP orders per user | 2 | In practice only one TABP is ever active, so this rarely binds
Days before level expiry when a TABP may be bought | 7 | A user whose level runs out further away than this is told to come back closer to expiry
Enable TABP upgrades | On | Offers the upgrade path instead of queueing a second package
Maximum upgrade credit as a percentage of the replaced order | 100 | Trims the credit an upgrade is worth

## Orders and invoices

Every purchase produces an **order** (what was bought) and an **invoice** (what is owed). Redemptions and admin grants go through the same pair, so the history is complete.

### Order states

State | Meaning
-------|--------
`pending_payment` | Waiting on the invoice
`pending_activation` | Paid, waiting for its turn — the queue is worked by Cron
`activated` | Live on the account
`expired` | Ran its course
`superseded` | Closed out early by an upgrade. Deliberately distinct from `expired`, so genuine expiries stay countable
`cancelled` | Abandoned or cancelled

### Invoice states

State | Meaning
-------|--------
`unpaid` | Nothing received
`partially_paid` | Some balance applied, gateway payment still outstanding
`paid_gateway` | Settled through a payment gateway
`paid_balance` | Settled from account balance
`paid_admin` | Marked paid by an administrator
`refunded_balance` | Refunded to the account's balance
`cancelled` | Cancelled with its order

### Things you will actually do

**Mark an invoice paid.** `Admin` → `Invoices` → *view* → **Mark as paid** settles it without money moving — for a bank transfer you received out of band, or as a goodwill grant. It runs the same activation path a gateway payment does, so the order activates normally.

**Cancel an order.** `Admin` → `Orders` → *view* → **Cancel the order** closes the order and its invoice. Whatever the invoice actually collected comes back to the account's balance as part of the cancellation, so the user is not left having paid for something that will never activate.

That includes a *partially* paid invoice. Applying balance to an invoice deducts the paid part from the invoice's own amount, so the figure shown as the invoice price is only what is still owed. The order page therefore shows an **Already collected** row alongside it — that is the amount the cancellation will refund.

Refunds always go to the account's balance, never back through a payment gateway, whichever way the money originally arrived. A gateway refund would bypass the panel's own ledger, and the balance is the only exit that leaves a matching entry in the user's balance history.

One order cannot be cancelled from here: one that has reached `activated`, `expired`, `superseded` or `cancelled` is past the point of cancelling — it has been delivered or is already closed.

**Find out what a user paid with.** `Admin` → `Logs` → `Payment gateway` records every callback a gateway made, with its transaction ID. When a user says they paid and the panel disagrees, this is the log that settles it — the callback either arrived or it did not.

Gateway callbacks are idempotent: a gateway that delivers the same notification twice pays the invoice once, and a genuine duplicate payment is refunded to the account's balance rather than silently kept.

### Automatic tidying

`Admin` → `Settings` → `Shop` → `Order cleanup`:

Setting | Default | Effect
--------|---------|-------
Cancel unpaid orders automatically | On, after 6 hours | Releases the stock and clears the user's unpaid-order count
Cancel partially paid orders automatically | Off, after 48 hours | Kept separate because a partial payment means real money is involved. Refunds what was collected to the account's balance, timed from the partial payment rather than from the order
Clean up cancelled orders automatically | Off, after 720 hours | Deletes cancelled orders and their invoices outright

## Coupons

`Admin` → `Coupons`. A coupon is a discount code applied when the order is created; the discount is written onto the order and the invoice and never recalculated afterwards.

Field | Notes
-------|-------
**Code** | Enter one, or have it generated: the characters given, those characters plus random ones, or fully random
**Type** | Fixed amount, or percentage
**Value** | The amount or the percentage
**Eligible product IDs** | Comma separated. Leave blank for any product
**Uses allowed in total** | Negative for unlimited
**Uses allowed per user** | Negative for unlimited
**New users only** | Restricts it to accounts that have never bought anything
**Expiry** | Blank never expires

**Disable** stops a coupon working while keeping its history; **Delete** removes it. Coupons do not stack with a TABP upgrade credit — the upgrade page has no coupon field, and an upgrade never consumes a use.

## Gift cards

`Admin` → `Gift cards` mints codes that redeem into either a balance top-up or a product. Pick **What it redeems for**, set a **Top-up amount** for a balance card, then **How many to create** and the **Card number length**.

Minting does not consume product stock, and what the card grants is frozen at mint time.

The redemption rules — which checks spend a card and which turn it away untouched — are worth reading before you hand a TABP card to a user who already has a package running: see [Gift Card](../configuration/shop.md#gift-card).

## Payment gateways

Configured under `Admin` → `Settings` → `Payment gateways`; see [Integrations](integrations.md#payment-gateways).
