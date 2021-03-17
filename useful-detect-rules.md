# 常用审计规则

|规则描述|规则正则表达式|规则匹配类型|
|:---|:---|:---|
|屏蔽BT防止版权争议| `(torrent\|\.torrent\|peer_id=\|info_hash\|get_peers\|find_node\|BitTorrent\|announce_peer\|announce\.php\?passkey=)` |数据包明文匹配|
|屏蔽百度高精度定位 防止IP与客户端地理位置被记录| `(api\|ps\|sv\|offnavi\|newvector\|ulog\.imap\|newloc)(\.map\|)\.(baidu\|n\.shifen)\.com`|数据包明文匹配|
|屏蔽360|`(.+\.\|^)(360\|so)\.(cn\|com)`|数据包明文匹配|
|禁止邮件滥发 防止垃圾邮件滥用|`(Subject\|HELO\|SMTP)`|数据包明文匹配|
|屏蔽Spam邮箱|`(^.*\@)(guerrillamail\|guerrillamailblock\|sharklasers\|grr\|pokemail\|spam4\|bccto\|chacuo\|027168)\.(info\|biz\|com\|de\|net\|org\|me\|la)`|数据包明文匹配|
|屏蔽迅雷 基本屏蔽掉迅雷的网站，并且在全局模式下会影响迅雷的下载能力|`(.?)(xunlei\|sandai\|Thunder\|XLLiveUD)(.)`|数据包明文匹配|
|屏蔽金融诈骗|`.*bank.*`|数据包明文匹配|
|屏蔽金融诈骗|`(.*\.\|\|)(gash)\.(com\|tw)`|数据包明文匹配|
|屏蔽金融诈骗|`(.*\.\|\|)(mycard)\.(com\|tw)`|数据包明文匹配|

----

如果需要自定义阻断页面的内容，请在每个后端目录下，复制 `detect.html` 为 `user-detect.html`，修改 `user-detect.html` 并重启后端。
