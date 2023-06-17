## Telegram 设置机器人报错

- 自查 api 是否正确
- 检查网站是否启用 https
- 检查 BaseUrl 是否为 https
- 检查网站 ssl 证书是否有效
- 检查服务器能否正常连接 Telegram API

## 订阅链接在配置 Cloudflare CDN 后无法正常更新

在 Cloudflare Cache Rule 中将以下 URL 设为 Bypass Cache：

```
*.example.com/link/*
*.example.com/sub/*
```

## SSPanel-UIM 会添加 xx 协议吗？

SSPanel-UIM 目前支持 Shadowsocks, Vmess及其衍生协议以及Trojan。

任何一个新的协议需要拥有完整的商业解决方案（服务端/客户端/订阅下发）后，我们才会考虑添加其为单独的 server type。

## SSPanel-UIM 支持 vless/xtls/REALITY.. 吗？

我们相信一个良好设计的代理协议是不会需要在其生命周期内进行反复进行修改底层设计才能有效规避审查，原版 Trojan 协议就是一个很好的正面例子。即使在先进流量审查技术例如主动探测，深度包检测以及基于机器学习的流量分析等等威胁下依然能够有效穿透绝大多数受限网络环境，中国和伊朗等地的专制政权需要使用诸如无差别干扰 TLS 握手，TLS 证书白名单，人工 IP 黑名单甚至是局部彻底切断互联网等极端方式才能真正影响 Trojan 协议的运作。可惜的是，我们在 Xray 项目中并没有看到这种发展，相反的，我们看到的是 vless，xtls 等等“革命性”技术在引进的数年后就被宣布取消支持，并且使用新的“革命性” REALITY 协议取而代之。

就如同资本主义需要自由市场竞争才能良性运作一样，代理协议也需要进行不断的竞争并在这个过程中淘汰设计有缺陷或过时的协议，最后才能形成运营者，开发者和终端用户三赢的局面。我们通过支持 Clash.Meta 配置项和提供 Clash Verge 客户端作为默认客户端套件的方式有限度地支持了 Xray-core 中部分协议及其配置下发。需要注意的是，这不代表我们赞同其开发方向和协议设计方针，此改动的目的向 SSPanel-UIM 运营者和终端用户提供更多的选择和替换部分开发者采取 anti-OSS 态度的软件。
