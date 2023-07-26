## Fraxlend Whale Tracker Bot

The **Fraxlend Whale Tracker Bot** is a Telegram bot designed to provide users with various functionalities related to tracking Fraxlend transactions, balances, and whale alerts. The bot leverages the Telegram API, node-telegram-bot-api library, Axios for API requests, and node-cron for scheduling tasks.

### Features:

1. **Start Command**:
   Upon receiving the `/start` command, the bot welcomes the user with an image and displays available commands with the `/help` command.

1. **Help Command**:
   The `/help` command displays all available commands that users can use with the bot. It provides a list of commands and their functionalities.

1. **Balance Command**:
   The `/balance {wallet address}` command allows users to fetch the Frax balance for a specific wallet address in both Ethereum and Polygon networks. The bot fetches the balances by making API calls to Etherscan and Polygonscan and sends the details to the user.

1. **Whale Command**:
   The `/whale` command prompts the user to enter the number of top Fraxlend holders they want to check. Once the user provides the limit, the bot calls the API to fetch the top holders' data and formats it to display the rank, wallet address, amount of FRAX held, and USD value.

1. **Alert Command**:
   The `/alert` command allows users to set up whale alerts. When a user sets up an alert, the bot saves their chat ID to  Database. The bot also fetches data every minute using a cron job and sends an alert message to all saved chat IDs if the transferred value is greater than 10000 FRAX.

1. **Fetch Data and Send Message (Cron Job)**:
   The bot uses a cron job to periodically fetch data from the API and sends alert messages to all saved chat IDs if the transferred value is greater than 10000 FRAX.

### How it works:

- Users interact with the bot using various commands.
- The bot fetches data from external APIs to provide the requested information.
- For whale alerts, the bot saves user chat IDs to Database.
- The bot schedules a cron job to periodically fetch data and send alert messages to all saved chat IDs.

## Demo Link
[https://t.me/fraxwhalebot
](https://t.me/fraxwhalebot)

## Demo Video
![youtube](https://www.youtube.com/watch?v=3QK7n3oUii0&ab_channel=SambitSargamEkalabya)


![youtube](https://www.youtube.com/watch?v=Ukx-3hkyO3A&ab_channel=SambitSargamEkalabya)
