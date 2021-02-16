# Air-Universe 大一统后端

Air-Universe 是一个基于Xray的大一统后端, 其包含Shadowsocks单端口, V2Ray, Trojan 3种后端.并且同时兼容V2Ray-core<br>
包含一键脚本自动安装对接, 只需输入面板地址, 对接key 和 一组或一个节点号即可
并且也是一个开源免费的后端版本.

[详细更新文档与开源地址摸我](https://github.com/crossfw/Air-Universe)

## 配置Shadowsocks 节点
请参考单端口配置, 并且把单端口承载用户的协议设为"origin", 混淆设为"plain"<br>
加密方式设为以下几种
- AES-256-GCM
- AES-128-GCM
- ChaCha20-IETF-Poly1305

并且注意需要更新面板到 [232c87c](https://github.com/Anankke/SSPanel-Uim/commit/232c87c0ff80d0118249d9c0eb161f869e7f4c5d) 版本之后

## 配置V2ray与Trojan节点
请参考其他教程配置

## 在TLS中使用自签证书
如果你没有配置证书路径并且使用Trojan或TLS传输的Vmess, 客户端可能会拒绝不安全的证书, 如果你希望使用这种方式,请按如下操作.

在V2ray或Trojan的节点地址后加上"|verify=false"(不含引号), 即可在用户侧通过证书检查, 不过并不是所有客户端都支持跳过检查,请注意风险.

## 配置中转后获取真实IP信息
注意, 该功能需要你的中转使用proxy protocol 协议(v1或v2), 且直连访问将被拒绝, 如果有需要直连的,请在面板上设置2个节点,在安装后端时以逗号分隔输入.

在V2ray或Trojan的节点地址后加上"|relay=true"(不含引号)， 亦或者在节点类型中选择Shadowsocks中转或v2ray中转。

## 配置后端
请到此页面查看最新一键脚本命令

https://github.com/crossfw/Air-Universe