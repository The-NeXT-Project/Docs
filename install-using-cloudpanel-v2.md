# CloudPanel

CloudPanel 是一个免费的 PHP 服务器控制面板，专为云而构建，以实现最高性能和安全性

# 系统要求

- Debian 11
- Ubuntu 22

# 安装 CloudPanel

```
apt -y update
apt -y install curl wget sudo
curl -sSL https://installer.cloudpanel.io/ce/v2/install.sh | sudo bash
```

![](https://raw.github.com/sspanel-uim/Wiki/master/img/cloudpanel_1.png)

# 访问控制面板

访问 `https://服务器ip:8443` ，点击高级选项，点击继续前往

如果无法打开，请检查防火墙设置，包括服务商和服务器上的 iptables 和 ufw 防火墙

暂时关闭 iptables 防火墙（重启服务器后可能会失效）

```
iptables -P INPUT ACCEPT
iptables -P OUTPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -F
```

# 添加域名解析

在你的域名注册商添加一个a解析，指向服务器ip地址

# 添加网站

![](https://raw.github.com/sspanel-uim/Wiki/master/img/cloudpanel_2.png)

点击 `Create a PHP Site`
![](https://raw.github.com/sspanel-uim/Wiki/master/img/cloudpanel_3.png)

- `Application` 选 `Slim 4`
- `PHP Version` 这个 `dev` 分支选 `8.1` ，`net-feat` 分支选 `7.4`
- 用户和密码会自动生成，无需在意
![](https://raw.github.com/sspanel-uim/Wiki/master/img/cloudpanel_4.png)

# 拉取项目

### dev 分支

```
cd /home/上一步自动生成的网站用户/htdocs/你的域名
rm -rf *
git clone https://github.com/Anankke/SSPanel-Uim.git .
mv db/migrations/20000101000000_init_database.php.new db/migrations/20000101000000_init_database.php
cp config/.config.example.php config/.config.php
cp config/appprofile.example.php config/appprofile.php
wget https://getcomposer.org/installer -O composer.phar
php composer.phar install
```

### new-feat 分支

```
cd /home/上一步自动生成的网站用户/htdocs/你的域名
rm -rf *
git clone -b new-feat https://github.com/Anankke/SSPanel-Uim.git .
cp config/.config.example.php config/.config.php
cp config/appprofile.example.php config/appprofile.php
wget https://getcomposer.org/installer -O composer.phar
/usr/bin/php7.4 composer.phar install
```
然后
```
chmod 755 -R *
chmod 777 storage -R
chown root -R *
git config --global --add safe.directory $(pwd)
git checkout .
```

# 获取数据库密码
```
clpctl db:show:master-credentials
```

# 创建数据库
```
mysql -h'127.0.0.1' -P'3306' -u'root' -p'刚才获取的数据库密码' -e "create database sspanel" -A
```
仅 `new-feat` 分支需要执行
```
mysql -h'127.0.0.1' -P'3306' -u'root' -p'刚才获取的数据库密码' -A
use sspanel;
source /home/上一步自动生成的网站用户/htdocs/你的域名/databases/glzjin_all.sql;
```
最后按下 `Ctrl` + `D` 登出

# 编辑配置文件

点击 `Manage`
![](https://raw.github.com/sspanel-uim/Wiki/master/img/cloudpanel_5_2.png)

点击 `File Manage`
![](https://raw.github.com/sspanel-uim/Wiki/master/img/cloudpanel_6.png)

依照图示编辑，完成后左上角保存
![](https://raw.github.com/sspanel-uim/Wiki/master/img/cloudpanel_7.png)
# 导入设置
```
vendor/bin/phinx migrate
php xcat Tool importAllSettings
php xcat Tool initQQwry
```
仅 dev 分支需要执行
```
php xcat Tool detectConfigs
```

# 创建管理员账户
```
php xcat User createAdmin
```

# 设置 sql mode
```
sed -i '7i sql_mode=""' /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql
```

此时应该可以打开网站并使用刚才创建的账户登录了

# 添加定时任务

### dev 分支

```
cd /root
crontab -l > crontab.list

echo "
0 */1 * * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat Job UserJob
*/1 * * * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat Job SendMail
*/1 * * * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat Job CheckJob
30 23 * * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat SendDiaryMail
0 0 * * *   /usr/bin/php -n /home/上一步自动生成的网站用户/htdocs/你的域名/xcat Job DailyJob
" >> crontab.list

crontab crontab.list
rm crontab.list
```

### new-feat 分支

```
cd /root
crontab -l > crontab.list

echo "
0 */1 * * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat Job UserJob
*/1 * * * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat Job SendMail
*/1 * * * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat Job CheckJob
0 0 * * * /usr/bin/php -n /home/上一步自动生成的网站用户/htdocs/你的域名/xcat Job DailyJob
30 23 * * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat SendDiaryMail
0 0 * * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat Statistics Another
59 23 * * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat Statistics CheckIn
" >> crontab.list

crontab crontab.list
rm crontab.list
```

# 可选定时任务

财务报表

```
5 0 * * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat FinanceMail day 
6 0 * * 0 /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat FinanceMail week
7 0 1 * * /usr/bin/php /home/上一步自动生成的网站用户/htdocs/你的域名/xcat FinanceMail month
```

# 建议

### 安全

如需在生产模式开启 `debug` 模式，可以执行 `bash block-whoops-env.sh` ，便能将敏感的环境参数隐藏

执行 `bash block-whoops-env.sh recover` 可以使用备份恢复修改的文件

### 备份

执行以下命令导出数据库文件，建议配合其他脚本或工具备份到云端
```
mysqldump -h127.0.0.1 -uroot -p刚才获取的数据库密码 --databases sspanel > sspanel.sql
```

### ssl 证书

可以一键申请免费的 90 天 ssl 证书，应该会自动续期（吧）

![](https://raw.github.com/sspanel-uim/Wiki/master/img/cloudpanel_8.png)

# 同步更新

### dev 分支

```
git pull
```

### new-feat 分支

```
git pull origin new-feat:new-feat
```

有时候，光这么做可能不够，你可能还需要
```
composer update
vendor/bin/phinx migrate
php xcat Tool importAllSettings
```

同时需要注意有没有什么参数在 `.config.example.php` 文件中有，而在你的 `.config.php` 文件中没有的（你可以谷歌一些在线文本比对工具来方便排查）
