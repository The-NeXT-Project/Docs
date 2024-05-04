# UIM Repositories

## Supported OS

### RPM

- Fedora 38/39 (i.e. the two latest Fedora versions)
- RHEL/CentOS Stream/Rocky Linux/AlmaLinux 8/9

Note that Oracle Linux 8/9 can theoretically be installed and used with UIM RPM sources, but the actual compatibility is unknown as it has not been tested.

### DEB

- Debian/Ubuntu LTS

## Supported hardware architectures

- arm64 (aarch64)
- amd64 (x86_64)

Where packages for the amd64 architecture only support x86 v3 and newer x86 processors, i.e. with avx2 instruction set support (Intel: Haswell and newer, AMD: Excavator and newer).

## Source configuration

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

## List of provided software

- netstatus-api-go
- sing-box
- spoiler
- uim-server
- xrayr

The above is not a complete list of software, and some software may only be available in the RPM repositories, but we will be updating them over time to ensure synchronization with the RPM/DEB repositories.

## About software in the source

All software binaries will be installed in the `/usr/local` directory, and all configuration files will be installed in the `/etc` directory, along with the software's systemd service (if any).

Software binaries may not be built based on the source code of its Release version, but rather on the source code of its development branch, to ensure that any bugfixes and security updates are available in the source as soon as possible without relying on upstream release cycles.

The package version includes the git commit id of the source code corresponding to the binary (the gxxxxxx part of the version number).

The contents of the default configuration files included in the package may differ from those in the upstream repo.
