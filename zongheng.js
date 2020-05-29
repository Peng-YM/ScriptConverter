/**
 *  @author: Peng-YM
 *  更新地址: https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/zongheng.js
 *  使用方法：进入纵横小说页面，例如<<剑来>>：http://book.zongheng.com/book/672340.html 则id为672340，将id添加到列表即可。
 */

// 书籍id列表
const ids = [408586];

/********************************* SCRIPT START *******************************************************/
const DB_KEY = "zongheng_books";
const parsers = {
  title: new RegExp(/bookname=(\S+)/, "i"),
  latestChapter: new RegExp(/class="tit"><a[^>]*>([^<]*)/, "i"),
  updateCount: new RegExp(/(今日更新[\d]+章)/, "i"),
};
// load books from database
let books = $prefs.valueForKey(DB_KEY);
if (books === "" || books === undefined) {
  books = {};
} else {
  books = JSON.parse(books);
}
// check update
checkUpdate(books);

async function checkUpdate(books) {
  await Promise.all(
    ids.map(async (id) => {
      // check update from each book
      let config = {
        url: `http://book.zongheng.com/book/${id}.html`,
headers: {
"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36"
}
      };

      await $task
        .fetch(config)
        .then((response) => {
          html = response.body;
          // parse html
          title = html.match(parsers.title)[1];
          updateCount = html.match(parsers.updateCount)[1];
          latestChapter = html.match(parsers.latestChapter)[1];

          //console.log(`title: ${title}, latest chapter: ${latestChapter}, ${updateCount}`);

          book = books[id];
          if (book === undefined || latestChapter !== book.latestChapter) {
            // upate database
            books[id] = { title, updateCount, latestChapter };
            // push notifications
            $notify(title, "", `最新章节: ${latestChapter}\n${updateCount}`);
          }
          return Promise.resolve();
        })
        .catch((e) => console.log(e));
    })
  );

  // update database
  $prefs.setValueForKey(JSON.stringify(books), DB_KEY);
}

$done();
/********************************* SCRIPT END *******************************************************/
