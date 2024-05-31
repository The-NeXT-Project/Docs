# Q&A

## Subscription links do not update properly after configuring Cloudflare CDN

Set the following request expression as `Bypass cache` in the Caching - Cache Rules:

```
(http.request.uri.path contains "/sub")
```

## Can't access the admin panel after initial setup??

Reading the project README is a good start, make sure you have followed the steps correctly and your environment is set up according to the README and Docs.
