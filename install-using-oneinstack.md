# 使用 OneinStack 部署 SSPanel UIM

?> 教程使用的环境：CentOS 8/x86_64 架构

## 安装 OneinStack

OneinStack 官方网站：https://oneinstack.com/ 。使用 https://oneinstack.com/auto/ 指定一个客制化的安装方案，以下为推荐使用的软件及其版本：

- Nginx
- PHP 7.4 with OPcache
- MariaDB 10.6
- phpMyAdmin

## 部署 SSPanel UIM

安装完毕之后，在安装指令执行的目录下应存在一个 `oneinstack` 目录，前往该目录创建新站点：

```bash
cd oneinstack
./vhost.sh
```

在加密选择的部分，如果是裸站使用 `Let's Encrypt` 证书，如网站需要加设 CDN 例如 Cloudfalre 则使用自签证书即可。

编辑 php.ini，删除 disable_functions 中的 proc_open, proc_get_status
```bash
vi /usr/local/php/etc/php.ini
```

重启php服务：
```bash
service php-fpm restart
```

虚拟主机设置完成后，前往你所设置的网站根目录文件夹，执行以下命令：

```bash
yum install git -y
git clone -b dev https://github.com/Anankke/SSPanel-Uim.git .
git config core.filemode false
wget https://getcomposer.org/installer -O composer.phar
php composer.phar
php composer.phar install
```

修改 Nginx vhost 配置文件

```bash
vi /usr/local/nginx/conf/vhost/你设置的网站域名.conf
service nginx restart
```

在对应的 vhost 的配置文件中添加如下伪静态规则，并将网站目录（即 `root` 配置项）后添加 `/public`

```
location / {
    try_files $uri /index.php$is_args$args;
}
```

然后设置网站目录的整体权限

```bash
chmod -R 755 /path/to/your/site
chown -R www:www /path/to/your/site
```

完成后我们就可以创建数据库了，这步强烈建议使用非root用户并且限制该用户仅可访问网站数据库。

创建一个编码为 `utf8mb4_unicode_ci` 的数据库，然后将 `sql` 目录下的 `glzjin_all.sql` 导入至该数据库。

?> 通过 http://IP/phpMyAdmin 可以登录数据库，进行可视化的数据库操作。请务必在完成所有必要的数据库操作后删除或者改名位于 `/data/wwwroot/dafault` 下的 `phpMyAdmin` 目录以避免潜在的安全威胁。

接下来编辑网站配置文件，将刚才设置的数据库连接信息填入其中，然后阅读其他配置的说明进行站点客制化。

```bash
cp config/.config.example.php config/.config.php
cp config/appprofile.example.php config/appprofile.php
vi config/.config.php
```

?> 按 i 键进入编辑模式，使用 :x 保存并退出 vi，使用 :q! 放弃任何改动并退出 vi。

接下来执行如下站点初始化设置

```bash
php xcat User createAdmin
php xcat Tool initQQWry
php xcat ClientDownload
```

使用 `crontab -e` 指令设置 SSPanel 的基本 cron 任务：

```
*/1 * * * * /usr/local/php/bin/php /path/to/your/site/xcat  Job SendMail
*/1 * * * * /usr/local/php/bin/php /path/to/your/site/xcat  Job CheckJob
0 */1 * * * /usr/local/php/bin/php /path/to/your/site/xcat  Job UserJob
0 0 * * * /usr/local/php/bin/php -n /path/to/your/site/xcat Job DailyJob
30 23 * * * /usr/local/php/bin/php /path/to/your/site/xcat sendDiaryMail
```

设置财务报表

```
5 0 * * * /usr/local/php/bin/php /path/to/your/site/xcat FinanceMail day 
6 0 * * 0 /usr/local/php/bin/php /path/to/your/site/xcat FinanceMail week
7 0 1 * * /usr/local/php/bin/php /path/to/your/site/xcat FinanceMail month
```

设置节点 GFW 检测

```
*/1 * * * * /usr/local/php/bin/php /path/to/your/site/xcat DetectGFW
```

每天1点以简单模式备份一次数据库和站点配置文件

```
0 1 * * * /usr/local/php/bin/php -n /path/to/your/site/xcat Backup simple
```
