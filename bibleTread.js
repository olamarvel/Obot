const fetch = require('node-fetch');

async function bibleTread(url, sendHelpSuport, message, formatBible, commands,chat) {
  const bible = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (bible.status !== 200) {
    sendHelpSuport(message);
    return;
  }
  let bibleJson = await bible.text();
  bibleJson = formatBible(...commands, bibleJson);
  chat.sendMessage(bibleJson);
}
exports.bibleTread = bibleTread;
