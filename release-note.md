# 更新日志

## 2022.10

### What's Changed
* TBD

**Full Changelog**: https://github.com/Anankke/SSPanel-Uim/compare/2022.9...2022.10

## 2022.9

### What's Changed
* 新的一键安装&更新脚本
* 修复了面板内置的 Telegram Bot @RoromoriYuzu
* 移除了旧的 Telegram Bot
* 更新了 xcat ClientDownload 中的客户端列表
* 优化了用户面板主页的客户端下载功能
* 修正了 Trojan gRPC 协议的下发 @iamsaltedfish
* 移除了已经失效的支付网关
* 使用 Country Flags API 实现国旗显示
* 用户注册设置数据库化
* 重做了面板的随机字符生成逻辑，现在使用 openssl_random_pseudo_bytes 生成任意长度的随机字符串
* 重写了所有字符串验证的方法，避免出现 `999.999.999.999` 被判断为有效 IPv4 地址的情况
* 重做部分用户编辑页面的后端地址，使用了更明确的变量命名
* 修复了一个潜在的 XSS 问题
* 节点自定义配置所使用的 jsoneditor 现在默认为 code 编辑模式，可以一键复制整个 json 进行配置
* 管理员面板主页的图标使用 Chart.js 实现，替换原有的 CanvasJS 以避免潜在的版权问题
* 新增 gRPC API 的支持，节点新增通讯密钥重置功能
* xcat Tool 中新增重置所有节点通讯密钥的功能
* 调整了节点页面的样式以提高可视性，新增了节点类型显示
* 用户面板默认调用 Material Design Icons，使用更符合逻辑的图标
* 现在在导入通用设置时将会检测过时设置并删除
* 更新 Smarty 模板引擎至 4.x 以支持 PHP 8+ 环境部署
* 更新了 js 依赖库的版本 

**Full Changelog**: https://github.com/Anankke/SSPanel-Uim/compare/2022.8...2022.9

## 2022.8

### What's Changed
* Fix CanvasJS loads 4 times in a single page by @M1Screw in https://github.com/Anankke/SSPanel-Uim/pull/1506
* fix 500 by @iamsaltedfish in https://github.com/Anankke/SSPanel-Uim/pull/1510
* Fix Docker CI & Update Readme by @M1Screw in https://github.com/Anankke/SSPanel-Uim/pull/1514
* Add back parseArgs to fix bug by @zhyi828 in https://github.com/Anankke/SSPanel-Uim/pull/1521
* feat: merge gconfig with database setting by @M1Screw in https://github.com/Anankke/SSPanel-Uim/pull/1522
* fix: default bool value by @M1Screw in https://github.com/Anankke/SSPanel-Uim/pull/1523
* Hotfix for Lint CI issue by @M1Screw in https://github.com/Anankke/SSPanel-Uim/pull/1527
* fix: phinx migrate error by @M1Screw in https://github.com/Anankke/SSPanel-Uim/pull/1528
* feat: new lint ci with bugfix by @M1Screw in https://github.com/Anankke/SSPanel-Uim/pull/1529
* 修复无法购买流量包 by @RoromoriYuzu in https://github.com/Anankke/SSPanel-Uim/pull/1530
* 修复无法添加邀请链接数量 by @RoromoriYuzu in https://github.com/Anankke/SSPanel-Uim/pull/1531
* Dev 20220822 by @M1Screw in https://github.com/Anankke/SSPanel-Uim/pull/1532

### New Contributors
* @zhyi828 made their first contribution in https://github.com/Anankke/SSPanel-Uim/pull/1521

**Full Changelog**: https://github.com/Anankke/SSPanel-Uim/compare/2022.6...2022.8
