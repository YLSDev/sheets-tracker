const { DISCORD_TOKEN, GOOGLE_SHEET_KEY, GOOGLE_SHEET_NAME, GOOGLE_SHEET_GID, DISCORD_CHANNEL_ID} = require('./config.json');
const { songEraColors, songEraIcons } = require('./artistData.json');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const PublicGoogleSheetsParser = require('public-google-sheets-parser')


const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
const getItems = async () =>{
    try {
      const spreadsheetId = GOOGLE_SHEET_KEY.trim();
      const sheetInfo = { sheetName: GOOGLE_SHEET_NAME, useFormat: true };
      const parser = new PublicGoogleSheetsParser(spreadsheetId, sheetInfo);
  
      const items = await parser.parse();
  
      return items; 
    } catch (error) {
      console.error('Error parsing the spreadsheet:', error);
    }
  };
  

client.once(Events.ClientReady, async readyClient => {
    console.log(`Tracking sheet "${GOOGLE_SHEET_KEY}, Logged in as ${readyClient.user.tag}`);
    
    setInterval(async () => {
        console.log('checking sheet');
        
        try {
            const items = await getItems();
            await fs.readFile('./sheet.json', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                let jsonData = JSON.parse(data);
                let sheetItems = items
                if (JSON.stringify(sheetItems[0]) != JSON.stringify(jsonData[0])) {
                    console.log("found uncached row")
                    let songInfo = sheetItems[0];
                    let songName = songInfo.Name;
                    let songEra = songInfo.Era;
                    let songNotes = songInfo.Notes;
                    let songLeakDate = songInfo["Leak Date"];
                    let songQuality = songInfo.Quality;
                    let songType = songInfo.Type;
                    let songAv = songInfo["Available Length"];
                    let songLinks = songInfo["Link(s)"];

                    jsonData = sheetItems;
                    let updatedJsonData = JSON.stringify(jsonData, null, 2);
                    fs.writeFile('./sheet.json', updatedJsonData, 'utf8', (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log('Cached sheet updated');
                    });
                    console.log("building embed")
                    const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `New Song/Snippet`,
                    })
                    .setTitle(`${songName}`)
                    .setDescription(`## Era: **${songEra}**\n\nSong Description:\n${songNotes}`)
                    .addFields(
                        {
                        name: `Misc Info`,
                        value: `Leak Date: ${songLeakDate}\nType: ${songType}\nAvailable Length: ${songAv}\nQuality: ${songQuality}`,
                        inline: false
                        },
                        {
                        name: `Link(s)`,
                        value: `${songLinks}`,
                        inline: false
                        },
                    )
                    .setThumbnail(`${songEraIcons[songEra] ?? "https://exmaplefhuefhfuoiheiuhefou.com"}`)
                    .setColor(`${songEraColors[songEra] ?? "#000000"}`)
                    .setTimestamp();
                    const channel = client.channels.cache.get(DISCORD_CHANNEL_ID);
                    if (channel) {
                        channel.send({ embeds: [embed] });
                    }
                } else {
                    console.log("no new songs found")
                }
            });
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }, 30000);
});
  


  
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.login(DISCORD_TOKEN);