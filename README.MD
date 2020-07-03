# 适用于QX，Surge和Loon的脚本转换器
## 作用
将所有引用的远程脚本自动转换成同时兼容QX, Surge, Loon的格式。主要用于签到类脚本中。转换器会根据脚本内容判断是否需要注入格式转换的代码。目的是减少脚本开发者在编写脚本时需要重复适配多平台的冗余代码。用户直接加入转换器即可。
## 原理
原理非常简单，通过MITM将所有向raw.githubusercontent.com的js请求拦截，然后将转换脚本添加到返回js脚本中。
## 用法
### 1. QX [失效]
```
[rewrite-local]
# 脚本转换器
^https?:\/\/(raw|gist)\.githubusercontent.com/.*\.js$ url script-response-body https://raw.githubusercontent.com/Peng-YM/ScriptConverter/master/js-converter.js

[mitm]
hostname=raw.githubusercontent.com, gist.githubusercontent.com
```
### 2. Surge & Loon
```
[Script]
http-response ^https?:\/\/(raw|gist)\.githubusercontent.com/.*\.js$ script-path=https://raw.githubusercontent.com/Peng-YM/ScriptConverter/master/js-converter.js, requires-body = true

[MITM]
hostname=raw.githubusercontent.com, gist.githubusercontent.com
```
## 好，我做完了？然后呢？
### 检验一下！
把上面的脚本添加到软件中后，怎么看是否成功加载转换器呢？这里提供了一个例子：
1. 点击[这个](https://github.com/Peng-YM/ScriptConverter/blob/master/zongheng.js)链接。可以看到这个脚本是QX专用的，并没有对Surge & Loon做适配。
2. 再点击[这个](https://raw.githubusercontent.com/Peng-YM/ScriptConverter/master/zongheng.js)链接。这个其实是之前打开的脚本的raw链接，此时应该能看到转换代码已经被注入到文件头部了，这说明该脚本已经可以用到Surge&Loon中了。如果你看到的文件内容和原来的一样，请再仔细检查配置是否有问题。
