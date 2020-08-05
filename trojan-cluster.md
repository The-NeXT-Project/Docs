Trojan-Cluster 和 Yahagi.js 对接教程
===

> yahagi.js 是通过 webapi 连接使用 redis 数据库的 trojan 后端的 sspanel 驱动。

## [面板] 添加节点

#### 节点地址

```
节点域名;port=443
```

#### 节点类型

```
Trojan
```

## 安装 Trojan-Cluster

> 您也可以使用 `trojan-go` 作为后端，若您如此做，请参阅 [Trojan-Go 的文档](https://p4gefau1t.github.io/trojan-go)。

在部署之前，您需要在服务器上运行的一个 `redis` 服务，请注意，暴露在公网的 `redis` **极其危险** ，确保您的防火墙配置正确！

> 关于如何安装 redis ，请参阅您服务器发行版的文档。

1. 获取 Trojan-Cluster 的二进制文件（您也可以自己编译。）
    从 [Azure Pipeline](https://dev.azure.com/kunagisamari/trojan-redis/_build/result) 或 [GitHub Release](https://github.com/trojan-cluster/trojan-cluster/releases)下载最新版本的二进制。
2. 配置 Trojan-Cluster
    您只需要在常规 Trojan 配置文件的基础上做以下修改：删除 MySQL 配置部分并添加：
    ```json
    "redis": {
        "enabled": true,
        "server_addr": "127.0.0.1",
        "server_port": 6379
     }
     ```
     请根据您服务器的实际情况调整设置。
 3. 使 Trojan-Cluster 持续化运行
     参见原版 Trojan 的 `systemd` 配置。

## 安装 Yahagi.js

> 在安装之前，您需要准备 `Nodejs` 和 `npm` ，安装方式参见您发行版的文档。

1. 获取 Yahagi.js 。
    `git clone https://github.com/trojan-cluster/yahagi.js`
2. 安装依赖。
    执行 `npm install yahagi.js`
3. 配置 Yahagi.js
    修改 `index.js` 中的以下行为你服务器的对应信息。
    ```javascript
    let domain = ""; // 面板 WebAPI 域名，不含协议。
    let node_id = ""; // 后台的节点 id
    let key = ""; // 节点 WehAPI 连接密钥
    ```
4. 使 Yahagi.js 持久化运行
    参见 systemd 服务配置，或者您可以使用 pm2。


