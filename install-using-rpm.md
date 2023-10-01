?> 教程使用的环境：CentOS Stream 9/x86_64 架构

## 禁用 SELinux

首先要禁用 SELinux，修改 `/etc/selinux/config`，将

```bash
SELINUX=enforcing
```

替换为

```bash
SELINUX=disabled
```

然后禁用当前系统中生效的 SELinux

```bash
setenforce 0
```

## 安装 Nginx

Nginx 的安装我们使用 Nginx 官方 RPM 源

编辑 `/etc/yum.repos.d/nginx.repo` 文件，将以下配置写入其中

```
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/rhel/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
```

然后更新一下 dnf 缓存

```bash
dnf clean all
dnf update
```

安装 Nginx

```bash
dnf install nginx
```

最后把 Nginx 服务启动并设置开机启动

```bash
systemctl start nginx
systemctl enable nginx
```

## 安装 PHP

CentOS Stream 9 自带了 PHP 8.1 的RPM包，在使用之前先在 dnf 包管理器中启用相关模块

```bash
dnf module enable php:8.1
```

然后安装所需的 PHP 模组

```bash
dnf install php-fpm php-cli php-mysqlnd php-curl php-gd php-mbstring php-xml php-opcache php-zip php php-json php-bz2 php-bcmath
```

启动 php-fpm 服务并设置开机启动

```bash
systemctl start php-fpm
systemctl enable php-fpm
```

最后还要修改一下 PHP 的运行用户，编辑 `/etc/php-fpm.d/www.conf` 文件，将默认的

```bash
user = apache
group = apache
```

修改为

```bash
user = nginx
group = nginx
```

修改完成后重启 php-fpm

```bash
systemctl restart php-fpm
```

## 安装 MariaDB

MariaDB 官方提供了一个完善的 RPM 源，我们使用它

编辑 `/etc/yum.repos.d/mariadb.repo` 文件，将以下配置写入其中

```
[MariaDB]
name=MariaDB
baseurl=http://yum.mariadb.org/10.11/rhel9-amd64/
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
```

更新一下 dnf 缓存

```bash
dnf update
```

禁用 RHEL 自带的 MySQL 以及 MariaDB 源

```bash
dnf module disable mysql mariadb
```

安装 MariaDB 10.11

```bash
dnf install mariadb-server
```

启动 MariaDB 服务并设置开机启动

```bash
systemctl start mariadb
systemctl enable mariadb
```

运行一下 MariaDB 的初始设置

```bash
mariadb-secure-installation
```

## 部署 SSPanel UIM

新增 Nginx vhost 文件

```bash
vi /etc/nginx/conf.d/你设置的网站域名.conf
```

然后写入如下的配置内容，注意修改网站文件路径和网站域名

```nginx
server {  
        listen 80;
        listen [::]:80;

        root /path/to/your/site/public; #你的站点文件路径 + /public
        index index.php index.html;
        server_name 你设置的网站域名;

        location / {
            try_files $uri /index.php$is_args$args;
        }

        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_pass php-fpm;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_param PATH_INFO $fastcgi_path_info;
        }
}
```

重载一下 Nginx

```bash
systemctl reload nginx
```

虚拟主机设置完成后，前往你所设置的网站根目录文件夹，执行以下命令：

```bash
dnf install git -y
git clone -b 2023.5 https://github.com/Anankke/SSPanel-Uim.git .
wget https://getcomposer.org/installer -O composer.phar
php composer.phar
php composer.phar install --no-dev
```

?> 这里的 2023.5 代表的是 SSPanel UIM 的版本，你可以在 [Release](https://github.com/Anankke/SSPanel-Uim/releases) 页面中查看当前的最新稳定版本或者是输入 dev 使用开发版。请注意，dev 分支可能在使用过程中出现不可预知的问题。

然后设置网站目录的整体权限

```bash
chmod -R 755 /path/to/your/site
chown -R nginx:nginx /path/to/your/site
```

然后我们开始数据库部分的创建操作，首先登录到 MariaDB Server

```bash
mysql -u root -p
```

 输入使用你刚刚在安装时设置的密码，然后创建一个编码为 `utf8mb4_unicode_ci` 的数据库，数据库名称可以任选，这里使用 sspanel 作为示例

```sql
MariaDB [(none)]> CREATE DATABASE sspanel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

然后创建一个本地数据库用户，并限制该用户的权限至只能操作新创建的这个数据库，这里使用 sspanel 作为用户名，使用 sspanel-password 作为这个用户的密码

```sql
MariaDB [(none)]> CREATE USER 'sspanel'@'localhost';
MariaDB [(none)]> GRANT ALL PRIVILEGES ON sspanel.* TO 'sspanel'@'localhost' IDENTIFIED BY 'sspanel-password';
MariaDB [(none)]> FLUSH PRIVILEGES;
```

接下来编辑网站配置文件，将刚才设置的数据库连接信息填入其中，然后阅读其他配置的说明进行站点客制化。

```bash
cp config/.config.example.php config/.config.php
cp config/appprofile.example.php config/appprofile.php
vi config/.config.php
```

?> 按 i 键进入编辑模式，使用 :x 保存并退出 vi，使用 :q! 放弃任何改动并退出 vi。

接下来执行如下站点初始化设置

```bash
php xcat Migration new
php xcat Tool importAllSettings
php xcat Tool createAdmin
php xcat ClientDownload
```

SSPanel-UIM 依赖 Maxmind GeoLite2 数据库来提供 IP 地理位置信息，首先你需要配置 `config/.config.php` 中的 `maxmind_license_key` 选项，然后执行如下命令：

```bash
php xcat Update
```

使用 `crontab -e` 指令设置 SSPanel 的基本 cron 任务：

```bash
*/5 * * * * /usr/bin/php /path/to/your/site/xcat Cron
```
