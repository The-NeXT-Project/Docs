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

# ChenPay

部分介绍：https://github.com/ChenSee/ss-panel-v3-mod_Uim-alipay-wxpay

## 1. 安装依赖

```
composer require chen-see/chen-pay
# 如有提示按Y
# 如无法正常安装可执行rm -rf vendor/然后再composer update
# 如监听时出现异常 yum update nss
```

## 2. 配置 config

在配置文件 `/config/.config.php` 中的 `$System_Config['payment_system']` 后插入以下内容:

```php
//支付系统设置--------------------------------------------------------------------
#取值 codepay,doiampay,paymentwall,zfbjk,spay,f2fpay,yftpay,none,f2fpay_codepay,chenAlipay
$System_Config['payment_system']='chenAlipay';
```

## 3. 导入数据

- 使用一般mysql工具导入sql/config.sql即可（不会影响数据）

## 4. 获取支付宝 COOKIE

- 浏览器访问：https://mbillexprod.alipay.com/enterprise/tradeListQuery.htm
- 登录支付宝账号
- 浏览器按 <kbd>F12</kbd> 再刷新一下
- 可以看到tradeListQuery.json
- 点击 `Header` 找到 `Cookie`，全部复制到后台配置框内

## 5. 获取微信 COOKIE

- 浏览器访问：https://wx.qq.com（此地址必须设置到后台支付设置里，登录完成后会有所变更）
- 手机扫码登录微信账号
- 浏览器按 <kbd>F12</kbd> 再刷新一下
- 可以看到 `webwxinit?r=*******`
- 点击 `Header` 找到 `Cookie`，全部复制到后台配置框内

## 6. 获取微信&支付宝付款码

- 直接到支付点加号
- 找到收付款
- 点击二维码收款
- 设置金额（如果你想多金额）
- 保存收款码
- 访问：`https://cli.im/deqr` 上传付款码二维码
- 解析出来的地址复制到后台管理的二维码地址框

## 7. 执行命令

```
$ crontab -e
* * * * * php /你的目录/xcat wxpay
* * * * * sleep 10; php /你的目录/xcat wxpay
* * * * * sleep 20; php /你的目录/xcat wxpay
* * * * * sleep 30; php /你的目录/xcat wxpay
* * * * * sleep 40; php /你的目录/xcat wxpay
* * * * * sleep 50; php /你的目录/xcat wxpay

* * * * * php /你的目录/xcat alipay
* * * * * sleep 10; php /你的目录/xcat alipay
* * * * * sleep 20; php /你的目录/xcat alipay
* * * * * sleep 30; php /你的目录/xcat alipay
* * * * * sleep 40; php /你的目录/xcat alipay
* * * * * sleep 50; php /你的目录/xcat alipay
# 日志查看
$ tail /你的目录/storage/logs/chenpay.log
```

## 特别说明

- 服务器时间必须要正确的中国时间，需要匹配支付宝微信时间
- 排队机制修改同一支付类型支持不同支付金额，同一支付金额不同支付类型
- 出现 cookie 失效有可能是服务器无法访问相关接口原因导致掉线
- eamil 通知必须要设置其中的一个邮箱
- 刷新频率为 10 秒一次
