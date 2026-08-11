# Shop

## Product type cheat sheet

Product Type | Repeat Purchase | Stack Package Contents | Empty Usage on Activation | Only one activated order per user at the same time | Upgradable mid-cycle
--------|---------|-------------|---------------|-------------------|-------------------
TABP | ✔ | ✕ | ✔ | ✔ | ✔`†`
Bandwidth Package | ✔ | ✔ | ✕ | ✕ | ✕
Time Package | ✔ | ✔`*` | ✕ | ✕ | ✕

`*` Usage time are only stacked if the Time Pack level is the same as the paid user's current level, free users are not subject to this restriction

`†` Only to a more expensive TABP, and only while `Enable TABP upgrade` is on — see [Upgrading a TABP](#upgrading-a-tabp)

## Time and Bandwidth Package (TABP)

TABP is the default product mode in the legacy store system, each TABP contains a fixed level + level duration + traffic, users can buy more than one at one time, but only one TABP order can be active at the same time, multiple TABP orders will be activated in turn according to the order of purchasing, meanwhile, the TABP orders that are expired will be marked as ``expired``.

Each TABP order is activated for a maximum of one Cron cycle (5 minutes), and only one TABP order per user is activated in a Cron cycle.

### Upgrading a TABP

Buying a second TABP queues it behind the running one, which is the wrong shape for a user who wants a bigger package *now* — the remainder they already paid for would go to waste, and `Days within class expire before allowed to purchase TABP` blocks the purchase outright until they are close to expiry. Upgrading is the path for that case: the running package is closed out, the new one activates immediately, and what was left of the old one comes off the price.

`Enable TABP upgrade` (on by default) controls whether the feature is offered at all. With it on, a user with a running TABP sees an **Upgrade** button on every TABP in the shop that costs more than the package they are on, and an **Upgrade package** link on their `Billing` page.

#### What the upgrade is worth

The credit is the price the user actually paid for the running order, scaled by whichever is smaller: the fraction of the order's duration still left, or the fraction of its traffic still unspent.

Taking the lesser of the two is deliberate. Someone who spent 80% of their traffic in the first week still has most of the calendar left, and crediting them on time alone would sell them a near-free upgrade.

Worked example — a 30-day / 100 GB package bought for 30, fifteen days in with 20 GB spent, upgrading to a 100 package:

Input | Value
--------|---------
Time left | 15 of 30 days → `0.5`
Traffic left | 80 of 100 GB → `0.8`
Ratio used | `min(0.5, 0.8)` = `0.5`
Credit | `30 × 0.5` = `15.00`
Payable | `100 − 15` = `85.00`

The credit is capped at the price of the new package, so an upgrade never turns into a cash refund, and `Maximum TABP upgrade credit as percent of the superseded order price` (100 by default, i.e. no cap) trims it further if you want upgrades to keep some margin. Set it to `80` and the example above credits `24.00` at most rather than `30.00`.

The amount is worked out once, when the order is created, and written onto the order and the invoice. It is not recalculated later, for the same reason the list price and coupon discounts are not: the invoice is what the user agreed to and what the gateway charged.

Coupons do not stack with an upgrade credit — the upgrade page has no coupon field, and an upgrade never consumes a coupon's use count.

#### What the user ends up with

An upgrade grants exactly what buying that package outright grants, because it runs through the same activation code: used traffic reset to zero, total traffic replaced by the new package's allowance, and level duration counted from the moment of activation rather than added to what was left. The old order is marked `superseded` — a status of its own, so it is not counted among genuinely expired orders.

#### If the invoice is never paid

Nothing happens to the running package at checkout. It is only retired at the moment the new order activates, which is after the invoice is settled. So an abandoned upgrade leaves the user exactly where they were, and the unpaid order is cancelled by `Auto cancel pending payment orders` like any other.

Two consequences worth knowing for support:

- A user may only have one upgrade order outstanding at a time. Asked for a second, the panel points them at the first one to pay or wait out.
- If the running package expires on its own before the upgrade invoice is paid, the upgrade simply activates as an ordinary package — at the discounted price. This favours the user, and the window is bounded by the auto-cancel setting.

If the running package was swapped out in the meantime (a gift card, or an admin grant), the upgrade will not retire the replacement it was never priced against. It queues instead and activates once that package expires.

## Bandwidth Package

This corresponds to the additional bandwidth packages in the legacy store system. Users can purchase multiple bandwidth packages at once, and the contents of the bandwidth packages will be superimposed on the user's current total available bandwidth, with multiple bandwidth packages activated in turn in the order in which they were purchased.

Each Time Package order will be activated for a maximum of one Cron cycle (5 minutes), and only one Time Package order per user will be activated in a Cron cycle.

## Time Package

Time Package is a unique product type added to NeXT Panel's new store system, which is intended to provide tiers, with a billing model that separates the tier duration from the traffic (Pay as You Go).

When purchased by a free user, Time Packs behave like TABP, but they do not** reset the purchased user's used or total traffic.

When a paying user's current tier is equal to the tier in the time pack, the tier hours in the time pack are used to extend the user's current tier hours and the `User Grouping`, `Rate Limit` and `Simultaneous Connection IP Limit` parameters in the time pack directly override the values in the user's current account.

When a paying user's current level is not equal to the level in the time pack, the time pack will not be activated until the user's current level has expired.

Each time pack order will be activated for a maximum of one Cron cycle (5 minutes), and only one time pack order per user will be activated in a Cron cycle.

## Gift Card

A gift card carries what it hands out. Two kinds can be minted:

Card | Redeems into
--------|---------
Balance | The face value is credited to the account balance
Product | The bound TABP, Bandwidth Package or Time Package is activated on the account

Cards are minted in `Admin` → `Gift Card`. `Redemption Content` picks between a face value and one of the products on sale; a balance card also needs a `Face Value`, which product cards ignore. The rest is the number of cards to mint and the code length. What a card hands out is copied onto it when it is minted, so editing or delisting the product later does not change what an already issued card is worth. Minting cards does not consume product stock.

Redemption happens on the user's `Billing` page and goes through the ordinary order pipeline, whichever kind of card it is: the panel creates a free, already-paid order and hands it to the same activation code a paid order uses, so every redemption leaves an order and an invoice behind.

Gift cards issued before this change are balance cards; the database migration carries their face value over and they redeem unchanged.

### Redeeming while another order is active

A redemption passes two checks, and it matters which one turns it away.

The first is the same account check a purchase passes, so everything under `Admin` → `Settings` → `Shop` applies to a redemption too: shadow ban, email verification if `Require email verification to purchase` is on, `Maximum pending payment orders per user` counted over the user's unpaid orders, and the TABP limits described below. **A card turned away here is not spent**: no order is created, the code stays valid, and the user is told their account does not currently qualify. They can redeem the same code once the account does.

Worth noting for `Maximum pending payment orders per user`: a redemption never creates an unpaid order itself, but a user already sitting on that many unpaid orders cannot redeem until they pay or cancel some.

The second is activation itself. A card that gets this far **is spent**, and if the product cannot activate this instant the order is left `pending_activation` for Cron to pick up — the user is told the redemption succeeded and the order will activate once it can. Nothing is lost, it just arrives later.

What that means per card, for a user who already has something running:

Card | Result
--------|---------
Balance | Credited immediately
Bandwidth Package | Activated immediately, stacked onto the current traffic
Time Package | Activated immediately for a free user, or a paying user already on that level. A paying user on a different level keeps the order queued until their current level expires
TABP | Turned away or queued, depending on `Days within class expire before allowed to purchase TABP`

For TABP, the deciding setting is `Days within class expire before allowed to purchase TABP` (7 by default). A user whose level expires further out than that window is turned away by the first check, exactly as they would be if they tried to buy the same package — their card is untouched and they can redeem it once they are inside the window. Inside the window the redemption always goes through: if the running TABP has already run out it is expired on the spot and the card activates immediately, otherwise the order queues and Cron activates it when the current one expires, at most one TABP per user per Cron cycle.

The other TABP setting, `Maximum activated TABP orders per user`, does not affect redemption in practice: only one TABP per user is ever in the activated state, so the count never reaches a limit of 2 or more.

If you would rather a gift card never be turned away — so that handing someone a TABP always works and simply queues — set `Days within class expire before allowed to purchase TABP` to `0`. Note this also removes the window for ordinary purchases.

One last detail for support: a redemption tries to activate its own order first, so if the slot happens to be free at that moment it goes ahead of an older paid order that is still waiting. This is how a settled payment behaves as well — the gateway callback activates the order it just paid for — and from the next Cron cycle onwards the queue is worked in order of order ID.
