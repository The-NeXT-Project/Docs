---
sidebar_position: 1
---

# Common Questions

## Subscription links do not update properly after configuring Cloudflare CDN

Set the following request expression as `Bypass cache` in the Caching - Cache Rules:

```
(http.request.uri.path contains "/sub")
```

## Can't access the admin panel after initial setup?

Reading the project README is a good start, make sure you have followed the steps correctly and your environment is set up according to the README and Docs.

## Where is the source code of the project?

We recently noticed an unauthorized redistribution attempt, which may draw unnecessary attention to the NeXT Panel project, for the longevity of SSPanel-NeXT and its projects, we have decided we will no longer publish git commit history. The newer release of the NeXT panel will contain a zip file that includes the project's source code.
