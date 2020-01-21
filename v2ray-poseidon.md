# [v2ray-poseidon](https://github.com/ColetteContreras/v2ray-poseidon/wiki/00-%E5%85%AC%E5%91%8A%E5%92%8C%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97#v120) 版使用教程

## 功能

- *更好的同时在线IP功能限制*，看了下 SSPanel 的策略是，若在同一段时间内，客户端连接的 IP 超过设定的阈值，该帐户就会被禁止一段时间（从用户使用超过我们设定的阈值，和实际被限制，中间可能会隔很长时间）。这里有许多潜在的问题：1. 影响客户的体验, 2. 之前已经建立的链接是不受影响的（比如：之前在下载的内容，并不会被强制断开，而是会继续下载）。
- 后端支持的同时在线 IP 限制功能，将使用户无法使用超过设定的 IP 数，如设定该用户只能同时 5 个 IP 在线，此时他分享的另一个朋友又想用第 6 个 IP 连接使用，v2ray 会直接拒绝他的这个新的请求。
- 精准的限速功能，可以自行测试一下 1Mps = 128 KB/s

因为 WebAPI 并没有将限制同时在线的 IP 数返回，要让 v2ray-poseidon 支持此功能的话，需要在 SSPanel 代码的目录里执行以下命令：

```
sed -i "s/'u', 'd')/'u', 'd', 'node_connector')/" $(find ./ -iname 'UserController.php' | grep Mod_Mu)
```

### 安装

```
curl -L -s https://raw.githubusercontent.com/ColetteContreras/v2ray-poseidon/master/install-release.sh | sudo bash
```

### 配置

**注意：v2ray-poseidon 不会自动配置后端，需要自行配置。**

```
{
  // 你的 v2ray 配置文件写在这里
  // ... ... 
  // 以下是 v2ray-poseidon 的配置项
  "poseidon": {
    "panel": "sspanel-webapi",  // 这里必须是这个，不能修改
    // Node id on your SSPanel
    "nodeId": 1,
    "license_key": "",          // 无效，或空的 license key 都会被当成社区版
    // every N seconds
    "checkRate": 120,
    "panelUrl": "http 或 https://你的 sspanel 域名",
    "panelKey": "你的 panel key",
    "user": {
      // inbound tag, which inbound you would like add user to
      "inboundTag": "proxy",
      "level": 0,
      "alterId": 16,
      "security": "none"
    }
  }
}
```

### v2ray-poseidon 社区版 vs 商业版

|                        | 社区版 Community | 商业授权版 Enterprise |
|------------------------|------------------|-----------------------|
| 用户同步               | √                | √                     |
| 用户 IP 上报           | √                | √                     |
| 上报结点信息           | √                | √                     |
| 限制用户同时在线 IP 数 | √                | √                     |
| 用户限速               | √                | √                     |
| 即时关闭用户链接（当用户被删除之后）               | √                | √                     |
| 随时更新到最新版本               | √                | √                     |
| 是否需要配置授权码              |   不需要              | [**通过购买获得**](https://github.com/ColetteContreras/v2ray-poseidon/wiki/01-%E5%A6%82%E4%BD%95%E8%8E%B7%E5%8F%96%E5%95%86%E4%B8%9A%E7%89%88%E6%8E%88%E6%9D%83%E7%A0%81) |
| 推荐使用场景     |  学习、测试、50人以下团队使用              | **无限制**  |
| 支持用户数             | 50               | **无限制**                |

加入[V2ray-poseidon TG](https://t.me/v2ray_poseidon)给我们反馈～

### 感谢

- [V2ray](http://github.com/v2ray/v2ray-core)
- [SSPanel-Uim](https://github.com/Anankke/SSPanel-Uim)
 
