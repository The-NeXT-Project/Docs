# 魔改常见问题解答

## Telegram 设置机器人报错

- 自查 api 是否正确
- 检查网站是否启用 https
- 检查 BaseUrl 是否为 https
- 检查网站 ssl 证书是否有效

## 从其他版本(91vps,魔改原版）等更新来的，节点列表报错500

- 请手动对照 .config.php.example 更新 .config.php，或者使用 `php xcat update` 自动更新 .config.php

## 更新订阅链接失效解決方法：

源站关闭所有 WAF 如 Nginx WAF 插件或者 btwaf。

Cloudflare 上设置以下 Page Rules：

```
/ssr-download/ssr/*
/link/*
/link/*
```

```
Disable Security
Security Level - Essentially Off
Web Application Firewall（如果有）- Off
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

## 配置节点国旗

默认节点命名规则：

```
国家/地区的名字+一个空格
```

例：

```
美国 A节点 //自动显示 美国.jpg
```

```
中国 深圳vps //自动显示 中国.jpg
```

```
英国 balabala //自动显示 英国.jpg
```

然后将 config 文的

```php
$System_Config['enable_flag']='false';
```

```php
$System_Config['enable_flag']='true';
```

如果有其他需求（比如喜欢把国家/地区名放到中间或后面、不想用空格），可以自行修改下方 `$System_Config['flag_regex']` 中的正则表达式

## 错误 `Undefined offset :0 in`

常见于使用宝塔、对接节点数量较多的情况。

在宝塔面板中找到 PHP，点击设置：

- 在 **禁用函数** 一栏找到 `system` `putenv` `proc_open` `proc_get_status` 全部取出
- 在 **性能调整** 中，把 PHP 运行模式设置为 **静态**
- 在 **配置文件** 中 按 <kbd>Ctrl</kbd> + <kbd>F</kbd> 搜索 `display_errors` 将 `=` 后的值改为 `Off` 后保存

![](https://i.loli.net/2018/04/06/5ac64a16dbeaf.png)

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

## 邮件队列问题

邮件队列定时任务执行过程中在意外或手动停止后，若此时执行提示 **程序正在运行中** 请前往 `/storage` 删除 email_queue.

## master 分支切换到 dev 分支出现报错

请仔细对比自己的数据库与dev版本数据表以及数据项目的不同并手动添加，并且要注意更改 cron 任务的指令格式，并在完成代码升级后运行。

```bash
php xcat update
```