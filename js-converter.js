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
let qx=null!=$task,sg=null!=$httpClient,ln=null!=$loon;var $task=qx?$task:{},$httpClient=sg?$httpClient:{},$prefs=qx?$prefs:{},$persistentStore=sg?$persistentStore:{},$notify=qx?$notify:{},$notification=sg?$notification:{};if(qx){var errorInfo={error:""};$httpClient={get:(t,o)=>{var r;r="string"==typeof t?{url:t}:t,$task.fetch(r).then(t=>{o(void 0,t,t.body)},t=>{errorInfo.error=t.error,o(errorInfo,response,"")})},post:(t,o)=>{var r;r="string"==typeof t?{url:t}:t,t.method="POST",$task.fetch(r).then(t=>{o(void 0,t,t.body)},t=>{errorInfo.error=t.error,o(errorInfo,response,"")})}}}sg&&($task={fetch:t=>new Promise((o,r)=>{"POST"==t.method?$httpClient.post(t,(t,r,e)=>{r?(r.body=e,o(r,{error:t})):o(null,{error:t})}):$httpClient.get(t,(t,r,e)=>{r?(r.body=e,o(r,{error:t})):o(null,{error:t})})})}),qx&&($persistentStore={read:t=>$prefs.valueForKey(t),write:(t,o)=>$prefs.setValueForKey(t,o)}),sg&&($prefs={valueForKey:t=>$persistentStore.read(t),setValueForKey:(t,o)=>$persistentStore.write(t,o)}),qx&&($notify=(t=>(function(o,r,e,n){t(o,r,e=void 0===n?e:`${e}\n点击链接跳转: ${n}`)}))($notify),$notification={post:(t,o,r,e)=>{$notify(t,o,r=void 0===e?r:`${r}\n点击链接跳转: ${e}`)}}),sg&&!ln&&($notification.post=(t=>(function(o,r,e,n){t(o,r,e=void 0===n?e:`${e}\n点击链接跳转: ${n}`)}))($notification.post),$notify=((t,o,r,e)=>{r=void 0===e?r:`${r}\n点击链接跳转: ${e}`,$notification.post(t,o,r)})),ln&&($notify=((t,o,r,e)=>{$notification.post(t,o,r,e)}));
/******************** 转换器 ********************/
`;
body = converter + "\n" + String(body);

$done({body});
if (verbose) {
    console.log("转换成功");
}
