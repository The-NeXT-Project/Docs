# 升级 SSPanel UIM

# 版本升级

首先 `cd` 到你网站的存放目录，使用 `ls` 确认当前目录下存在 `.git` 文件夹。如果不存在，需要重新执行一次安装。

使用下述指令升级 SSPanel UIM 到最新版本（Dev版）：

```bash
$ git fetch --all
$ git reset --hard origin/dev
$ git pull
```

!> 你会丢失除 `.config.php` 文件以外的所有改动，因此请自行做好文件备份。

?> 如不想丢失改动，请参考 Git 官方文档 [7.3 Git 工具- 储藏与清理](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%82%A8%E8%97%8F%E4%B8%8E%E6%B8%85%E7%90%86)


在当前目录下，执行下述命令升级 config

```bash
php xcat Update
```

上述命令会在 迁移/更新 操作之前自动备份原 config 文件到 `.config.php.bak`，迁移/更新操作完成之后会为你输出新旧配置之间的差异

?> 如果你在使用 CDN 或者 nginx cache 等，请自行刷新缓存。
