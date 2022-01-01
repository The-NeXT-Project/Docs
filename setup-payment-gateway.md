# 支付系统对接教程

在后台 `/admin/setting` 设置

![https://raw.githubusercontent.com/sspanel-uim/Wiki/master/img/payment.png](https://raw.githubusercontent.com/sspanel-uim/Wiki/master/img/payment.png)

## coinpay
虚拟货币

[www.coinpayapp.com](https://www.coinpayapp.com/)

## f2fpay
支付宝

[b.alipay.com](https://b.alipay.com/signing/productDetailV2.htm?productId=I1011000290000001003)

## payjs
支付宝和微信

[payjs.cn](https://payjs.cn/)

## paymentwall
自盘古开天辟地时就有的支付方式，但我没见有人在用

[www.paymentwall.com](https://www.paymentwall.com/cn)

## stripe
目前只支持信用卡和储蓄卡（没有 `stripe` 号供调试）

[stripe.com](https://stripe.com/zh-cn-hk)

## theadpay
好像是支持支付宝和微信，然后用 `usdt` 结算

[theadpay.com](https://theadpay.com)

## vmqpay
相当于自建码支付（不过 [codepay.fateqq.com](https://codepay.fateqq.com) 已凉，勿念）

- 此支付方式需自建网关并配置各项参数。访问 [https://github.com/szvone/vmqphp](https://github.com/szvone/vmqphp) 了解更多
- 开源的 Android 监听端（推荐）：[https://gitee.com/yuniks/VMQAPK](https://gitee.com/yuniks/VMQAPK)
- 不开源的 Windows 监听端（不推荐）：[https://toscode.gitee.com/pmhw/Vpay](https://toscode.gitee.com/pmhw/Vpay)
