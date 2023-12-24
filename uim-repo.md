## 支持的 OS

### RPM

- Fedora 38/39（即最新的两个 Fedora 版本）
- RHEL/CentOS Stream/Rocky Linux/AlmaLinux 8/9

需要注意的是 Oracle Linux 8/9 理论上也是可以安装并使用 UIM RPM 源，但由于尚未进行测试因此实际的兼容性是处于未知的状态。

### DEB

- Debian/Ubuntu LTS

## 支持的硬件架构

- arm64（aarch64）
- amd64（x86_64）

其中 amd64 架构的软件包只支持 x86 v3 及更新的 x86 处理器，即具有 avx2 指令集支持（Intel: Haswell and newer, AMD: Excavator and newer）。

## 软件源配置

### RHEL/CentOS Stream/Rocky Linux/AlmaLinux

```bash
wget -O /etc/yum.repos.d/sspanel.repo https://mirror.sspanel.org/repo/rhel.repo
dnf update
```

### Fedora

```bash
wget -O /etc/yum.repos.d/sspanel.repo https://mirror.sspanel.org/repo/fedora.repo
dnf update
```

### DEB

```bash
wget -O /etc/apt/sources.list.d/sspanel.list https://mirror.sspanel.org/repo/sspanel.list
apt update
```

## 提供的软件列表

- netstatus-api-go
- sing-box
- uim-server
- xrayr

以上并非完整的软件列表，且部分软件可能仅在 RPM 源中提供，我们会逐步更新确保 RPM/DEB 源的软件同步。

## 关于源中的软件

所有软件的二进制文件将会被安装于 `/usr/local` 目录，所有配置文件将会被安装于 `/etc` 目录，且会安装软件所对应的 systemd 服务（如有）。

软件的二进制文件可能不会基于其 Release 版本的源代码，而是基于其开发分支的源代码构建，这样做的目的是确保任何 Bugfix 与安全性更新能够在最快的时间提供于软件源中而不依赖上游的 Release 周期。

软件包版本中包含了二进制文件对应源代码的 git commit id（即版本号中的 gxxxxxx 部分）。

软件包中所含的默认配置文件内容可能与上游 Repo 中的有所不同。
