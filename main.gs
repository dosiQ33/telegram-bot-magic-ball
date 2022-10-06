var token = "1425914864:AAEFcEKs5RrxJY--------------------A";
var telegramAppUrl = "https://api.telegram.org/bot" + token;
 var webAppUrl = "https://script.google.com/macros/s/AKfycbxATxw_TLv8S1K3---------------------17aua2Lh-ZL1XE/exec";
// var webAppUrl = "https://script.google.com/macros/s/AKfycbzWiwb9-t5a4gYou5Qzd0p--------------------HwD0YAAqijwsv/exec";
var sheetId = "1zgffa9Uo276tJPw-M_k-ubIMeTTUAbqA----------";
var users_sheet = SpreadsheetApp.openById(sheetId).getSheetByName("users");
var users_list = users_sheet.getRange(2, 1, users_sheet.getLastRow()).getValues().toString();
var telegram_id_list = users_sheet.getRange(2, 1, users_sheet.getLastRow()).getValues().toString(); // in case of if add .split(",") to get list
var en_pred = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Yes — definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Signs point to yes', 'Yes', 'Reply hazy, try again', 'Cannot predict now', 'Concentrate and ask again', 'Don’t count on it', 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful'];
var ru_pred = ['Бесспорно', 'Никаких сомнений', 'Определённо да', 'Можешь быть уверен в этом', 'Мне кажется — «да»', 'Вероятнее всего','Знаки говорят — «да»', 'Да', 'Пока не ясно', 'Мой ответ — «нет»', 'По моим данным — «нет»', 'Перспективы не очень хорошие', 'Весьма сомнительно', 'Нет'];
var kz_pred = ['Даусыз', 'Алдын ала анықталып қойған', 'Еш күмәнсіз', 'Әлбетте, иә!', 'Еш күмәнданба', 'Менің ойымша – иә', 'Бәлкім солай шығар', 'Жақсы келешек көріп тұрмын', 'Белгілер «иә» дейді', 'Иә', 'Әзірге белгісіз', 'Кейінірек сұра', 'Бұл туралы ештеңе айтпай-ақ қояйын', 'Қазір болжау мүмкін емес', 'Ол туралы ойланба да', 'Менің жауабым – Жоқ', 'Мендегі ақпараттарға сүйенсек – Жоқ', 'Онша жақсы ештеңе көріп тұрған жоқпын', 'Аса сенімсіз', 'Жоқ', 'Данышпандар күте тұрсын дейді', 'Мүмкін', 'Тек алға!', 'Менің саған айтар кеңесім: КЕРЕК ЕМЕС', 'Әрине'];


function setWebhook() {
  var url = telegramAppUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function sendMessage(chatId, text, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

var language_keyboard = {
  "inline_keyboard": [
    [{
      "text": "🇬🇧",
      'callback_data': 'en'
    }, {
      "text": "🇷🇺",
      'callback_data': 'ru'
    }]
  ]
};


function sendChatAction(chatId) {
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendChatAction?chat_id=' + chatId + '&action=typing');
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);

  if (contents.callback_query) {
    var id_call = contents.callback_query.from.id;
    var message_id = contents.callback_query.message.message_id;
    var chat_id = contents.callback_query.message.chat.id;
    var data = contents.callback_query.data;
    if (data == 'ru') {
      sendMessage(id_call, 'Язык изменён.');
      users_sheet.getRange(users_list.split(",").indexOf(chat_id.toString()) + 2, 3).setValue('ru');
    } else if (data == 'en') {
      sendMessage(id_call, 'The language is changed.');
      users_sheet.getRange(users_list.split(",").indexOf(chat_id.toString()) + 2, 3).setValue('en');
    } else if (data == 'kz') {
      sendMessage(id_call, 'Тіл өзгертілді.');
      users_sheet.getRange(users_list.split(",").indexOf(chat_id.toString()) + 2, 3).setValue('kz');
    }
  } else if (contents.message) {
    var id = contents.message.from.id;
    var first_name = contents.message.from.first_name;
    var language_code = contents.message.from.language_code;
    var text = contents.message.text;
    var dateNow = new Date;
    var reformatedDate = dateNow.getDate() + '/' + (dateNow.getMonth() + 1) + '/' + dateNow.getFullYear() + ' ' + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds();
    if (!telegram_id_list.split(",").includes(id.toString())) {
      if (language_code == null) {
        users_sheet.appendRow([id, first_name, 'ru']);
      } else {
        users_sheet.appendRow([id, first_name, language_code]);
      }
    }
    if (text == '/start') {
      sendMessage(id, 'Задайте свой вопрос :)');
    } else if (text == '/language') {
      sendMessage(id, '🛠 Language/Тіл/Язык', language_keyboard);
      //            return (users_sheet.getRange(users_list.split(",").indexOf(id.toString()) + 2, 4).setValue(0));
    } else {
      var answerLanguage = users_sheet.getRange(users_list.split(",").indexOf(id.toString()) + 2, 3).getValue();
      if (answerLanguage == 'ru') {
        var randomAnswer = ru_pred[Math.floor(Math.random() * ru_pred.length)];
      } else if (answerLanguage == 'en') {
        var randomAnswer = en_pred[Math.floor(Math.random() * en_pred.length)];
      } else if (answerLanguage == 'kz') {
        var randomAnswer = kz_pred[Math.floor(Math.random() * kz_pred.length)];
      }

      var randomTimeWait = Math.floor(Math.random() * 2500) + 500;
      sendChatAction(id);
      Utilities.sleep(randomTimeWait);
      sendMessage(id, randomAnswer);
    }
  }
}
