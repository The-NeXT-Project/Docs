|rule description|rule regular expression|rule match type|
|:---|:---|:---|
|Blocking BT to prevent copyright disputes| `(torrent\|\.torrent\|peer_id=\|info_hash\|get_peers\|find_node\|BitTorrent\|announce_peer\|announce\.php\?passkey=)` |Packet Plaintext Match|
|Block Baidu High Precision Location Prevent IP and Client Geolocation from Being Recorded| `(api\|ps\|sv\|offnavi\|newvector\|ulog\.imap\|newloc)(\.map\|)\.(baidu\|n\.shifen)\.com`|Packet Plaintext Match|
|Block 360|`(.*\.\|\|)(360\|so)\.(cn\|com)`|Packet Plaintext Match|
|Prohibition of spamming Prevention of spam abuse|`(Subject\|HELO\|SMTP)`|Packet Plaintext Match|
|Blocking Spam mailboxes|`(^.*\@)(guerrillamail\|guerrillamailblock\|sharklasers\|grr\|pokemail\|spam4\|bccto\|chacuo\|027168)\.(info\|biz\|com\|de\|net\|org\|me\|la)`|Packet Plaintext Match|
|Blocking Thunderbolt Sites that basically block Thunderbolt and affect Thunderbolt's ability to download in global mode|`(.?)(xunlei\|sandai\|Thunder\|XLLiveUD)(.)`|Packet Plaintext Match|
