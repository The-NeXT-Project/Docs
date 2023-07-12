## 2023.4

配套数据库版本 ```2023071000```

### What's Changed
* TBD

### What's New
* TBD

**Full Changelog**: https://github.com/Anankke/SSPanel-Uim/compare/2023.3...2023.4

## 2023.3

配套数据库版本 ```2023050800```

### What's Changed
* 用户数据表使用 transfer_today 取代 last_day_t 字段以更准确地统计用户每日用量
* 移除了 Dummy WebAPI
* 修正了一个用户无法签到时依然尝试加载验证码模组的问题
* 修正了一个使用极验验证码并同时开启登录验证会导致前端报错的问题
* 修正了一个在 tabler 1.0.0-beta18+ 版本环境中站点主题显示异常的问题
* 修正了一个影响用户每日邮件接收设置显示的问题
* 调整了主题的 css，替换了在 Bootstrap 6 中将被弃用的样式代码
* 修复了一个会导致 Stripe 网关文件无法正常加载的问题
* 客户端下载功能使用 Clash Verge 替换原有的 Clash for Windows 作为默认 Windows/MacOS/Linux 客户端以更好地支持 Clash.Meta 内核
* 重写了流量自动转换功能，现在面板可以正常显示最高至 1YB 的流量数据
* 修正了一个当优惠码没有设置过期时间时无法被正常应用至订单的问题
* 重写的邀请码注册功能
* 修正了一个可能导致定时任务反复发送节点上线/离线通知的问题
* 修正了一个在特定情况下影响通用订阅 Clash 类型正常下发的问题

### What's New
* Turnstile 验证码主题现在会跟随用户的深色模式设定
* 全新的 Cron 系统
* 每日任务执行时间和财务报表邮件相关的设定数据库化
* 使用 tabler 主题重做的站点 404/405/500 以及 staff 页面
* 现在用户在未登录的情况下访问订单创建页面将会被重定向至登录/注册页面，并在完成登录/注册后重新跳转至先前的订单创建页面

**Full Changelog**: https://github.com/Anankke/SSPanel-Uim/compare/2023.2...2023.3

## 2023.2

配套数据库版本 ```2023032600```

### What's Changed
* 修正了 Clash 通用订阅中 Trojan 节点传输配置下发异常的问题 @kleinrui
* 修正了传统订阅中缺失的异常处理与严格数据类型
* 修正了 Sentry 错误报告无法正常启用的问题
* 修正了可能导致验证码无法在前端正常显示的问题
* 调整了前端模板中验证码区块的显示方式
* 现在 Telegram Webhook 可以通过禁用 Telegram 功能关闭
* 修正了用户邀请记录无法正常显示含有已注销用户记录的问题
* 现在用户账户信息页面会显示账户当前在线的 IP 地址
* 初步支持 Clash.Meta 相关配置的下发
* 修正了 Telegram Bot 无法正常初始化的问题 @Irohaede
* 修正了账户密码重设功能失效的问题
* 现在 xcat Job CheckJob 已经被合并至 xcat Cron 中
* 修正了用户邀请记录页面报错的问题 @zesai
* 全新的 PayPal 支付网关
* 现在支付宝当面付已经适配了新商店系统
* 修正了一个当 Maxmind 密钥未配置时部分页面依然尝试加载 IP 数据库的问题
* 移除了管理员后台注册时的站点注册限制检查
* 全新基于 OpenAI GPT 语言模型的工单自动回复功能
* 修正了节点离线检测无法正常工作的问题
* 全新的用户余额记录页面
* 现在用户可以通过礼品卡进行账户余额充值
* 修正了部分按钮无法正常在移动设备上显示的问题
* 修正了一个可能导致每日任务卡死并异常占用系统资源的问题
* 重做的系统邮件模板，精简了模板文件尺寸
* 修正了管理员后台中一处文本错误 @yaoyao1128
* 修正了用户编辑页面的 ajax 与管理员后台页面部分按钮的事件监听 @yaoyao1128
* 修正了管理员后台用户编辑页面的流量相关显示与其说明文本
* 修正了邀请系统无法正常在新商店系统中工作的问题
* 修正了通过 Telegram Bot 修改用户余额时无法正常添加用户余额记录的问题

**Full Changelog**: https://github.com/Anankke/SSPanel-Uim/compare/2023.1...2023.2

## 2023.1

配套数据库版本 ```2023032600```

