# 升级 SSPanel UIM

## 版本升级

在当前目录下，执行下述命令升级 config

```bash
bash update.sh
```

上述命令会在 迁移/更新 操作之前自动备份原 config 文件到 `.config.php.bak`，迁移/更新操作完成之后会为你输出新旧配置之间的差异

?> 如果你在使用 CDN 或者 Nginx Cache 等，请自行刷新缓存。
