# 单端口多用户教程（91vps版）

?> 注：「91vps 版」指肥羊同学在 ss-panel-v3-mod 基础上魔改的分支，并非 SSPanel UIM。本文仅具有一定的参考意义。本文由 肥羊同学 编写，原文已经遗失，Wiki 仅做收录。

网上一直没有魔改单端口多用户的教程，作者迫于压力删库之后，甚至连 issue 都没了。整体来说还算是比较简单，就是很多地方比较繁琐。

## 效果图

- 节点列表
- 客户端链接使用

![](https://i.loli.net/2017/09/09/59b3c5e16a310.jpg)

## 注册用户

### 注册一个新用户

在资料编辑页面修改 **加密方式** 为:`aes-256-cfb`，**协议方式** 为:`auth_aes128_sha1`

> 理论上讲 协议(protocol)可以配置为 `auth_aes128_md5` 或 `auth_aes128_sha1`，但是经过我测试，只有我推荐的这个可以用。

### 端口号修改

如果你想让 单端口多用户 端口为 某个特定的值比如 `443`，那么这个时候可以顺便修改一下这个用户的端口号。

### 编辑该用户

使用管理员账户，在用户管理页面，设置该用户为 `协议式单端口多用户承载端口`

![2.png](https://i.loli.net/2017/09/09/59b3aebde4729.png)

### 新建节点

这一块目前网络上没有教程，我也是问了很多人才知道怎么填的。

- 节点地址：端口号（注意是端口号），要写刚才你新建那个用户的 端口号（比如443）。
- 节点 IP： 空着，别管他。
- 节点类型： Shadowsocks 单端口多用户

别的随意填

这个时候，点开节点标题之后，会多一个 **单端口多用户 Shadowsocks - 443 端口**，点开就可以用了。
![5.png](https://i.loli.net/2017/09/09/59b3b1b659805.png)

### 流量统计

使用单端口多用户和流量统计等功能不冲突

![1.png](https://i.loli.net/2017/09/09/59b3b16fdd560.png)

## 高级端口转发

如果设置多个多用户端口，想设置不同端口不同的转发规则以最大化伪装为其它服务，例如开了 80 端口和 443 端口作为多用户端口（以 `additional_ports` 方式作为示例）：

```json
"additional_ports" : {
    "80": {
        "passwd": "pubpassword",
        "method": "aes-128-ctr",
        "protocol": "auth_aes128_md5",
        "protocol_param": "#",
        "obfs": "tls1.2_ticket_auth_compatible",
        "obfs_param": ""
    },
    "443": {
        "passwd": "pubpassword",
        "method": "aes-128-ctr",
        "protocol": "auth_aes128_md5",
        "protocol_param": "#",
        "obfs": "tls1.2_ticket_auth_compatible",
        "obfs_param": ""
    }
},
```

同时本地的 nginx/apache 开启端口 1080 和 1443，那么在 `user-config.json` 里修改如下参数：

```json
"redirect" : ["*:80#127.0.0.1:1080", "*:443#127.0.0.1:1443"],
```

配置好后，直接访问 80 或 443 端口，将是个正常的网站，用 SSR 去连接则为代理服务。
其它：nginx的rewrite规则默认会使用监听的端口，这时会导致rewrite有问题，需要指定一下端口号

## 其余问题

### 数据不同步问题

有种说法，说 **多用户混淆参数后缀** 前后端必须一样，否则数据推送会出现问题。

根据后端默认配置，这里推荐一个前端配置。

```php
#多用户混淆参数后缀
$System_Config['mu_suffix']='zhaoj.in';

#多用户混淆参数表达式，%5m代表取用户特征 md5 的前五位，%id 代表用户id,%suffix 代表上面这个后缀。
$System_Config['mu_regex']='%5m%id.%suffix';
```

那个用户生成就是为了当单端口多用户用的，所以不要乱修改他的混淆加密什么的。

## 全站只留下单端口多用户

可以取消掉多端口的，看起来这样应该是最安全的，整个节点看起来只有 `443` 和 `80` 端口有数据，如果能在 `80/443` 端口里边塞一些页面什么的，就更完美了。

文章有参考：[breakwa11](https://breakwa11.blogspot.com/2017/01/shadowsocksr-mu.html)