// 是否开启输出
const verbose = true;
const url = $request.url;
let body = $response.body;

isSurge = body.indexOf("$httpClient") != -1;
isQX = body.indexOf("$task") != -1;
if ((!isSurge && !isQX) || (isSurge && isQX)) {
  $done(body);
}
if (verbose) {
  console.log(`Starting to convert script at ${url}...`);
}
const converter = `
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
body = converter + "\n" + body;
if (isQX) {
  $done(body);
}else if(isSurge) {
  $done({body});
}
