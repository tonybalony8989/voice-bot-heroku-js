const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", async (oldMember, newMember) => {   
  				// join the correct voice channel 
  let vChannel = bot.channels.get(process.env.VCHANNEL);  
  const connection = await vChannel.join()
     	.catch(console.error)  
	.then(console.log('Connected'))	
	
  connection.on('speaking', (user, speaking) => {
    if (speaking) {
      console.log(`I'm listening to ${user.username}`)
    } else {
      console.log(`I stopped listening to ${user.username}`)
    }
  })	


  	//add ffmpeg build pack https://github.com/jayzes/heroku-buildpack-ffmpeg
	//bot.voiceConnections.map(voiceConnection => console.log(voiceConnection));
});


bot.login(process.env.TOKEN);
