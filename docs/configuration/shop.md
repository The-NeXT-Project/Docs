# Shop

## Product type cheat sheet

Product Type | Repeat Purchase | Stack Package Contents | Empty Usage on Activation | Only one activated order per user at the same time
--------|---------|-------------|---------------|-------------------
TABP | ✔ | ✕ | ✔ | ✔
Bandwidth Package | ✔ | ✔ | ✕ | ✕
Time Package | ✔ | ✔`*` | ✕ | ✕

`*` Usage time are only stacked if the Time Pack level is the same as the paid user's current level, free users are not subject to this restriction

## Time and Bandwidth Package (TABP)

TABP is the default product mode in the legacy store system, each TABP contains a fixed level + level duration + traffic, users can buy more than one at one time, but only one TABP order can be active at the same time, multiple TABP orders will be activated in turn according to the order of purchasing, meanwhile, the TABP orders that are expired will be marked as ``expired``.

Each TABP order is activated for a maximum of one Cron cycle (5 minutes), and only one TABP order per user is activated in a Cron cycle.

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
