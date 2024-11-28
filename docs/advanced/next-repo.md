# NeXT Repository for Linux

## Supported OS

### RPM

- Fedora 40/41 (i.e. the two latest Fedora versions)
- RHEL/Rocky Linux/AlmaLinux 8/9

Note that Oracle Linux 8/9 can theoretically be supported, but the actual compatibility is unknown as it has not been tested.

### DEB

- Debian/Ubuntu LTS

## Supported hardware architectures

- arm64 (aarch64)
- amd64 (x86_64)
- riscv64 (DEB mirror only)

Packages for amd64 architecture only support x86 v3 and newer x86 processors, i.e. with avx2 instruction set support (Intel: Haswell and newer, AMD: Excavator and newer).

## Install the repository

### RHEL/Rocky Linux/AlmaLinux

```bash
wget -O /etc/yum.repos.d/next.repo https://mirrors.nextpanel.dev/repo/rhel.repo
dnf update
```

### Fedora

```bash
wget -O /etc/yum.repos.d/next.repo https://mirrors.nextpanel.dev/repo/fedora.repo
dnf update
```

### DEB

```bash
wget -O /etc/apt/sources.list.d/next.list https://mirrors.nextpanel.dev/repo/deb.list
apt update
```

## List of software currently provided

- netstatus-api-go
- next-server
- sing-box
- spoiler
- v2ray-core
- clash-meta(mihomo)

## About software in the source

All software binaries will be installed in the `/usr/local/{package_name}` directory, and all configuration files will be installed in the `/etc/{package_name}` directory, along with the software's systemd service (if any).

Software binaries may not be built based on the source code of its Release version, but rather on the source code of its development branch, this is to ensure that any bugfixes and security updates are available in the source as soon as possible without relying on upstream release cycles.

The package version includes the git commit id of the source code corresponding to the binary (the gxxxxxx part of the version number).

The contents of the default configuration files included in the package may differ from those in the upstream repo.
