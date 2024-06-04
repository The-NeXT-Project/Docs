# Universal Subscription

## Json format

Request Path

```
/sub/{$userSubscriptionKey}/json
```

Sample Return

```json
{
    "version": 4,
    "sub_name":"NeXT",
    "email":"user@nextpanel.dev",
    "user_name":"next_user",
    "class": 64,
    "class_expire_date":"1989-06-04 04:00:00",
    "total_traffic": 9785653487206,
    "used_upload_traffic": 7036874417766,
    "used_download_traffic": 7036874417766,
    "sub_url": {
        "sing-box": "https://sub.demo.nextpanel.dev/sub/{$userSubscriptionKey}/singbox",
        "clash": "https://sub.demo.nextpanel.dev/sub/{$userSubscriptionKey}/clash"
    }
}
```

## Clash format

Request path

```
/sub/{$userSubscriptionKey}/clash
```

## SingBox format

Request path

```
/sub/{$userSubscriptionKey}/singbox
```

## SIP008 format

> SIP008 subscriptions are only supported for Shadowsocks node types

Request Path

```
/sub/{$userSubscriptionKey}/sip008
```

## V2Ray Json V5 format

Request Path

```
/sub/{$userSubscriptionKey}/v2rayjson
```
