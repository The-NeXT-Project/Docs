# 面板架构

## 概述

SSPanel-UIM 是一个典型的 PHP 网页应用程序，它需要以下服务器程序才能正常工作

* HTTP 服务器。通常是 Apache 或者是 Nginx，出于性能考虑我们推荐用户使用 Nginx 部署。
* PHP 脚本运行程序。目前版本的 SSPanel-UIM 是基于 PHP 8.2 版本进行开发和测试的。
* 类 MySQL 数据库。我们推荐使用最新 LTS 版本的 MariaDB。目前版本的 SSPanel-UIM 是基于 MariaDB 10.11 版本进行开发和测试的。

在代码层面，SSPanel-UIM 使用 Slim Framework 4.x 作为后端的基础框架，使用最新版本的 Smarty 模板引擎提供前端模板渲染，Composer 管理第三方组件。
