# 官方文档
[https://book.cakephp.org/phinx/0/en/index.html](https://book.cakephp.org/phinx/0/en/index.html)
# 翻译文档
[https://tsy12321.gitbooks.io/phinx-doc/content/](https://tsy12321.gitbooks.io/phinx-doc/content/)

[https://zh-sphinx-doc.readthedocs.io/en/latest/contents.html](https://zh-sphinx-doc.readthedocs.io/en/latest/contents.html)

# 常用命令
#### 注意事项
- 可以加 `-e` 指定环境。默认环境是 `production`
#### 创建一个迁移
```
vendor/bin/phinx create CreateTable
```
#### 查看迁移状态
```
vendor/bin/phinx status
```
#### 迁移
```
vendor/bin/phinx migrate
```
#### 回滚
```
vendor/bin/phinx rollback
```
#### 指定迁移或回滚
可以使用 `--target` 或者 `-t` 来指定执行某个迁移脚本
```
vendor/bin/phinx migrate -t 20110103081132
vendor/bin/phinx rollback -t 20120103083322
```
#### 回滚所有
```
vendor/bin/phinx rollback -t 0
```
