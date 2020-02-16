# 后端一键安装脚本

这里提供了两个后端一键安装脚本使用说明。

## 后端一键安装脚本（大猫猫版）

?> 本文以 CentOS 7 和 CentOS 8 为例。

### 脚本功能

* 可选配置节点为WebAPI模式或MySQL模式
* 可选配置单端口多用户
* 可选启用BBR（CentOS 7 使用Mainline版本kernel，CentOS 8使用系统自带kernel）
* 可选注册为系统服务
* 可选安装saltstack客户端

### 安装

**CentOS 7**

```bash
yum install wget -y && wget https://raw.githubusercontent.com/SuicidalCat/Airport-toolkit/master/ssr_node_c7.sh && chmod +x ssr_node_c7.sh && ./ssr_node_c7.sh
```

**CentOS 8**

```bash
dnf install wget -y && wget https://raw.githubusercontent.com/SuicidalCat/Airport-toolkit/master/ssr_node_c8.sh && chmod +x ssr_node_c8.sh && ./ssr_node_c8.sh
```

### 卸载

```bash
systemctl disable ssr_node && \rm /usr/lib/systemd/system/ssr_node.service && \rm -rf /soft/shadowsocks
```

### 服务启动

```bash
systemctl start ssr_node
```

### 服务停止

```bash
systemctl stop ssr_node
```
