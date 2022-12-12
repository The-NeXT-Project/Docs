# 魔改常见问题解答

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

宝塔搭建的可以在站点修改配置文件中找到

```
ssl_protocols TLSv1.1 TLSv1.2;
```

改为

```
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
```


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

## Git 报错 `Peer reports incompatible or unsupported protocol version`

Git 版本过低，请前往 [Git 官网下载页](https://git-scm.com/downloads) 查看升级指导。

## master 分支切换到 dev 分支出现报错

请仔细对比自己的数据库与dev版本数据表以及数据项目的不同并手动添加，并且要注意更改 cron 任务的指令格式，并在完成代码升级后运行。

```bash
git fetch --all
git reset --hard origin/dev
git pull
php composer.phar u
php vendor/bin/phinx migrate
php xcat Update
php xcat Tool importAllSettings
```