### What's Changed
* 修正了管理员账单的取消按钮显示问题
* 现在管理账单详情页会显示网关单号（如有）
* 重做的收入统计功能，现在根据 Paylist 记录计算而不是旧商店系统的订单记录
* 全新的用户余额使用记录功能
* 现在 Paylist 会记录支付所使用的网关名称（目前仅适配 EPay）
* 重做的财务邮件功能，同样使用 Paylist 记录计算营收
* 去除了绝大部分旧商店系统的残留代码，在 2023.2 版本中将会彻底移除旧商店的续费逻辑
* 修正了新商店系统激活逻辑中一个可能导致用户订单激活后仍无法使用的问题
* 现在 Mailgun 邮件系统支持自定义发信人名称 @0xMagicCoder
* 全新的传统订阅系统开关，用于让运营者决定是否需要兼容 v2rayN 等仍在使用协议专属订阅的客户端
* 工单相关的设置现在已经数据库化
* 商品创建，商品编辑，节点创建，节点编辑页面添加了更多的无效数值检测和前端提示，以避免某些运营者不喜欢完整填充表单的恶习造成问题
* 将 Clash 通用订阅的部分数值移至 appprofile 中，方便运营者自定义下发配置
* 统一的 IP 数据库接口
* 使用 Maxmind GeoLite2 免费数据库作为默认的 IP 数据库，运营者需要配置 Maxmind API 密钥后方可正常更新
* 全新的 per IP 用户在线 IP 统计功能 @Irohaede
* 重写了部分 Models 的方法，提升了代码质量
* 现在 repo 中将会提供 composer.lock 文件，以确保每个版本的依赖库版本一致
* 调整了每日任务中数据表的清理时间
* Maxmind GeoLite2 多语言支持建议 by @lmfcc
* 修正了用户资料编辑页面密码重置按钮的 URL 问题
* 现在用户的 uuid 和 api_token 将会基于 UUIDv4 生成
* 移除了旧商店系统的残留链接
* 修正了缺失的注册时 TOS 同意框选择检查
* 修正了部分 Telegram 信息发送异常没有被正确处理的问题
* 重做的 Sentry 错误报告和遥测功能
* 修正了 500 页面返回 500 错误的问题
* 修正了节点的上线/下线检测失效的问题

**Full Changelog**: https://github.com/Anankke/SSPanel-Uim/compare/2022.12.1...2023.1

## 2022.12.1

配套数据库版本 ```2023030500```
### What's Changed
* 调整了部分数据表数值的类型，优化了查询性能
* 通用订阅系统新增 Clash 类型订阅
* 用户表中新增了 api_token 字段，用于未来的管理员/用户 RESTful API 系统
* 新增了传统订阅系统，用于兼容 v2rayN 等仍在使用协议专属订阅的客户端
* 用户表中新增了 node_iplimit 字段，用以取代原有意义不明的 node_connector 字段，用于限制用户的总连接 IP 数
* 优化了节点在线用户功能，减少了不必要的数据库查询，提升了节点页面的访问性能
* 全新的管理员礼品卡功能
* 去除了 ShadowsocksR 相关的代码，完善了 Shadowsocks 2022 系列加密的支持
* 修正了 Trojan grpc Clash 订阅的下发问题 @KorenKrita
* 新增了获取节点 IPv6 地址的功能 @KorenKrita
* 管理员用户设置页面新增用户的新商店系统开关
* 修正了一个可能导致 SSPanel-UIM 站点被批量扫描及识别的问题
* 默认使用 bcrypt 加密用户的密码
* 全新的商店系统，包括商品/订单/账单三个组件
* 使用 waifu2x 重置了内置的 SSPanel-UIM 和支付网关图标
* 全新的 SIP002 订阅下发，支持 Shadowsocks 插件
* 全新的优惠码系统，支持多种优惠码类型，支持设置仅限新用户使用和每个用户使用次数以及更精准的到期时间设置等功能
* 更新面板所使用的 Slim 框架至版本 4 @Irohaede
* 全新的数据库迁移系统 @Irohaede
* update.sh 脚本现在支持更新至指定版本
* 修正了 GA 相关功能并将其更名为 MFA（多因素认证）系统
* 修正了一个会导致财务邮件在 PHP8.1+ 环境中无法发送的问题
* 重做的管理员数据库设置页面，现在每个子功能都有自己独立的页面与后端
* 将部分 config.php 中的配置项移动至数据库中，现在可以在后台进行修改
* 修正了用户订阅日志的显示问题
* 新增了用户各类日志的显示开关
* 优化了用户 profile 页面的访问性能，同时现在用户主页默认使用 Stash 作为 iOS 客户端
* 邮件系统新增 Postal 开源邮局系统的支持 @pplulee
* 优化了用户邀请页面的访问性能
* 现在用户在首页签到成功后将会禁用签到按钮与移除验证码元素
* 全新的统一 Cron 系统（目前仅包含新商店系统相关的逻辑）
* 管理员邀请与审计页面适配 tabler 主题，简化了相关代码
* 使用自动化工具对代码进行了优化，提高了代码的可读性和提升了在 OPcache 环境下的性能
* 使用 sha256 计算用户 Cookie 的签名，提高了 Cookie 的安全性
* 启用 PHP 中 Cookie 相关的安全性设置，强制使用 HTTPS 访问与降低 XSS 攻击的风险
* 修正了一个潜在的代码任意执行问题

