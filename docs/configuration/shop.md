# Shop

## Product type cheat sheet

Product Type | Repeat Purchase | Stack Package Contents | Empty Usage on Activation | Only one activated order per user at the same time
--------|---------|-------------|---------------|-------------------
TABP | ✔ | ✕ | ✔ | ✔
Bandwidth Package | ✔ | ✔ | ✕ | ✕
Time Package | ✔ | ✔`*` | ✕ | ✕

`*` Usage time are only stacked if the Time Pack level is the same as the paid user's current level, free users are not subject to this restriction

## Time and Bandwidth Package (TABP)

TABP is the default product mode in SSPanel's old store system, each TABP contains a fixed level + level duration + traffic, users can buy more than one at one time, but only one TABP order can be active at the same time, multiple TABP orders will be activated in turn according to the order of purchasing, meanwhile, the TABP orders that are expired will be marked as ``expired``.

Each TABP order is activated for a maximum of one Cron cycle (5 minutes), and only one TABP order per user is activated in a Cron cycle.

## Bandwidth Package

This corresponds to the additional bandwidth packages in SSPanel's legacy store system. Users can purchase multiple bandwidth packages at once, and the contents of the bandwidth packages will be superimposed on the user's current total available bandwidth, with multiple bandwidth packages activated in turn in the order in which they were purchased.

Each Time Package order will be activated for a maximum of one Cron cycle (5 minutes), and only one Time Package order per user will be activated in a Cron cycle.

## Time Package

Time Package is a unique product type added to SSPanel's new store system, which is intended to provide tiers, with a billing model that separates the tier duration from the traffic (Pay as You Go).

When purchased by a free user, Time Packs behave like TABP, but they do not** reset the purchased user's used or total traffic.

When a paying user's current tier is equal to the tier in the time pack, the tier hours in the time pack are used to extend the user's current tier hours and the `User Grouping`, `Rate Limit` and `Simultaneous Connection IP Limit` parameters in the time pack directly override the values in the user's current account.

When a paying user's current level is not equal to the level in the time pack, the time pack will not be activated until the user's current level has expired.

Each time pack order will be activated for a maximum of one Cron cycle (5 minutes), and only one time pack order per user will be activated in a Cron cycle.
