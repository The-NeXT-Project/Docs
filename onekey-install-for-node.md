# 后端一键安装脚本

?> 本文以 CentOS 7 和 Ubuntu 18.04 为例。

## 脚本功能

* 可选配置节点为WebAPI模式或MySQL模式
* 可选配置单端口多用户
* 可选启用BBR（using mainline kernel）
* 可选注册为系统服务

## 安装

**CentOS 7 x64**

```bash
yum install wget -y && wget https://raw.githubusercontent.com/SuicidalCat/Airport-toolkit/master/ssr_node_c7.sh && chmod +x ssr_node_c7.sh && ./ssr_node_c7.sh
```

**Ubuntu 18.04 x64**

```bash
apt-get install wget -y && wget https://raw.githubusercontent.com/SuicidalCat/Airport-toolkit/master/ssr_node_u18.sh && chmod +x ssr_node_u18.sh && ./ssr_node_u18.sh
```

## 卸载

```bash
systemctl disable ssr_node && \rm /usr/lib/systemd/system/ssr_node.service && \rm -rf /soft/shadowsocks
```

## 设置开机启动

```bash
systemctl enable ssr_node
```

## 服务启动

```bash
systemctl start ssr_node
```

### 服务停止

```bash
systemctl stop ssr_node
```
