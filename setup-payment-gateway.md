# 支付系统对接教程

## 支付宝当面付

### 支付宝付款接口配置

```php
$System_Config['f2fpay_app_id']='2017221985';
$System_Config['f2fpay_p_id']='20887023';
$System_Config['alipay_public_key']='MIIBxxxxxxxxxxxxxx';
$System_Config['merchant_private_key']='MIIExxxxxxxxxxxxxxxxxxx';
```

一共有四个位置要填写：

!> 密钥生成工具请使用支付宝官方工具，注意红框内的选项。
![img](https://i.imgur.com/5gaRzDl.png)

- `$System_Config['f2fpay_app_id']=''`

这个是支付宝开放平台里的 APPID，开通收款码服务后进入支付宝开放平台，签约 **自研开发者** 后进入开发者中心新建一个 app 提交审核后的 APPID

- `$System_Config['f2fpay_p_id']`

这个是收款的支付宝账号，用来确认阿里消息正确性的。<https://openhome.alipay.com/platform/keyManage.htm?keyType=partner> 签约管理里合作伙伴身份 PID

- `$System_Config['alipay_public_key']`

指的是这里的 **支付宝公钥**，注意是 **支付宝公钥**。 

![img](https://img.vim-cn.com/1b/a99bc47671cfa05c6f4dfbea1995fd8523319f.png)

- `$System_Config['merchant_private_key']`

这个是你 **自己的私钥**。

## 码支付

优点是 QQ 和 支付宝 免手续费直接到账，缺点是微信需要 58 的授权费（终身授权），而且网络情况不佳时掉单会很频繁。

首先，你要有一个能上网的 Windows 系统的电脑（24小时开机，但配置不用高），用于支付宝和 QQ 收款的网站回调。

收款即时到帐，钱款将直接转入你的个人账户，手续费为 0（微信收款功能需要单独购买授权）

> 演示站：[点此查看](http://ssrstatus.tk/)，用户名 admin 密码 admin

### 1. 注册

[点此注册注册码](https://codepay.fateqq.com/i/39756)

### 2. 配置 config

支付方式设置为 `codepay`，填写格式的请参考 `/config/.config.php.example`

### 3. 上传收款码

在 **二维码收款** 处上传你的 **收款码**。

### 4. 下载码支付收款辅助软件

[下载链接](http://down.xiuxiu888.com/codepay/codepay.rar)，若此链接失效，请点击上文的官网去下载最新版本。

### 5. 启动辅助软件

将得到压缩包解压到任意目录，打开 `codepay.exe` 登录你的码支付帐号。

然后扫码登录支付宝和 QQ 即可。需要微信的用户请自己开通。

### 注意

如果面板使用了 Cloudflare，可能会遇到回调失败，需要在 Cloudflare 中添加 Page Rules 解决：

`/codepay_callback`

规则为：

```
Disable Security
Security Level - Essentially Off
Web Application Firewall（如果有）- Off
```

另外，如果在码支付后台管理通知地址处写上 `[面板域名]/codepay_callback`
