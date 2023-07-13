const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const fetch = require("node-fetch");

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token
const botToken = "6312682029:AAF0vOH0sb2g84uEiNkZi7ZW_0sJAd5aSjs";
const bot = new TelegramBot(botToken, {
  polling: true,
  parse_mode: 'MarkdownV2'
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const imageCaption =
    "Welcome to the Fraxlend Checker Bot!\n/help - Show available commands";

  bot.sendPhoto(
    chatId,
    "https://www.tbstat.com/wp/uploads/2022/09/20220913_FraxFinance3-1200x675.jpg",
    {
      caption: imageCaption,
    }
  );
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Here are the available commands:
/start - Start the bot
/help - Show available commands
/alert - Show Whale Alerts
/whale - Show Whale Lists
/balance {wallet address} - Fetch the frax balance for a wallet address`
  );
});

bot.onText(/\/balance (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const walletAddress = match[1].trim();
  bot.sendMessage(chatId, `🔍 Fetching the balances .....`);

  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x853d955aCEf822Db058eb8505911ED77F175b99e&address=${walletAddress}&tag=latest&apikey=KITA7GXA7YZJQ4VH4H4DE4A91E22HMQMB3`
    );
    const balance = response.data.result;
    const balanceInfrax = balance / 1e18;

    const responses = await axios.get(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0&address=${walletAddress}&tag=latest&apikey=KITA7GXA7YZJQ4VH4H4DE4A91E22HMQMB3`
    );
    const balances = responses.data.result;
    const balanceInfraxs = balances / 1e18;

    const responsess = await axios.get(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x5Ca135cB8527d76e932f34B5145575F9d8cbE08E&address=${walletAddress}&tag=latest&apikey=KITA7GXA7YZJQ4VH4H4DE4A91E22HMQMB3`
    );
    const balancess = responsess.data.result;
    const balanceInfr = balancess / 1e18;

    const respons = await axios.get(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x5E8422345238F34275888049021821E8E08CAa1f&address=${walletAddress}&tag=latest&apikey=KITA7GXA7YZJQ4VH4H4DE4A91E22HMQMB3`
    );
    const balanc = respons.data.result;
    const balan = balanc / 1e18;

    bot
      .sendMessage(
        chatId,
        `🔍 Wallet Address: ${walletAddress}\n\n💰 Balance: ${balanceInfrax} FRAX\n Frax Share Balance: ${balanceInfraxs} FXS \n Frax Price Index: ${balanceInfr} FPI \n Frax Ether Balance: ${balan} frxETH`
      )
      .then(() => {
        // Generate the etherscan.io tokenholdings link
        const etherscanLink =
          "https://etherscan.io/token/0x853d955acef822db058eb8505911ed77f175b99e?a=" +
          walletAddress;

        // Create the button and link markup
        const inlineKeyboard = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "View Token Holdings",
                  url: etherscanLink,
                },
              ],
            ],
          },
        };

        bot.sendMessage(
          chatId,
          "Click the button below to view your token holdings:",
          inlineKeyboard
        );
      })
      .catch((error) => {
        bot.sendMessage(
          chatId,
          "❌ An error occurred while fetching the balance. Please try again later."
        );
      });
  } catch (error) {
    bot.sendMessage(
      chatId,
      "❌ An error occurred while fetching the balance. Please try again later."
    );
  }
});


// Listen for messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Check if the message is a command
  if (msg.text && msg.text.startsWith('/')) {
    // Process the command
    // ...
  } else {
    // Send a reply for invalid commands
    bot.sendMessage(chatId, 'This is not a valid command. Please enter a valid command.( /help for all available commands.)');
  }
});
