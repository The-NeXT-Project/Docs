# 更新日志

## 2022.10

### What's Changed
* 更换了 qqwry.dat 下载源，现在纯真 IP 库可以正常更新了
* 使用 crc32c 计算 Etag，降低了 API 性能消耗
* 部分 php 函数调用改为 fully-qualified，在搭配 OPcache 的情况下能进一步提升性能
* 重做了节点性能状态功能，大幅度减少了用户节点列表页面所产生的 SQL 查询（减少~50%）
* WebAPI 额外新增了 “WebAPI-ETAG” 响应头用以解决 Cloudflare 等 CDN 强行去除返回数据中 ETag 的问题
* 管理面板和注册/登录页面默认调用 Material Design Icons，使用更符合逻辑的图标
* 修正了一个会导致 xcat Update 迁移配置出错的问题
* 将部分 xcat Update 功能迁移至了 update.sh
* 新增了彩虹易支付网关支付通道的选择开关
* 清理了 repo 代码中已经远程化的内容，为之后新增主题做准备
* 重做邮件队列功能，将所有定时邮件更改为使用邮件队列发送
* 将每日邮件发送指令与每日任务合并，并修复了其功能
* update.sh 现在会清理无用的 branch 和 tag，减少服务器空间占用
* 修复了 AWS SES API 发件功能，现在可以在设置中心内一键启用
* xcat ClientDownload 现在会从 config/clients.json 读取配置文件，客制化更简单了
* 整理了冗余代码，为之后的面板重构做准备

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
