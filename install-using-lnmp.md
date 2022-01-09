此教程适用于 `debian` / `ubuntu` 系统
# 环境准备
```
apt -y install jq git tar vim wget ca-certificates
```
# 安装 lnmp 环境
```
cd /root
wget http://soft.vpser.net/lnmp/lnmp1.8.tar.gz -cO lnmp1.8.tar.gz
tar zxf lnmp1.8.tar.gz
cd lnmp1.8
./install.sh lnmp
```
建议选项
- MariaDB 10.1.48 +
- Do you want to enable or disable the InnoDB Storage Engine > Y
- php 7.4.21
- You have 3 options for your Memory Allocator install, Enter your choice (1, 2 or 3) > 1

等待安装完成
# 配置 lnmp 环境
```
sed -i 's/,system//g' /usr/local/php/etc/php.ini
sed -i 's/,proc_open//g' /usr/local/php/etc/php.ini
sed -i 's/,proc_get_status//g' /usr/local/php/etc/php.ini
sed -i 's/^fastcgi_param PHP_ADMIN_VALUE/#fastcgi_param PHP_ADMIN_VALUE/g' /usr/local/nginx/conf/fastcgi.conf
lnmp restart
```
# 添加虚拟主机
- 记得先去域名注册商控制面板添加 `A` 记录指向服务器 ip
- 假设你的安装目录是 `/home/wwwroot/sspanel`
- 假设你的域名是 `demo.sspanel.org`
- 一定要开启 `SSL`

```
root@debian:~# lnmp vhost add
+-------------------------------------------+
|    Manager for LNMP, Written by Licess    |
+-------------------------------------------+
|              https://lnmp.org             |
+-------------------------------------------+
Please enter domain(example: www.lnmp.org): demo.sspanel.org
 Your domain: demo.sspanel.org
Enter more domain name(example: lnmp.org *.lnmp.org): 
Please enter the directory for the domain: demo.sspanel.org
Default directory: /home/wwwroot/demo.sspanel.org: /home/wwwroot/sspanel
Virtual Host Directory: /home/wwwroot/sspanel
Allow Rewrite rule? (y/n) n
You choose rewrite: none
Enable PHP Pathinfo? (y/n) n
Disable pathinfo.
Allow access log? (y/n) n
Disable access log.
Create database and MySQL user with same name (y/n) n
Add SSL Certificate (y/n) y
1: Use your own SSL Certificate and Key
2: Use Let's Encrypt to create SSL Certificate and Key
3: Use BuyPass to create SSL Certificate and Key
4: Use ZeroSSL to create SSL Certificate and Key
Enter 1, 2, 3 or 4: 2
It will be processed automatically.

Press any key to start create virtul host...
```
# 编辑 nginx 配置
进入目录 `/usr/local/nginx/conf/vhost` ，编辑配置文件

强制 `https` 。将第一段 `server` 替换为
```
server
    {
        listen 80;
        server_name demo.sspanel.org ;
        return 301 https://$server_name$request_uri;
    }
```
修改目录。将
```
root  /home/wwwroot/sspanel;
```
改为
```
root  /home/wwwroot/sspanel/public;
```
在
```
        access_log off;
```
前添加伪静态规则
```
        location /
        {
            try_files $uri /index.php$is_args$args;
        }
```
配置模板
```
server
    {
        listen 80;
        server_name demo.sspanel.org ;
        return 301 https://$server_name$request_uri;
    }

server
    {
        listen 443 ssl http2;
        #listen [::]:443 ssl http2;
        server_name demo.sspanel.org ;
        index index.html index.htm index.php default.html default.htm default.php;
        root  /home/wwwroot/sspanel/public;

        ssl_certificate /usr/local/nginx/conf/ssl/demo.sspanel.org/fullchain.cer;
        ssl_certificate_key /usr/local/nginx/conf/ssl/demo.sspanel.org/demo.sspanel.org.key;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers "TLS13-AES-256-GCM-SHA384:TLS13-CHACHA20-POLY1305-SHA256:TLS13-AES-128-GCM-SHA256:TLS13-AES-128-CCM-8-SHA256:TLS13-AES-128-CCM-SHA256:EECDH+CHACHA20:EECDH+CHACHA20-draft:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5";
        ssl_session_cache builtin:1000 shared:SSL:10m;
        # openssl dhparam -out /usr/local/nginx/conf/ssl/dhparam.pem 2048
        ssl_dhparam /usr/local/nginx/conf/ssl/dhparam.pem;

        include rewrite/none.conf;
        #error_page   404   /404.html;

        # Deny access to PHP files in specific directory
        #location ~ /(wp-content|uploads|wp-includes|images)/.*\.php$ { deny all; }

        include enable-php.conf;

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /.well-known {
            allow all;
        }

        location ~ /\.
        {
            deny all;
        }
        
        location /
        {
            try_files $uri /index.php$is_args$args;
        }

        access_log off;
    }
```
最后
```
lnmp nginx reload
```

