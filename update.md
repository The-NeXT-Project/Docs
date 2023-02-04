# 升级 SSPanel UIM

## 版本升级

?> 以下的升级方式仅适用于 2022.12.1 及以后的版本

在当前目录下，执行下述命令升级 config

### Dev 分支

```bash
bash update.sh dev
```

### Release 分支

```bash
bash update.sh release [release version] [database version]
```

你可以在 Release Note 中找到其版本对应的数据库版本

上述命令会在 迁移/更新 操作之前自动备份原 config 文件到 `.config.php.bak`，迁移/更新操作完成之后会为你输出新旧配置之间的差异

?> 如果你在使用 CDN 或者 Nginx Cache 等，请自行刷新缓存。
