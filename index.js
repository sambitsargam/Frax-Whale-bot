const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const cron = require('node-cron');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token
const botToken = "";
const bot = new TelegramBot(botToken, {
  polling: true,
  parse_mode: 'MarkdownV2'
});

const firebaseUrl = 'https://';
const fetchurl = 'https://';

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const imageCaption =
    "Welcome to the Fraxlend Whale Tracker Bot!\n/help - Show available commands";

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
/alert - Setup Whale Alerts
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

// Handle the /whale command
bot.onText(/\/whale/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      force_reply: true // Enable reply markup to force a reply from the user
    }
  };

  bot.sendMessage(chatId, 'How many Whales You wanted Check:', options)
    .then(sentMessage => {
      const messageId = sentMessage.message_id;
      bot.onReplyToMessage(chatId, messageId, (reply) => {
        const limit = parseInt(reply.text);
        // Call the API to fetch top holders
        fetchTopHolders(chatId, limit);
      });
    });
});

// Function to fetch top holders
function fetchTopHolders(chatId, limit) {
  const options = {
   
  };

  axios
    .request(options)
    .then(function (response) {
      const holders = response.data.data;
      // Process the holders data
      const message = formatHoldersData(holders);
      bot.sendMessage(chatId, message);
    })
    .catch(function (error) {
      console.error(error);
      bot.sendMessage(chatId, 'Failed to fetch top holders.');
    });
}

// Function to format holders data
function formatHoldersData(holders) {
  let message = 'Top Holders:\n\n';

  for (let i = 0; i < holders.length; i++) {
    const holder = holders[i];
    const rank = i + 1;
    const walletAddress = holder.wallet_address;
    const amount = holder.amount;
    const usdValue = holder.usd_value;
    const usdValu = usdValue / 1e18;

    message += `Rank: ${rank}\n`;
    message += `Wallet Address: ${walletAddress}\n`;
    message += `Amount: ${amount} FRAX\n`;
    message += `USD Value: ${usdValu} USD\n\n`;
  }

  return message;
}


// Handle the /alert command
bot.onText(/\/alert/, (msg) => {
  const chatId = msg.chat.id;

  // Save the chat ID to Firebase Realtime Database
  saveChatId(chatId)
    .then(() => {
      bot.sendMessage(chatId, 'Chat ID saved successfully for alerts.');
    })
    .catch((error) => {
      console.error(error);
      bot.sendMessage(chatId, 'Failed to save Chat ID for alerts.');
    });
});

// Function to save chat ID to Firebase Realtime Database
function saveChatId(chatId) {
  const url = `${firebaseUrl}`;
  return axios
    .get(url)
    .then((response) => {
      let chatIds = response.data?.id?.chatIds;

      if (!chatIds) {
        chatIds = []; // Create an empty array if no chat IDs exist
      } else if (Array.isArray(chatIds)) {
        chatIds = chatIds.flat(); // Flatten the array and remove nested arrays
      } else {
        chatIds = [chatIds]; // Wrap the value in an array
      }

      chatIds.push(chatId); // Add the new chat ID to the array

      const data = {
        id: {
          chatIds: chatIds
        }
      };

      const options = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      return axios.put(url, data, options);
    });
}


// Define the cron schedule to run every 2 minutes
const cronSchedule = '*/2 * * * *';

// Function to fetch data and send message if value is greater than 1000000
function fetchDataAndSendMessage() {
  const fromTimestamp = Math.floor((Date.now() - 119000) / 1000); // Calculate the from_timestamp

  const options = {
    method: 'GET',
    
  axios
  .request(options)
  .then(function (response) {
    const transfers = response.data.data;
    // Check if the value is greater than 1000000
    if (transfers && transfers.length > 0) {
      transfers.forEach((transfer) => {
        const valuee = transfer.value;
        if (valuee > 9999000000000000000000) {
          sendAlertMessage(transfer);
        }
      });
    }
  })
  .catch(function (error) {
    console.error(error);
  });
}

// Function to send alert message to all chat IDs
function sendAlertMessage(transfer) {
  axios
    .get(`${fetchurl}`)
    .then(function (response) {
      const chatIds = response.data;

      if (Array.isArray(chatIds)) {
        const message = `ALERT: Value greater than 10000 FRAX\n\nTransfer details:\nValue: ${transfer.value / 1e18} FRAX\nFrom: ${transfer.from_address}\nTo: ${transfer.to_address}\n\nhttps://etherscan.io/tx/${transfer.transaction_hash}`;

        chatIds.forEach((chatId) => {
          sendMessage(chatId, message);
        });
      } else {
        console.error('Invalid chat IDs structure.');
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

// Function to send message to a chat ID
function sendMessage(chatId, message) {
  bot
    .sendMessage(chatId, message)
    .catch((error) => {
      console.error(`Failed to send message to chat ID ${chatId}: ${error.message}`);
    });
}


// Schedule the cron job
cron.schedule(cronSchedule, fetchDataAndSendMessage);
// Listen for messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Check if the message is a command
  if (msg.text && msg.text.startsWith('/')) {
    // Process the command
    // ...
  } 
  else if (msg = Number) {
    // No problem
  }
  else {
    // Send a reply for invalid commands
    bot.sendMessage(chatId, 'This is not a valid command. Please enter a valid command.( /help for all available commands.)');
  }
});
