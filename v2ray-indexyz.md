# v2ray indexyz 版使用教程

## 站点设定

首先在后台创建节点

> 节点的节点地址为 域名;端口;AlterId;网络层协议(默认 tcp);附加协议;额外参数

在默认情况下 端口为 443 AlterId 为 2. 其中, 在 网络层协议 之后的内容可以省略

以下是一个配置实例：

## 额外参数的格式

额外参数使用 `key=value|another=value` 这种格式来书写

额外参数中的内容将会 merge 进入导入链接的 json 当中, 也有额外的参数, 通常使用于自动修改后端

| Key | 样例 | 效果 |
| --- | --- | --- |
| dns | 1.1.1.1,8.8.8.8 | 后端的 dns 被设置为 指定值 |


## 使用 v2ray 的伪装方式以及设定方式

| 使用方式协议 | 网络层协议 | 附加协议 | 是否支持自动设定后端 | 设定方式 | 
| --- |-------------| ---| -----| --- |
| TCP | tcp / 无 | 无 | ✅ | N/A |
| KCP | kcp | 无 | ✅ | N/A |
| KCP | kcp | wechat-video 等 | ✅ | N/A |
| TLS | tls | 无 | ❌ | 将自己的证书部署至服务器之后自行修改 config.json |
| Websocket | ws | 无 | ✅ | N/A, 可以在 extraArgs 增加 PATH 设定 |
| TLS + Websocket | tls | ws | ❌ | 参考 tls 和 websocket 的配置方法进行配置 |

---

以下是一个配置格式的样例

```
xxxxx.com;10550;16;ws;;path=/v2ray|host=oxxxx.com
```

---

> 单端口多用户请选择 只启用普通端口，并将节点类型选为 `V2Ray`

> 使用 [WHMCS](https://whmcs.indexyz.me/aff.php?aff=1) 购买后端

## 部署

登陆要部署的服务器 假设后端文件名为 `bin`

并执行以下命令就可以启动服务器

```bash
chmod +x bin
nano agent.yaml
./bin
```

## Agent 设定

编辑 `agent.yaml` (如果没有就新建一个)。文件内容为

```yaml
mod:
  nodeId: 节点ID
  key: 通信密钥   # 仅在 web API 接入时启用

database: # 仅在数据库接入时启用
  user: 数据库用户名
  pass: 数据库密码
```

V2Ray 可用的选项为

```yaml
v2ray:
  alterId: 用户的 alterId
  tag: 传入协议的 Tag (默认为 proxy)
```

## 使用 Docker 运行

您可以使用以下 Dockerfile 来构建您的 Docker Image

```dockerfile
FROM golang:alpine
LABEL maintainer="Indexyz <docker@indexyz.me>"

COPY agent /v2ray/
RUN chmod +x /v2ray/agent && apk --no-cache add curl

ENTRYPOINT ["/agent"]
```

将获取到的后端命名为 `agent` 放在这个文件夹, 使用 `docker build -t v2ray-agent .` 来构建您的 Image。构建完成后，使用 `docker run -p 443:443 -d --name v2ray v2ray-agent` 来运行

> 为 Docker 运行的方式作了专门的配置项支持, 如果有一个为 mod.nodeId 的配置项, 会自动从 MOD_NODEID 这个环境变量读取值