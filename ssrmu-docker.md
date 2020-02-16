# SSPanel v3 mod 后端（Docker）对接

!> 本文转载自 https://vinga.tech/ssrmu/ ，已获得原作者授权。最新版文档请查看原文。Wiki 仅收录归档版本。
Docker 后端不属于官方支持，也无法获得上游更新，请自行处理相关问题。

### 更新记录

- 2018.07.27:修复了一个由sed导致的严重bug.目前已经修复.新镜像已经上传.为大家带来不便非常抱歉.已知bug会引发如下问题:
- - NODE_ID>100时错乱
  - MYSQL_PORT=33066时错乱
- 2018.07.23:修改了dockerfile中默认变量的值并且更新了新的镜像.新的默认变量在下表中已经提供.也可以在[我的 GitHub仓库](https://github.com/fanvinga/dockerfiles/blob/master/ssrmu/Dockerfile) 中查看
- 2018.02.26: 移除了db分支 ,更新了镜像:增加了单端口限速补丁以及增强了镜像健壮性.
- 2018.02.18:完全重构镜像.合并了latest和db分支.现在完全使用原版赵大魔改ssr后端的环境变量.具体设置看文章.注意!!!需要根据新版的环境变量进行修改!!不予向后兼容!!
- 2017.12.29:重构镜像.对镜像进行了优化提升了性能.通过增加启动参数--restart=always来提升稳定性.请自行在options中增加.
- 2017.12.18:压缩了镜像.
- 2017.11.21:增加glzjinmod的链接方式

### 环境变量

```
NODE_ID=0
SPEEDTEST=6  
CLOUDSAFE=0  
AUTOEXEC=0
ANTISSATTACK=0
MU_SUFFIX=zhaoj.in
MU_REGEX=%5m%id.%suffix
API_INTERFACE=modwebapi
WEBAPI_URL=https://zhaoj.in
WEBAPI_TOKEN=glzjin
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=ss
MYSQL_PASS=ss
MYSQL_DB=shadowsocks
REDIRECT=github.com
FAST_OPEN=fals
```

### 普通配置:

安装 docker

```bash
docker version > /dev/null || curl -fsSL get.docker.com | bash
service docker restart
```

**webapi** 方式对接:

```bash
docker run -d --name=ssrmu -e NODE_ID=节点ID -e API_INTERFACE=modwebapi -e WEBAPI_URL=需要对接的地址 -e WEBAPI_TOKEN=前端设置的token --network=host --log-opt max-size=50m --log-opt max-file=3 --restart=always fanvinga/docker-ssrmu
```

**数据库**方式对接：

```bash
docker run -d --name=ssrmu -e NODE_ID=节点ID -e API_INTERFACE=glzjinmod -e MYSQL_HOST=MYSQL地址 -e MYSQL_USER=mysql用户名 -e MYSQL_DB=数据库名 -e MYSQL_PASS=数据库密码 --network=host --log-opt max-size=50m --log-opt max-file=3 --restart=always fanvinga/docker-ssrmu
```

这样就对接完成了，如果对接不成功，可以查看 log 进行排错（见下方 docker 常见命令）



### 使用 HyperApp 进行配置(仅 IOS)

1. 转到商店页面.找到`Docker Image`然后选择服务器并且保存进入配置界面
2. 请完全按照下图配置进行填写！

| 应用设置名称 | 内容 |
| :---: | :--- |
| Image |fanvinga/docker-ssrmu|
| Options | -e 环境变量名称=你需要的值 -e 环境变量名称=你需要的值 --network=host --restart=always |
| Command | |
| Args | |

1. 保存并且进行安装.
2. 现在的ssrmu镜像完全复刻出`userapiconfig.py`和`user-config.json`文件里面的所有常见配置选项.只需要使用-e的映射方式.参考相关格式进行填写即可
3. 注意最后两个变量REDIRECT和FAST_OPEN是`user-config.json`里面的.如果不知道应该改成什么值.保持默认就行
4. 注意REDIRECT的可能形式为`*:80#127.0.0.1:2333`.直接填写 -e REDIRECT=`*:80#127.0.0.1:2333`即可

### docker 常用命令

```bash
docker container ls
#查看所有正在运行的 docker 
docker logs -f dockername
#查看选定 docker 的 log
docker rm -f dockername
#删除指定 docker
docker system df
#查看容器使用的磁盘空间
docker system prune -a
#对 docker 进行全面垃圾回收
```
