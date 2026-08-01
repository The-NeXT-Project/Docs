---
sidebar_position: 1
---

# Common Questions

## Subscription links do not update properly after configuring Cloudflare CDN

Set the following request expression as `Bypass cache` in the Caching - Cache Rules:

```
(http.request.uri.path contains "/sub")
```
