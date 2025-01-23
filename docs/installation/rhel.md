# RHEL

> Environment used for this tutorial: Red Hat Enterprise Linux 9.4/x86_64

## Enable CRB, EPEL and Remi repository

```bash
subscription-manager repos --enable codeready-builder-for-rhel-9-$(arch)-rpms
dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
dnf install https://rpms.remirepo.net/enterprise/remi-release-9.rpm
```

## Disabling firewalld

First disable the firewalld

```bash
systemctl stop firewalld
```

## Installing Nginx

For Nginx installation, we use the official Nginx YUM/DNF source.

1.Add the Nginx repository to your system’s repository list. You can do this by creating a new repo file in /etc/yum.repos.d/ named nginx.repo and adding the following configuration:

```
[nginx-stable]
name=nginx stable repo
baseurl=https://nginx.org/packages/rhel/9/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
```

Remember to replace $basearch with your specific cpu architecture(x86_64/aarch64/s390x), respectively1. This will set up Nginx from the official Nginx repository, which is recommended to get the latest stable version.

2.Update your local package index:

```bash
dnf check-update
```

3.Install Nginx

```bash
dnf install nginx
```

4.Verify the installation by checking the version of Nginx installed:

```bash
nginx -v
```

5.Finally, start the Nginx service and set it to boot up.

```bash
systemctl start nginx
systemctl enable nginx
```

## Installing PHP

> Note to avoid Redis related issues, you need to make sure phpredis extension is correctly installed and version >= 6.0.2

Red Hat Enterprise Linux 9.4 comes with PHP version of 8.0, now we change it to remi repo php-8.4

```bash
dnf module switch-to php:remi-8.4
```

Similarly, update the DNF cache

```bash
dnf check-update
```

Then install the required PHP modules

```bash
dnf install php-{bcmath,bz2,cli,common,curl,fpm,gd,igbinary,mbstring,mysqlnd,opcache,readline,redis,xml,yaml,zip,posix,sodium}
```

Start the php-fpm service and set it to boot

```bash
systemctl start php-fpm
systemctl enable php-fpm
```

Now edit php-fpm user in file `/etc/php-fpm.d/www.conf`

```conf
user = apache
group = apache
```

to

```conf
user = nginx
group = nginx
```

And modify the `/etc/php-fpm.d/www.conf`, uncomment all permission lines, change user and group to nginx:

```
listen.owner = nginx
listen.group = nginx
listen.mode = 0660
listen.acl_users = nginx
```

* PS. You can change the nginx user to www-data by yourself, but make sure you set all the permissions correctly, we use nginx here because the nginx package already created the account for us.

## Installing MariaDB

Red Hat Enterprise Linux 9.4 only comes with MariaDB 10 so we install MariaDB 11.4 from official DNF/YUM repository.

Here is a custom MariaDB DNF/YUM repository entry for RedHatEnterpriseLinux. Copy and paste it into a file under /etc/yum.repos.d (we suggest naming the file MariaDB.repo or something similar).

```
[mariadb]
name = MariaDB
baseurl = https://rpm.mariadb.org/11.4/rhel/$releasever/$basearch
gpgkey = https://rpm.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck = 1
```

EPEL repository may be required to satisfy the pv dependency of galera.

After the file is in place, install and start MariaDB with:

```bash
dnf install MariaDB-server MariaDB-client
```

If you haven't already accepted the MariaDB GPG key, you will be prompted to do so during the install.

Start the MariaDB service and set it to boot

```bash
systemctl start mariadb
systemctl enable mariadb
```

Run the initial setup of MariaDB

```bash
mariadb-secure-installation
```

## Installing Redis

NeXT-Panel relies on Redis for many of its functions, so you need to install redis-server.

change version from redis 6 to redis 7

```bash
dnf module enable redis:7
```

Install redis-server

```bash
dnf install redis
```

Start the redis-server service and set it to start at boot time

```bash
systemctl start redis
systemctl enable redis
```

## Deploying the NeXT Panel

