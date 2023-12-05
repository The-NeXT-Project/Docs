## json 格式

请求路径

```
/sub/{$userSubscriptionKey}/json
```

下发范例

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

## clash 格式

请求路径

```
/sub/{$userSubscriptionKey}/clash
```

## sing-box 格式

请求路径

```
/sub/{$userSubscriptionKey}/singbox
```

## SIP008 格式

?> SIP008 订阅仅支持 Shadowsocks 节点类型

请求路径

```
/sub/{$userSubscriptionKey}/sip008
```
