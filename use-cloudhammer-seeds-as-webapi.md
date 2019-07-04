# 使用 CloudHammer Seeds 优化 webapi 的 CPU 占用

## 安装 Seeds & Docker

请在主站或 API 服务器上执行以下操作：

```bash
$ curl https://get.docker.com | bash && docker run -d -e DATABASE_HOST=数据库地址 -e DATABASE_PORT=数据库端口 -e  DATABASE_NAME=数据表名 -e DATABASE_USER=数据库用户名 -e DATABASE_PASS=数据库密码 -e VERIFYKEY=mukey -p 8080:8080/tcp --log-opt max-size=50m --log-opt max-file=3 cloudhammer/seeds
```

注意因 docker 在此配置下为 NAT 转换，数据库地址不可填写 localhost

## 配置 Nginx Proxy

?> 此项配置可选，如您想直接使用 seeds 自带的 web 服务器，请加入 PORT 环境变量自定义监听端口。

使用此配置可直接在主站或 API 服务器中将流量转发到 seeds 服务器

```nginx
location /mod_mu {
    proxy_pass http://localhost:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarder-For $remote_addr;
    proxy_set_header X-Real-IP $remote_addr;
}
```