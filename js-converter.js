// 是否开启输出
const verbose = true;
const url = $request.url;
let body = $response.body;
isSurge = body.indexOf("$httpClient") != -1;
isQX = body.indexOf("$task") != -1;
if ((!isSurge && !isQX) || (isSurge && isQX)) {
 $done({body});
}
if (verbose) {
  console.log(`开始转换${isQX? "QX" : "Surge"}格式的脚本： ${url}...`);
}
let converter = `
/******************** 转换器 ********************/
let q=null!=$task,s=null!=$httpClient;var $task=q?$task:{},$httpClient=s?$httpClient:{},$prefs=q?$prefs:{},$persistentStore=s?$persistentStore:{},$notify=q?$notify:{},$notification=s?$notification:{};if(q){var errorInfo={error:""};$httpClient={get:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})},post:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,t.method="POST",$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})}}}s&&($task={fetch:t=>new Promise((r,e)=>{"POST"==t.method?$httpClient.post(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})}):$httpClient.get(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})})})}),q&&($persistentStore={read:t=>$prefs.valueForKey(t),write:(t,r)=>$prefs.setValueForKey(t,r)}),s&&($prefs={valueForKey:t=>$persistentStore.read(t),setValueForKey:(t,r)=>$persistentStore.write(t,r)}),q&&($notification={post:(t,r,e)=>{$notify(t,r,e)}}),s&&($notify=function(t,r,e){$notification.post(t,r,e)});
/******************** 转换器 ********************/
`;
body = converter + "\n" + String(body);

$done({body});
if (verbose) {
    console.log("转换成功");
}
