---
sidebar_position: 1
---

# Common Questions

## Subscription links do not update properly after configuring Cloudflare CDN

Set the following request expression as `Bypass cache` in the Caching - Cache Rules:

```
(http.request.uri.path contains "/sub")
```

## Where is the source code of the project?

We recently noticed an unauthorized redistribution attempt by SSPanel-UIM project, which may draw unnecessary attention to the NeXT Panel project, for the longevity of NeXT Panel and its projects, we have decided we will no longer publish git commit history. The newer release of the NeXT panel will contain a zip file that includes the project's source code.
