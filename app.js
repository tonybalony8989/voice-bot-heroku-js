const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", () => {    
  				// join the correct voice channel 
  let vChannel = bot.channels.get(process.env.VCHANNEL);  
   vChannel.join()
     	.catch(console.error)  
	.then(connection => console.log('Connected'))	
	

//	.then(connection => console.log('Connected'))	
  	//add ffmpeg build pack https://github.com/jayzes/heroku-buildpack-ffmpeg
	//bot.voiceConnections.map(voiceConnection => console.log(voiceConnection));
});

bot.on('presenceUpdate', async (oldMember, newMember) => {
  console.log('Presence:', newMember.presence)

  if (!newMember.presence || !newMember.presence.game || !newMember.voiceChannel) {
    return
  }

  const connection = await newMember.voiceChannel.join()

  connection.on('speaking', (user, speaking) => {
    if (speaking) {
      console.log(`I'm listening to ${user.username}`)
    } else {
      console.log(`I stopped listening to ${user.username}`)
    }
  })
})

bot.login(process.env.TOKEN);
