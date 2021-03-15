const request = require('request-promise');
const cheerio = require('cheerio');
const notifier = require('node-notifier');
const host = 'https://tw.evga.com';
const urls = [
  'https://tw.evga.com/products/productlist.aspx?type=0&family=GeForce+30+Series+Family'
//   'https://tw.evga.com/products/productlist.aspx?type=10',
];

async function getHtml(urls) {
  try {
    for (let i = 0; i < urls.length; i++) {
      const result = await request.get(urls[i], {
        headers: {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
          Connection: 'keep-alive'
        }
      });
      const $ = cheerio.load(result);

      if ($('.grid-item input[class="btnAddCart"]').length > 0) {
        notifier.notify('有可購買的商品 ' + new Date().toLocaleString());
        $('.grid-item input[class="btnAddCart"]').map((i, ele) => {
          console.log(
            host +
              ele.parentNode.parentNode.parentNode.firstChild.nextSibling
                .firstChild.nextSibling.attribs.href
          );
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function main() {
  setInterval(() => {
    console.log('Get page.');
    getHtml(urls);
  }, 4000);
}

main();
