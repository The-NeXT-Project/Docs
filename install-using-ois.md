# 使用 oneinstack 部署 SSPanel UIM

?> 教程使用的环境：CentOS 6.5

## 安装 oneinstack

oneinstack 官方网站：https://oneinstack.com/ 。可以访问这个网页 https://oneinstack.com/auto/ 来指定你需要的安装环境 （避免麻烦，这里给出一个此面板较为稳妥的部署方案)

以 `root` 登录服务器，执行以下命令安装 oneinstack：

```bash
$ wget http://mirrors.linuxeye.com/oneinstack-full.tar.gz && tar xzf oneinstack-full.tar.gz && ./oneinstack/install.sh --nginx_option 1 --php_option 5 --phpcache_option 1 --php_extensions zendguardloader,ioncube,imagick,gmagick --phpmyadmin --db_option 3 --dbinstallmethod 1 --dbrootpwd root --pureftpd
```

安装消耗时长根据机器配置而定，如果无法保证网络一直处于连通状态，请在`screen`下执行以上命令！

> `screen`基础用法：
> - Step 1. `yum install -y screen`
> - Step 2. `screen -S oneinstack`    
> - Step 3. <kbd>Ctrl</kbd>+<kbd>A</kbd>+<kbd>D</kbd>
> - Step 4. Go and have some tea,wait patiently

一般来说，1C1G 机器需要 15min 至 30min 完成上述安装！以上是安装环境的所有步骤。

## 部署 SSPanel UIM

安装完毕之后，在 `/root` 目录下应存在一个 `oneinstack` 目录，前往该目录创建新站点：

```bash
$ cd root/oneinstack
$ ./vhost.sh
```

新建虚拟主机，推荐传输协议为 `https` 并使用 `Let's Encrypt` 证书。

这里详细步骤就不再赘述了，跟 LEMP 部署流程中基本相同（经过测试用 Wordpress 的伪静态规则可以让网站程序正常运行），如果同时安装了 Apache 和 Nginx，需要配置 Apache 的伪静态规则。

部署完毕以后，根目录中会多出一个 data 文件夹，所有的网站数据都在这个目录下。
现在开始拉取网站程序。

```bash
$ git clone -b master https://github.com/Anankke/ss-panel-v3-mod_Uim.git tmp && mv tmp/.git . && rm -rf tmp && git reset --hard
$ chown -R root:root ./* && chmod -R 755 ./* && chown -R www:www storage
```

在当前目录下安装依赖

```bash
$ php composer.phar install
```

oneinstack 默认的 Nginx 安装目录可能会随版本更新而发生变化，因此建议通过  `whereis` 命令自行查找，找到安装目录下的 `vhost/www.你的域名.com.conf` 文件，将 `root /data/wwwroot/你的域名;` 修改为 `root/data/wwwroot/你的域名/public;`

之后，修改网站目录下 config 文件夹里面的内容来对接数据库。

!> 采用本教程部署的数据库用户名密码默认都为 `root`！！！！强烈建议在网站正常运行后进行更改！！！！！

?> 通过 http://IP/phpMyAdmin 可以登录数据库，进行可视化的数据库操作。

之后步骤与 LEMP 部署流程基本相同

```bash
$ php xcat createAdmin          # 创建管理员
$ php xcat syncusers            # 同步用户
$ php xcat initQQWry            # 下载IP解析库
$ php xcat resetTraffic         # 重置流量
$ php xcat initdownload         # 下载 ssr 程式
```

以及不要忘记安装crontab，并添加定时任务规则,但是oneinstack需要设置php的环境路径，否则定时任务无法执行。
建立软链到环境变量

```bash
$ ln -s /usr/local/php/bin/php /usr/bin/php
```

oneinstack 面板的自动备份会备份空文件，需要建立 mysqldump 的软链接

```bash
$ ln -s /usr/local/mysql/bin/mysqldump /usr/bin/mysqldump
```

设置crontab：

```
30 22 * * * php /网站目录/xcat sendDiaryMail
0 0 * * * php -n /网站目录/xcat dailyjob
*/1 * * * * php /网站目录/xcat checkjob
*/1 * * * * php /网站目录/xcat syncnode
```