The first thing to do is to change the user that Nginx is running under, the default is nginx, and you need to change it to www-data.

make sure the `user` in the `/etc/nginx/nginx.conf` is `nginx`

```nginx
user nginx;
```

Add the Nginx vhost file

```bash
nano /etc/nginx/conf.d/website-domain-you-set.conf
```

Then write the following configuration, taking care to change the path to the website files and the website domain name

```nginx
server {  
        listen 80;
        listen [::]:80;

        root /path/to/your/site/public; # your site file path + /public
        index index.php;
        server_name example.com # The domain name of the site you're setting up.

        location / {
            try_files $uri /index.php$is_args$args;
        }

        location ~ \.php$ {
            try_files $fastcgi_script_name =404;
            include fastcgi_params;
            fastcgi_index index.php;
            fastcgi_buffers 8 16k;
            fastcgi_buffer_size 32k;
            fastcgi_pass unix:/run/php-fpm/www.sock;
            fastcgi_param DOCUMENT_ROOT $realpath_root;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        }
}
```

Restart Nginx

```bash
systemctl restart nginx
```

Once the web hosting setup is complete, go to the root folder of the website you setup and execute the following command:

```bash
wget https://github.com/SSPanel-NeXT/NeXT-Panel/releases/download/24.5.1/NeXT-Panel-24.5.1.zip
unzip NeXT-Panel-24.5.1.zip .
```

> The `NeXT-Panel-24.5.1.zip` in this case represents the latest released version of the NeXT-Panel, you should replace the version number with the latest one in the [Release](https://github.com/SSPanel-NeXT/NeXT-Panel/releases) page.

Then set the overall permissions for your web directory

```bash
chmod -R 755 *
chown -R nginx:nginx *
```

* PS. change the user and group to www-data:www-data if you using www-data account

Then we start the database part of the creation operation by first logging into MariaDB Server

```bash
mariadb -u root -p
```

 Enter the password you just set during installation and create a database with the encoding `utf8mb4_unicode_ci` and any name you want, using sspanel as an example.

```sql
MariaDB [(none)]> CREATE DATABASE sspanel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then create a local database user and restrict the user's privileges to the newly created database, using sspanel as the user name and sspanel-password as the user's password.

```sql
MariaDB [(none)]> CREATE USER 'sspanel'@'localhost';
MariaDB [(none)]> GRANT ALL PRIVILEGES ON sspanel.* TO 'sspanel'@'localhost' IDENTIFIED BY 'sspanel-password';
MariaDB [(none)]> FLUSH PRIVILEGES;
```

Next, edit the site configuration file to include the database connection information you just set up, and then read the rest of the configuration instructions to customize the site.

```bash
cp config/.config.example.php config/.config.php
cp config/appprofile.example.php config/appprofile.php
nano config/.config.php
```

Next, perform the following site initialization setup

```bash
php xcat Migration new
php xcat Tool importSetting
php xcat Tool createAdmin
sudo -u nginx /usr/bin/php xcat ClientDownload
```

NeXT-Panel relies on the Maxmind GeoLite2 database to provide IP geolocation information, first you need to configure the `maxmind_account_id` and `maxmind_license_key` options in `config/.config.php` and then execute the following command:

```bash
php xcat Tool updateGeoIP2
```

Use `crontab -e` command to configure cron job for the panel：

```bash
*/5 * * * * /usr/bin/php /path/to/your/site/xcat Cron
```

## Improving System Security and Performance

Disable some dangerous PHP Functions

```bash
sed -i 's@^disable_functions.*@disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,ini_alter,ini_restore,dl,readlink,symlink,popepassthru,stream_socket_server,fsocket,popen@' /etc/php.ini
```

You need to restart the PHP-FPM service after modifying it.

```bash
systemctl restart php-fpm
```

Enable OPcache and JIT

In `/etc/php.d/10-opcache.ini` add the following configuration

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

You also need to restart the PHP-FPM service after modifying it.

```bash
systemctl restart php-fpm
```
