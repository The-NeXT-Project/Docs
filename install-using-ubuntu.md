?> 教程使用的环境：Ubuntu 22.04/x86_64 架构

## 禁用 UFW

首先要禁用 ufw 防火墙

```bash
ufw disable
```

## 安装 Nginx

Nginx 的安装我们使用 Nginx 官方 DEB 源

安装必要的软件

```bash
apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring
```

添加 Nginx 官方 PGP Key

```bash
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
```

写入 Nginx 官方源配置至 nginx.list

```bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
```

设置 Nginx 官方源的优先级高于系统内置源

```bash
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" | sudo tee /etc/apt/preferences.d/99nginx
```

然后更新一下 APT 缓存

```bash
apt update
```

安装 Nginx

```bash
apt install nginx
```

最后把 Nginx 服务启动并设置开机启动

```bash
systemctl start nginx
systemctl enable nginx
```

## 安装 PHP

Ubuntu 22.04 自带的 PHP 版本较为老旧，因此我们使用 deb.sury.org 的 PPA 源进行安装

```bash
add-apt-repository ppa:ondrej/php
```

同样地，更新一下 APT 缓存

```bash
apt update
```

然后安装所需的 PHP 模组

```bash
apt install php8.3-{bcmath,bz2,cli,common,curl,fpm,gd,igbinary,mbstring,mysql,opcache,readline,redis,xml,yaml,zip}
```

启动 php-fpm 服务并设置开机启动

```bash
systemctl start php8.3-fpm
systemctl enable php8.3-fpm
```

## 安装 MariaDB

MariaDB 官方提供了一个完善的 DEB 源，跟 Nginx 源一样，我们需要安装必要的软件包和导入 GPG Key

```bash
apt install apt-transport-https curl
mkdir -p /etc/apt/keyrings
curl -o /etc/apt/keyrings/mariadb-keyring.pgp 'https://mariadb.org/mariadb_release_signing_key.pgp'
```

编辑 `/etc/apt/sources.list.d/mariadb.sources` 文件，将以下配置写入其中

```
X-Repolib-Name: MariaDB
Types: deb
# deb.mariadb.org is a dynamic mirror if your preferred mirror goes offline. See https://mariadb.org/mirrorbits/ for details.
URIs: https://deb.mariadb.org/11.2/ubuntu
Suites: jammy
Components: main main/debug
Signed-By: /etc/apt/keyrings/mariadb-keyring.pgp
```

更新一下 APT 缓存

```bash
apt update
```

安装 MariaDB 11.2

```bash
apt install mariadb-server
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

## 安装 Redis

SSPanel-UIM 的许多功能依赖 Redis，因此需要安装 redis-server

导入 GPG Key

```bash
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
```

写入 Redis 官方源配置至 redis.list

```bash
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
```

更新一下 APT 缓存

```bash
apt update
```

安装 redis-server

```bash
apt install redis
```

启动 redis-server 服务并设置开机启动

```bash
systemctl start redis-server
systemctl enable redis-server
```

## 部署 SSPanel UIM

首先是修改一下 Nginx 的运行用户，默认为 nginx，需要修改为 www-data

将 `/etc/nginx/nginx.conf` 中的

```
user nginx;
```

修改为

```
user www-data;
```

新增 Nginx vhost 文件

```bash
nano /etc/nginx/conf.d/你设置的网站域名.conf
```

然后写入如下的配置内容，注意修改网站文件路径和网站域名

```nginx
server {  
        listen 80;
        listen [::]:80;

        root /path/to/your/site/public; #你的站点文件路径 + /public
        index index.php;
        server_name 你设置的网站域名;

        location / {
            try_files $uri /index.php$is_args$args;
        }

        location ~ \.php$ {
            try_files $fastcgi_script_name =404;
            include fastcgi_params;
            fastcgi_index index.php;
            fastcgi_buffers 8 16k;
            fastcgi_buffer_size 32k;
            fastcgi_pass unix:/run/php/php-fpm.sock;
            fastcgi_param DOCUMENT_ROOT $realpath_root;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        }
}
```

重新启动一下 Nginx

```bash
systemctl restart nginx
```

虚拟主机设置完成后，前往你所设置的网站根目录文件夹，执行以下命令：

```bash
apt install git
git clone -b 2023.6 https://github.com/Anankke/SSPanel-Uim.git .
wget https://getcomposer.org/installer -O composer.phar
php composer.phar
php composer.phar install --no-dev
```

?> 这里的 2023.6 代表的是 SSPanel UIM 的版本，你可以在 [Release](https://github.com/Anankke/SSPanel-Uim/releases) 页面中查看当前的最新稳定版本或者是输入 dev 使用开发版。请注意，dev 分支可能在使用过程中出现不可预知的问题。

然后设置网站目录的整体权限

```bash
chmod -R 755 *
chown -R www-data:www-data *
```

然后我们开始数据库部分的创建操作，首先登录到 MariaDB Server

```bash
mariadb -u root -p
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
nano config/.config.php
```

?> 按 i 键进入编辑模式，使用 :x 保存并退出 vi，使用 :q! 放弃任何改动并退出 vi。

接下来执行如下站点初始化设置

```bash
php xcat Migration new
php xcat Tool importSetting
php xcat Tool createAdmin
sudo -u www-data /usr/bin/php xcat ClientDownload
```

SSPanel-UIM 依赖 Maxmind GeoLite2 数据库来提供 IP 地理位置信息，首先你需要配置 `config/.config.php` 中的 `maxmind_license_key` 选项，然后执行如下命令：

```bash
php xcat Update
```

使用 `crontab -e` 指令设置 SSPanel 的基本 cron 任务：

```bash
*/5 * * * * /usr/bin/php /path/to/your/site/xcat Cron
```

## 提高系统安全性与性能

禁用一些危险的 PHP Function

```bash
sed -i 's@^disable_functions.*@disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,ini_alter,ini_restore,dl,readlink,symlink,popepassthru,stream_socket_server,fsocket,popen@' /etc/php/8.3/fpm/php.ini
sed -i 's@^disable_functions.*@disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,ini_alter,ini_restore,dl,readlink,symlink,popepassthru,stream_socket_server,fsocket,popen@' /etc/php/8.3/cli/php.ini
```

修改后需要重启一下 PHP-FPM 服务

```bash
systemctl restart php8.3-fpm
```

启用 OPcache 与 JIT

在 `/etc/php/8.3/fpm/conf.d/10-opcache.ini` 中添加如下配置

```
zend_extension=opcache.so
opcache.file_cache=/tmp
opcache.interned_strings_buffer=64
opcache.jit=on
opcache.jit_buffer_size=256M
opcache.max_accelerated_files=65535
opcache.memory_consumption=512
opcache.revalidate_freq=60
opcache.validate_permission=on
opcache.validate_root=on
```

修改后同样需要重启一下 PHP-FPM 服务

```bash
systemctl restart php8.3-fpm
```
