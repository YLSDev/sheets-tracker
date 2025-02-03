# Artist Sheet Tracker
 Discord Bot to track and post updates for new songs from your trackers

---

## Installation

```bash
git clone https://github.com/YLSDev/sheets-tracker.git
cd .\sheets-tracker\
npm install
```

---

## Configuration

Configuring the bot itself is very simple  `clientId` and `DISCORD_TOKEN` can both be grabbed from [Discord's Developer Portal](https://discord.com/developers/applications) while the rest can be filled in
`ownerIds` takes discord user ids of whoever you want to access the editConfig commands `/update-channel` and `/update-sheet`

```json
{
  "DISCORD_TOKEN": "",
  "GOOGLE_SHEET_KEY": "",
  "GOOGLE_SHEET_NAME": "",
  "DISCORD_CHANNEL_ID": "",
  "clientId": "",
  "ownerIds": [
    ""
  ]
}
```
Example `config.json`

```json
{
  "DISCORD_TOKEN": "MTMzNTY0NjgzMDYzNzIyNDAzNg",
  "GOOGLE_SHEET_KEY": "1rAU0sktd1GKpqo_AAWBtkXy10Px3BB_dnK9yJoN0umw",
  "GOOGLE_SHEET_NAME": "Recent",
  "DISCORD_CHANNEL_ID": "1335362380376313937",
  "clientId": "1335646830637224036",
  "ownerIds": [
    "970421067543871491"
  ]
}
```

---

## Prerequisites

First off i'd recommend setting up these files following the .example. version of them included in the actual repo `artistData.json` and `sheet.json`

## Running

First, Register the slash commands by doing:
```javascript
node deploy.js
```


This command will need to remain running for the bot to function.
*I'd recommend installing a process manager like [PM2](https://discordjs.guide/improving-dev-environment/pm2.html#installation)*


Now you can invite the bot to your server

https://discord.com/oauth2/authorize?client_id=XXX&permissions=8&scope=bot%20applications.commands

*Replace `XXX` with your Bot's ID*

Once the bot is in your server, run the script using:

```javascript
node .
```

---


## Images

![bot_notification](/image.png)

---

## Notes:

This was mainly designed in mind for the carti tracker and specifically the Recent tab
For best usage try following the format of it by copying it directly or edit the parsed info to your preferred situation!

