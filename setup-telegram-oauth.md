# 配置 Telegram OAuth

Telegram 官方推出了 OAuth 接口以后可以代替扫码和输入数字。

![](https://img.vim-cn.com/9c/2a7451f21b7a85537cdaa3acd040804981bdd1.png)

----

![](https://img.vim-cn.com/af/a42796a5912b9c6dc4e8b9ebcf079a6179c846.png)

- 给 [@BotFather](https://t.me/botfather) 发送命令 `/setdomain`
- 选择你要设置的机器人
- 回复你的 **网站域名**，如 `example.com` 或者 `dashboard.example.com`

----

如果要修改样式，可以参考 Telegram 官方给出的指南： https://core.telegram.org/widgets/login

----

- Telegram OAuth 组件使用 `async` 载入，不会阻塞页面其他内容加载，但是可能会影响部分浏览器上 `window.onload` 事件的触发
- 如果你发现你的脚本无法载入，请先检查浏览器控制台提示，排除网络问题后最容易出的问题是忘记关闭同源 `same-origin` 设定，这个在 Cloudflare 设置里面需要设置为关闭。如果你的网站配置里面有类似配置（部分防跨站规则有）也需要将其关闭
- 如果访问者（不是网站主机）不能科学上网的的话将无法使用

!> 别试图自己反代这个脚本或者什么重新适配，后面的故事远不止如此

- 如果登陆人的 Telegram 的名字太长，会影响网页排版，这是正常现象
