# [Trojan Poseidon](https://docs.trojanp.xyz/#/sspanel) 使用教程

> 搭建 Trojan 前需要为该节点准备一个域名，TLS 加密所必须的

| 配置 | 用户 | 节点 |
|-------|-------|----------|
| 极简配置 | 单个用户限速 | 节点限速 |
| 自动生成 TLS 证书 | 用户同时在线 IP 数限制(类似设备限制) | 审计规则 |
| 自动更新 TLS 证书 | 每分钟自动同步 | 节点负载 |
| 节点可以变成一个静态网站 | 用户流量统计 |  |
| 节点也可以变成一个网站的镜像 | 用户在线 IP 统计 |  |
|  | 用户触发规则 (10分钟同一个规则仅上报一次) |  |

## [面板] 添加节点

#### 节点地址

```
节点域名;port=443
```

#### 节点类型

```
Trojan
```

## 配置后端

该后端为了与原生的 Trojan 后端区别开，所有的命令和文件统一为 trojan<span style="color: red; font-weight: bold">p</span>

### 安装
```
(yum install curl 2> /dev/null || apt install curl 2> /dev/null) \
  && curl -L -s https://raw.githubusercontent.com/ColetteContreras/trojan-poseidon/master/sspanel-install-release.sh \
  | WEB_API="https://面板域名" \
    NODE_ID=节点ID \
    MU_KEY=MU_KEY \
    NODE_HOST=节点域名 \
  bash
```

### 配置文件

```shell
vim /root/trojanp/Poseidonfile

节点域名:443

# 可以通过 https://节点域名:443 来访问你的节点，可以看到的内容，
# 你可以设置为本地的一个静态网站，或者镜像某一个网站
# 使用本地静态网站
#root /var/www/html

# 默认镜像为一个 chrome 的小恐龙游戏站
# 如果 root 为开启，则此功能将失效
mirror https://colettecontreras.github.io/t-rex-runner/

# 使用 80 端口验证自动从 Let's Encrypt 获取证书，
# 80 端口必须未被占用
tls ssp@trojanp.xyz

# 或者你也可以使用之前生成好的证书
#tls server.crt server.key

sspanel https://你的面板域名 节点ID MU_KEY
```

### 启动

```shell
systemctl start trojanp
```

### 停止

```shell
systemctl stop trojanp
```

### 查看状态

```shell
systemctl status trojanp
```

### 查看日志

```shell
journalctl -x -n 300 --no-pager -u trojanp
```

### 更新后端

```shell
curl -L -s https://raw.githubusercontent.com/ColetteContreras/trojan-poseidon/master/sspanel-install-release.sh | bash
```

### 卸载

Configs and logs **are preserved**

```shell
curl -L -s https://bit.ly/2Jl9bs7 | bash
```
