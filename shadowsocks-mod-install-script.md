# shadowsocks-mod 一键安装脚本

这里提供了 SSPanel-UIM 官方配套后端的一键安装脚本使用说明。

?> 本文以 CentOS 7，CentOS Stream 8 和 CentOS Stream 9 为例。

### 脚本功能

* 可选配置节点为WebAPI模式
* 可选配置单端口多用户
* 可选注册为系统服务

### 安装

**CentOS 7**

```bash
yum install wget -y && wget https://raw.githubusercontent.com/M1Screw/Airport-toolkit/master/ssr_node_c7.sh && chmod +x ssr_node_c7.sh && ./ssr_node_c7.sh
```

**CentOS Stream 8**

```bash
dnf install wget -y && wget https://raw.githubusercontent.com/M1Screw/Airport-toolkit/master/ssr_node_c8.sh && chmod +x ssr_node_c8.sh && ./ssr_node_c8.sh
```

**CentOS Stream 9 （WiP）**
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

### 注意事项

* 由于后端最新版本不再支持Python2，在CentOS 7环境中安装时会额外安装Python3.6
* 所有跟节点安装本身无关的功能会通过单独的脚本提供（例如BBRv1配置在 [Airport-toolkit](https://github.com/M1Screw/Airport-toolkit) 中有 bbr_c7/bbr_c8.sh 可用）