**Full Changelog**: https://github.com/Anankke/SSPanel-Uim/compare/2022.12...2022.12.1

## 2022.12
### What's Changed
* 修正了一个节点页面显示的问题
* 新增用户封禁显示与设置封禁理由
* 修正了一个页面 header UI 的问题
* tabler 主题适配管理员主页/用户/节点/工单/公告/在线IP/登录日志/订阅日志/流量记录
* 修正了一个导致 custom_config 无法保存的问题
* 现在更新 qqwry.dat 会直接通过 update.sh 进行
* 重做了工单系统的逻辑，现在工单系统会将每个工单数据储存在单一数据列中
* 在 tabler 主题中使用 Bootstrap 5 主题数据表
* 重做了所有已适配 tabler 主题界面的数据表 ajax 逻辑，简化了代码，降低后续维护的难度
* user 表新增 node_iplimit 及 webapi 下发为新的商店系统做准备
* 用户可选加密方式中新增了 Shadowsocks 2022 系列加密
* 现在面板会使用  noindex meta tag 来彻底避免被搜索引擎索引（在搜索引擎尊重这个参数的前提下）
* 验证码系统新增 极验行为验证 4.0 的选项，用以取代在前一个版本中移除的旧版极验验证码功能
* 在部分数据量大的后台页面新增了简化版的 Server Side 数据表实现以改善访问性能，其余的页面数据表依然采用客户端模式以减少数据库请求
* 修正了一些由历史遗留原因导致的问题

注：目前开发分支中商店重做部分的代码还没有时间进行充分验证，为了避免影响站点使用（特别是涉及财务系统的情况），这个功能连带计划中的订阅系统更新将会放到一个单独的 2022.12.1 Release 中提供

**Full Changelog**: https://github.com/Anankke/SSPanel-Uim/compare/2022.11...2022.12

## 2022.11

### What's Changed
* 新增用户每小时流量记录功能
* 修正了一个当 Telegram 用户名为空时绑定出错的问题
* 优化了每日邮件的显示
* 新增了 tabler 主题，并适配了用户中心，登录，注册等界面
* 更新通用订阅系统至 version 2，使用了更清晰的参数，并移除了 SSR 的下发
* 现在通用订阅系统支持 json 和 clash 两种格式的下发，并且重写了底层的代码逻辑
* 清理了主题中大量冗余和无用的 JavaScript 脚本，减少不必要的资源消耗
* 新增了系统级别的暗色主题支持，目前已经适配 tabler 主题，用户可以在下拉选单中一键切换
* 修正了 tabler 主题中的用户邮件修改逻辑
* 现在通用订阅将会使用 subUrl，并且移除了默认配置中硬编码的 URL
* tabler 主题中新增了全新的 user/server 入口，为用户提供了更清晰直白的节点状态显示
* 后端添加了全新的 ServerController，为之后的重写节点配置显示和下发做准备
* 使用 Cloudflare Turnstile 替代 Google reCaptcha 作为默认的 Captcha 供应商，优化了使用体验并能够更好地保护用户隐私
* 重做了 Captcha 系统的逻辑，为之后的 GeeTest v4 接入做准备
* 优化了 ETag 的生成和优化了 WebAPI 的性能 @Irohaede
* 移除了 WebAPI 中不需要节点 ID 即可更新的问题，现在所有相关 WebAPI 请求必须带上有效的 node_id
* 修正了 WebAPI 中潜在的安全风险，完善了相关功能
* 现在用户密码重置页面支持 Captcha 保护
* 修正了一个注册时前端传递的邀请码为空时会导致注册失败的问题
* 更新了面板的依赖，其中包括许多重要的功能与安全修正
* 优化了 tabler 主题中的一些显示细节

**Full Changelog**: https://github.com/Anankke/SSPanel-Uim/compare/2022.10...2022.11

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
