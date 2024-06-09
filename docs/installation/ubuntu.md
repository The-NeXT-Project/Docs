# Ubuntu

> Environment used for this tutorial: Ubuntu 22.04/x86_64

## Disabling UFW

First disable the ufw firewall

```bash
ufw disable
```

## Installing Nginx

For Nginx installation, we use the official Nginx DEB source.

Install the necessary software

```bash
apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring
```

Add the official Nginx PGP Key

```bash
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
```

Write the official Nginx source configuration to nginx.list

```bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
```

Set the official Nginx sources to have higher priority than the system built-in sources

```bash
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" | sudo tee /etc/apt/preferences.d/99nginx
```

Then update the APT cache

```bash
apt update
```

Install Nginx

```bash
apt install nginx
```

Finally, start the Nginx service and set it to boot up.

```bash
systemctl start nginx
systemctl enable nginx
```

## Installing PHP

Ubuntu 22.04 comes with an older version of PHP, so we'll install it using the PPA source at deb.sury.org

```bash
add-apt-repository ppa:ondrej/php
```

Similarly, update the APT cache

```bash
apt update
```

Then install the required PHP modules

```bash
apt install php8.3-{bcmath,bz2,cli,common,curl,fpm,gd,igbinary,mbstring,mysql,opcache,readline,redis,xml,yaml,zip}
```

Start the php-fpm service and set it to boot

```bash
systemctl start php8.3-fpm
systemctl enable php8.3-fpm
```

## Installing MariaDB

MariaDB comes with a comprehensive DEB repository, just like the Nginx repository, so we need to install the necessary packages and import the GPG key.

```bash
apt install apt-transport-https curl
mkdir -p /etc/apt/keyrings
curl -o /etc/apt/keyrings/mariadb-keyring.pgp 'https://mariadb.org/mariadb_release_signing_key.pgp'
```

Edit the `/etc/apt/sources.list.d/mariadb.sources` file and write the following configuration to it

```
X-Repolib-Name: MariaDB
Types: deb
# deb.mariadb.org is a dynamic mirror if your preferred mirror goes offline. See https://mariadb.org/mirrorbits/ for details.
URIs: https://deb.mariadb.org/11.2/ubuntu
Suites: jammy
Components: main main/debug
Signed-By: /etc/apt/keyrings/mariadb-keyring.pgp
```

Update the APT cache

```bash
apt update
```

Install MariaDB 11.2

```bash
apt install mariadb-server
```

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

Import the GPG Key

```bash
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
```

Write the official Redis source configuration to redis.list

```bash
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
```

Update the APT cache

```bash
apt update
```

Install redis-server

```bash
apt install redis
```

Start the redis-server service and set it to start at boot time

```bash
systemctl start redis-server
systemctl enable redis-server
```

## Deploying the NeXT Panel

The first thing to do is to change the user that Nginx is running under, the default is nginx, and you need to change it to www-data.

Change the `user` in the `/etc/nginx/nginx.conf` from

```nginx
user nginx;
```

to

```nginx
user www-data;
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
            fastcgi_pass unix:/run/php/php-fpm.sock;
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
apt install git
git clone -b dev https://github.com/SSPanel-NeXT/NeXT-Panel.git .
wget https://getcomposer.org/installer -O composer.phar
php composer.phar
php composer.phar install --no-dev
```

> The dev in this case represents the dev version of the NeXT-Panel, you may encounter unforeseen issues during use.

Then set the overall permissions for your web directory

```bash
chmod -R 755 *
chown -R www-data:www-data *
```

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
sudo -u www-data /usr/bin/php xcat ClientDownload
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
sed -i 's@^disable_functions.*@disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,ini_alter,ini_restore,dl,readlink,symlink,popepassthru,stream_socket_server,fsocket,popen@' /etc/php/8.3/fpm/php.ini
sed -i 's@^disable_functions.*@disable_functions = passthru,exec,system,chroot,chgrp,chown,shell_exec,proc_open,proc_get_status,ini_alter,ini_restore,dl,readlink,symlink,popepassthru,stream_socket_server,fsocket,popen@' /etc/php/8.3/cli/php.ini
```

You need to restart the PHP-FPM service after modifying it.

```bash
systemctl restart php8.3-fpm
```

Enable OPcache and JIT

In `/etc/php/8.3/fpm/conf.d/10-opcache.ini` add the following configuration

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
systemctl restart php8.3-fpm
```
