const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", () => {    
  				// join the correct voice channel 
  let vChannel = bot.channels.get(process.env.VCHANNEL);  
   vChannel.join()
     	.catch(console.error)  
 		.then(async function(connection) {
		        connection.on('speaking', (user, speaking) => {
				console.log(`Speaking ${user.username}`)
				if (!speaking){ 
					return
					}
				})		
		})		
//	.then(connection => console.log('Connected'))	
  	//add ffmpeg build pack https://github.com/jayzes/heroku-buildpack-ffmpeg
	//bot.voiceConnections.map(voiceConnection => console.log(voiceConnection));
});



bot.login(process.env.TOKEN);
