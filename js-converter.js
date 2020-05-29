// 是否开启输出
const verbose = true;
if(!verbose){
    console.log = ()=>{}
}

const url = $request.url;
let body = $response.body;
const isSurge = body.indexOf("$httpClient") !== -1;
const isQX = body.indexOf("$task") !== -1;
if ((!isSurge && !isQX) || (isSurge && isQX)) {
 console.log(`脚本不含有需要转换的代码，无需转换`);
 $done({body});
}else if (($task !== undefined && isQX) || ($httpClient !== undefined && isSurge)){
 console.log(`脚本已为${isQX ? "QX" : "Surge"}格式，无需转换`);
 $done({body});
}  else {
    console.log(`开始转换${isQX? "QX" : "Surge"}格式的脚本： ${url}...`);

    let converter = `
    /********** CONVERTER START ********/
    // #region 固定头部
    let isQuantumultX = $task != undefined; //判断当前运行环境是否是qx
    let isSurge = $httpClient != undefined; //判断当前运行环境是否是surge
    // http请求
    var $task = isQuantumultX ? $task : {};
    var $httpClient = isSurge ? $httpClient : {};
    // cookie读写
    var $prefs = isQuantumultX ? $prefs : {};
    var $persistentStore = isSurge ? $persistentStore : {};
    // 消息通知
    var $notify = isQuantumultX ? $notify : {};
    var $notification = isSurge ? $notification : {};
    // #endregion 固定头部

    // #region 网络请求专用转换
    if (isQuantumultX) {
      var errorInfo = {
        error: "",
      };
      $httpClient = {
        get: (url, cb) => {
          var urlObj;
          if (typeof url == "string") {
            urlObj = {
              url: url,
            };
          } else {
            urlObj = url;
          }
          $task.fetch(urlObj).then(
            (response) => {
              cb(undefined, response, response.body);
            },
            (reason) => {
              errorInfo.error = reason.error;
              cb(errorInfo, response, "");
            }
          );
        },
        post: (url, cb) => {
          var urlObj;
          if (typeof url == "string") {
            urlObj = {
              url: url,
            };
          } else {
            urlObj = url;
          }
          url.method = "POST";
          $task.fetch(urlObj).then(
            (response) => {
              cb(undefined, response, response.body);
            },
            (reason) => {
              errorInfo.error = reason.error;
              cb(errorInfo, response, "");
            }
          );
        },
      };
    }
    if (isSurge) {
      $task = {
        fetch: (url) => {
          //为了兼容qx中fetch的写法,所以永不reject
          return new Promise((resolve, reject) => {
            if (url.method == "POST") {
              $httpClient.post(url, (error, response, data) => {
                if (response) {
                  response.body = data;
                  resolve(response, {
                    error: error,
                  });
                } else {
                  resolve(null, {
                    error: error,
                  });
                }
              });
            } else {
              $httpClient.get(url, (error, response, data) => {
                if (response) {
                  response.body = data;
                  resolve(response, {
                    error: error,
                  });
                } else {
                  resolve(null, {
                    error: error,
                  });
                }
              });
            }
          });
        },
      };
    }
    // #endregion 网络请求专用转换

    // #region cookie操作
    if (isQuantumultX) {
      $persistentStore = {
        read: (key) => {
          return $prefs.valueForKey(key);
        },
        write: (val, key) => {
          return $prefs.setValueForKey(val, key);
        },
      };
    }
    if (isSurge) {
      $prefs = {
        valueForKey: (key) => {
          return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
          return $persistentStore.write(val, key);
        },
      };
    }
    // #endregion

    // #region 消息通知
    if (isQuantumultX) {
      $notification = {
        post: (title, subTitle, detail) => {
          $notify(title, subTitle, detail);
        },
      };
    }
    if (isSurge) {
      $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
      };
    }
    // #endregion
    /************ CONVERTER END ********************/
    `;
    body = converter + "\n" + String(body);
    console.log("转换成功");
    $done({body});
}
