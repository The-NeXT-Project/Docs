# soga 后端
soga 后端是一个支持 v2ray 和 trojan 的后端

## v2ray
soga 后端针对 v2ray 占内存的特点使用 C 语言特别优化了 v2ray 的内存占用，在相同用户数量和 alterId 下，相对于原版 v2ray 来说可节省 40-60% 的内存空间，用户数量越多，节省的内存就越多。

## trojan
soga 同时实现了 trojan 协议，trojan 协议相对于 v2ray 来说更轻量和高效，在大量用户下也几乎不占多少内存，推荐优先选择 trojan。

Github：https://github.com/sprov065/soga

加入我们：[Telegram群组](https://t.me/soga_v2ray)

致谢:

[v2ray-core](https://github.com/v2ray/v2ray-core)

[trojan](https://github.com/trojan-gfw/trojan)
