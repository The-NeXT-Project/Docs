## 概述

SSPanel-UIM 是一个典型的 PHP 网页应用程序，它需要以下服务器程序才能正常工作

* HTTP 服务器。出于性能考虑我们推荐用户使用 Nginx 部署。
* PHP 脚本运行程序。目前版本的 SSPanel-UIM 是基于 PHP 8.3 版本进行开发和测试的。
* 类 MySQL 数据库。我们推荐使用最新 LTS 版本的 MariaDB。目前版本的 SSPanel-UIM 是基于 MariaDB 11.2 版本进行开发和测试的。
* Redis 键值对数据库，主要用于储存非持久化数据以降低 MariaDB 性能消耗。目前版本的 SSPanel-UIM 是基于 Redis 7.2 版本进行开发和测试的。

在代码层面，SSPanel-UIM 使用 Slim Framework 4.x 作为后端框架，Smarty 4.x 和 Twig 3.x 模板引擎提供前端模板渲染，Composer 管理第三方组件。

## 系统配置要求

SSPanel-UIM 可以运行于相对低配置的 Linux 系统中，但出于性能考虑，我们推荐至少 2GB 的系统内存供 OPcache 与数据库使用，降低磁盘 IO 消耗。

需要注意的是 SSPanel-UIM 的许多内置功能依赖 Github/Cloudflare 等服务才能正常工作，如果将 SSPanel-UIM 部署于网络受限的环境（i.e 中国，伊朗和越南等对互联网实行严格审查的独裁国家）中可能会导致部分或全部功能失效，并产生法律风险，因此并不推荐将 SSPanel-UIM 部署于这些国家境内。
