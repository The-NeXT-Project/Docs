---
sidebar_position: 5
---

# Announcements, Documentation and Pages

Three different ways of putting words in front of users, with three different reaches.

Feature | Where users see it | Who sees it
---------|-------------------|-------------
Announcements | The dashboard and `/user/announcement` | Signed-in users
Documentation | `/user/docs` | Signed-in users, optionally paying ones only
Static pages | A URL of your choosing | Anyone, or signed-in users only

## Announcements

`Admin` → `Announcements`. Write in Markdown; it is rendered for users.

Field | Notes
-------|-------
**Announcement title** | Shown in the list and used as the email subject
**Content** | Markdown
**Status** | *Unpublished*, *Published*, or *Pinned*. A pinned announcement stays at the top of the dashboard
**Order** | Sorts announcements of equal status

### Emailing it

Ticking **Send an email notification** when you publish queues the announcement to every account at or above **Notify users at or above this level**. Set the level to 0 to reach everyone, or higher to reach only paying users.

The mail goes through the [message queue](../systems/notifications.md), so a large site does not block the request while thousands of messages are sent; Cron drains the queue. Each message is rendered in its recipient's own language.

Publishing also pings the IM group when **Announcement created** is on under `Settings` → `IM settings` → `Notifications`, with **Announcement updated** as a separate switch — most sites want the first and not the second.

## Documentation

`Admin` → `Documentation` is the site's own help pages: how to import a subscription, which client to use, what to do when a node is slow. Same shape as announcements — title, Markdown body, published or not, sort order.

Two settings under `Settings` → `Other settings` → `Feature visibility` control the section: **Show the documentation** turns it on at all, and **Show the documentation to paying users only** restricts it.

### Writing one with an LLM

With an [LLM backend configured](integrations.md#llm), **Generate with an LLM** opens a box where you describe the document you want. The model is given read-only access to the site's existing documents and its on-sale products, so what it writes matches what the site actually offers rather than a generic guess.

What comes back is a draft in the editor. Nothing is published until you save it, and you can edit it first — which you should, because the model is describing your site from a summary of it.

## Static pages

`Admin` → `Static pages` serves arbitrary content at `/pages/{route}`.

Field | Notes
-------|-------
**Route** | The URL segment. Must be unique
**Page title** | Shown in the browser and at the top of the page
**Status** | *Hidden*, *Public*, or *Signed-in users only*

`terms` and `privacy` are built in and reachable at `/terms` and `/privacy`; their routes cannot be renamed, because the sign-up form links to them by name. Everything else is yours.

**Preview** renders the page as a user would see it before you make it public.