# 安装面板
关闭防跨站
```
cd /home/wwwroot/sspanel
chattr -i .user.ini
rm .user.ini
```
拉取到本地
```
git clone https://github.com/Anankke/SSPanel-Uim.git .
cp config/.config.example.php config/.config.php
cp config/appprofile.example.php config/appprofile.php
wget https://getcomposer.org/installer -O composer.phar
php composer.phar
php composer.phar install
chmod 755 -R *
chown www -R *
```
# 配置数据库
登录到数据库
```
mysql -uroot -p
```
创建数据库
```
create database sspanel;
```
导入
```
use sspanel;
source /home/wwwroot/sspanel/sql/glzjin_all.sql;
```
登出。按下 `Ctrl` + `D`

# 配置面板

编辑

```
config/.config.php
```

配置数据库参数
- `db_host` 填 `localhost`
- `db_password` 改成你设置的数据库密码

```
//数据库设置--------------------------------------------------------------------------------------------
// db_host|db_socket 二选一，若设置 db_socket 则 db_host 会被忽略，不用请留空。若数据库在本机上推荐用 db_socket。
// db_host 例: localhost（可解析的主机名）, 127.0.0.1（IP 地址）, 10.0.0.2:4406（含端口)
// db_socket 例：/var/run/mysqld/mysqld.sock（需使用绝对地址）
$_ENV['db_driver']    = 'mysql';
$_ENV['db_host']      = '';
$_ENV['db_socket']    = '';
$_ENV['db_database']  = 'sspanel';           //数据库名
$_ENV['db_username']  = 'root';              //数据库用户名
$_ENV['db_password']  = 'sspanel';           //用户名对应的密码
#高级
$_ENV['db_charset']   = 'utf8mb4';
$_ENV['db_collation'] = 'utf8mb4_unicode_ci';
$_ENV['db_prefix']    = '';
```

还有这些重要参数，依照注释要求填写

```
$_ENV['key']        = '1145141919810';                //!!! 瞎 jb 修改此key为随机字符串确保网站安全 !!!
$_ENV['debug']      = false;                          //正式环境请确保为 false
$_ENV['appName']    = 'SSPanel-UIM';                  //站点名称
$_ENV['baseUrl']    = 'https://sspanel.host';         //站点地址
$_ENV['muKey']      = 'NimaQu';                       //用于校验魔改后端请求，可以随意修改，但请保持前后端一致，否则节点不能工作！
```

执行数据库迁移
```
vendor/bin/phinx migrate
```

创建管理员账户

```
php xcat User createAdmin
```

下载 ip 数据库

```
php xcat Tool initQQwry
```

# 配置必要定时任务

注意按需修改网站目录

```
crontab -l > crontab.list

echo "*/1 * * * * /usr/bin/php /home/wwwroot/sspanel/xcat Job SendMail
*/1 * * * * /usr/bin/php /home/wwwroot/sspanel/xcat Job CheckJob
0 */1 * * * /usr/bin/php /home/wwwroot/sspanel/xcat Job UserJob
30 23 * * * /usr/bin/php /home/wwwroot/sspanel/xcat sendDiaryMail
0 0 * * *   /usr/bin/php -n /home/wwwroot/sspanel/xcat Job DailyJob" >> crontab.list

crontab crontab.list
rm crontab.list
```

# 可选定时任务

财务报表
```
5 0 * * * /usr/bin/php /home/wwwroot/sspanel/xcat FinanceMail day 
6 0 * * 0 /usr/bin/php /home/wwwroot/sspanel/xcat FinanceMail week
7 0 1 * * /usr/bin/php /home/wwwroot/sspanel/xcat FinanceMail month
```

节点检测
```
*/1 * * * * /usr/bin/php /home/wwwroot/sspanel/xcat DetectGFW
```

数据备份
```
0 1 * * * /usr/bin/php -n /home/wwwroot/sspanel/xcat Backup simple
```
