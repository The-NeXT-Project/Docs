---
sidebar_position: 4
---

# Buying and Paying

## The billing page

**Billing** is the overview: your balance, what is currently active on your account with its remaining days and traffic, and any orders waiting to be paid or waiting to activate. It is also where you redeem a gift card and where the **Upgrade plan** button lives.

## What is on sale

**Shop** → **Products** groups what the site sells into three tabs, because the three behave differently.

Type | You get | Notes
------|---------|-------
**Time and traffic pack** | A level, for a number of days, with a traffic allowance | The usual "monthly plan". Only one runs at a time
**Traffic pack** | Extra traffic, nothing else | Stacks onto what you have. Buy several at once if you want
**Time pack** | Level time, without touching your traffic | For sites that sell time and traffic separately

Each product shows its price, what it grants, and the connection speed and concurrent IP limit that come with it. A product your account is not eligible for — level too low, wrong node group, or new-customer-only — is not offered.

### Buying

**Buy** creates an order and its invoice. If you have a coupon, apply it on the order page before confirming; the discount is fixed onto the invoice at that moment and does not change afterwards.

Then pay the invoice, from **Billing** → **Invoices**:

- **Pay with balance** if your account balance covers it.
- **Pay with a gateway** for the payment methods the site accepts.

Payment confirms immediately and your order activates straight away — you do not wait for a scheduled job. If a payment appears to succeed but the invoice still shows unpaid after a minute, open a ticket with the transaction ID; the operator can see every callback the gateway made.

An unpaid order does not sit around forever. Most sites cancel them automatically after a few hours, which simply releases the order — you can place a new one.

## Only one plan at a time

Time and traffic packs queue rather than stack. Buying a second one while the first is running does not extend anything: the new one waits, and activates when the current one expires.

That is usually not what you want when you have outgrown your plan mid-month, which is what **Upgrade plan** is for.

## Upgrading

If the site allows it, a running time-and-traffic pack can be traded up to a more expensive one right away, paying only the difference.

**What you are credited.** The price you actually paid for the current pack, scaled by whichever is *smaller*: the fraction of its days still left, or the fraction of its traffic still unspent.

Taking the smaller of the two is the fair reading of "how much of this have I used". Someone who burned 80% of their traffic in the first week has most of the calendar left but very little of what they bought.

A worked example — a 30-day, 100 GB pack bought for 30, fifteen days in with 20 GB spent, upgrading to a 100 pack:

Input | Value
-------|-------
Days left | 15 of 30 → 0.5
Traffic left | 80 of 100 GB → 0.8
Credit is based on | the smaller, 0.5
Credit | 30 × 0.5 = 15.00
You pay | 100 − 15 = 85.00

**What you end up with.** Exactly what buying that pack outright would give you: used traffic back to zero, the new pack's full allowance, and the level clock restarting from the moment it activates rather than adding to what was left.

**Two things to know.** Nothing happens to your current pack until the upgrade invoice is paid — an abandoned upgrade leaves you exactly where you were. And coupons do not apply to an upgrade; the credit is the discount.

## Balance

**Top up balance** on the billing page adds credit you can spend on later invoices. Some sites set minimum and maximum amounts per payment; those are shown before you commit.

**Billing** → **Balance history** lists every change to your balance with a note explaining it — top-ups, invoice payments, refunds, invitation rebates, gift card redemptions.

## Gift cards

Redeem a code on the **Billing** page. There are two kinds and the box takes both:

- a **balance** card adds its face value to your balance;
- a **product** card activates the package it was minted for, directly on your account.

If your account is not currently eligible for what the card contains — for example a time-and-traffic pack while your current one still has weeks to run — the site says so and **your code is not used up**. Keep it and redeem it when you are closer to expiry.

Once a card is accepted it is spent, even if the package it contains has to queue behind something that is still running. You will be told that it succeeded and will activate when it can.

## Coupons

Enter a coupon on the order page before creating the order. A coupon may be limited to certain products, to new customers, to a number of uses in total or per person, and it may expire. If it is rejected, one of those applied.

Coupons do not combine with an upgrade credit.

## Traffic history

**Billing** → **Traffic history** records every change to your traffic allowance and where it came from: a check-in reward, an order activating, the monthly free reset, an administrator's adjustment. When your allowance is not what you expected, this is the page that explains it.
