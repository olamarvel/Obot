const fetch = require('node-fetch');

async function newsTread(url, sendHelpSuport, message, formatNews,chat) {
  const result = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (result.status !== 200) {
    sendHelpSuport(message);
    return;
  }
  let json = await result.json();
  json = json.map(formatNews);
  // console.log(json)
  let articles = await Promise.allSettled(json);
  articles.forEach(({ value }) => {
    if (!value)
      return;
    const { image, body } = value;
    console.log(image, body);
    chat.sendMessage(image, { caption: body });
  });
  console.log('done');
}
exports.newsTread = newsTread;
