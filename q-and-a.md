## Telegram 设置机器人报错

- 自查 api 是否正确
- 检查网站是否启用 https
- 检查 BaseUrl 是否为 https
- 检查网站 ssl 证书是否有效
- 检查服务器能否正常连接 Telegram API

## 更新订阅链接失效解決方法：

源站关闭所有 WAF 如 Nginx WAF 插件或者 btwaf。

Cloudflare 上设置以下 Page Rules：

```
*.example.com/link/*
*.example.com/sub/*
```

```
Cache Level - Bypass
```

如果面板在 Cloudflare 上启用了 HTTPS，请在 `Crypto` 处修改 `Minimum TLS Version` 为 `TLS 1.0` 协议。


## IIS 伪静态配置写法

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="slim" patternSyntax="Wildcard">
                    <match url="*" />
                    <conditions>
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="index.php" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```
