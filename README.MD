# 适用于QX，Surge和Loon的脚本转换器
## 作用
将所有引用的远程脚本自动转换成兼容QX, Surge, Loon的格式。主要用于签到类脚本。
## 原理
原理非常简单，通过MITM将所有向raw.githubusercontent.com的js请求拦截，然后将转换脚本添加到返回js脚本中。由于QX商店版不支持远程，只能加载本地脚本，此转换器无效。
## 用法
### 1. QX TF
```
[rewrite-local]
# 脚本转换器
^https?:\/\/(raw|gist)\.githubusercontent.com/.*\.js url script-response-body https://raw.githubusercontent.com/Peng-YM/ScriptConverter/master/js-converter.js

[mitm]
hostname=raw.githubusercontent.com, gist.githubusercontent.com
```
### 2. Surge & Loon
```
[Script]
http-response ^https?:\/\/(raw|gist)\.githubusercontent.com/.*\.js script-path=https://raw.githubusercontent.com/Peng-YM/ScriptConverter/master/js-converter.js, requires-body = true

[MITM]
hostname=raw.githubusercontent.com, gist.githubusercontent.com

```


