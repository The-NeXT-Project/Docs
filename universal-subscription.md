## json format

Request Path

```
/sub/{$userSubscriptionKey}/json
```

Sample Return

```json
{
    "version": 4,
    "sub_name":"SSPanel",
    "email":"user@sspanel.org",
    "user_name":"ssp_user",
    "class": 999,
    "class_expire_date":"1989-06-04 04:00:00",
    "total_traffic": 9785653487206,
    "used_upload_traffic": 7036874417766,
    "used_download_traffic": 7036874417766,
    "sub_url": {
        "sing-box": "https://sub.sspanel.org/sub/{$userSubscriptionKey}/singbox",
        "clash": "https://sub.sspanel.org/sub/{$userSubscriptionKey}/clash"
    }
}
```

## clash format

Request path

```
/sub/{$userSubscriptionKey}/clash
```

## sing-box format

Request path

```
/sub/{$userSubscriptionKey}/singbox
```

## SIP008 format

? > SIP008 subscriptions are only supported for Shadowsocks node types

Request Path

```
/sub/{$userSubscriptionKey}/sip008
```
