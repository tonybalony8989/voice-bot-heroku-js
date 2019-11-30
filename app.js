const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", () => {      				// join the correct voice channel 
  let vChannel = bot.channels.get(process.env.VCHANNEL);  
   vChannel.join()
     	.catch(console.error)  
	.then(connection => console.log('Connected'))	
  	//add ffmpeg build pack https://github.com/jayzes/heroku-buildpack-ffmpeg
	//bot.voiceConnections.map(voiceConnection => console.log(voiceConnection));
});

bot.on("guildMemberSpeaking", (member, speaking) => { 
	console.log(`${speaking.FLAGS} ${speaking.has}`);
	if (speaking) {
	let hChannel = bot.channels.get(process.env.TCHANNEL);	
	hChannel.send(Botdatestring()+member.displayName+' 				`'+member.user.id+'` ');	
	}  
});

bot.on("voiceStateUpdate", (oldState, newState) =>{
  
  console.log(`${Botdatestring()} ${newState.id} ${newState.channel}`);
});

bot.on("message", async message => {
  			//try triggering on a different event and using client.voiceConnections property https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=voiceConnections
  if(message.author.bot) return;
	//only accept commands from within a guild (not DM or groupDM) message.member is null for the former two  
  if(message.member===null) return;
	//console.log(message.member);
  		
  if((message.content === "z join fleet voice please") && ((message.member.roles.last().name) !== "@everyone") ) {
  	// join the correct voice channel 
	  
  let vChannel = bot.channels.get(process.env.VCHANNEL);  
   vChannel.leave(); 
   console.log('Left channel - Wait 5 seconds');
	  setTimeout(function() {
	vChannel.join()
   		.then(connection => console.log('Connected - manual. '+message.author.username+' User ID= '+message.author.id))
  		.catch(console.error);   
	  }, 5000);
   
  	 }
});
bot.on('disconnect', function(msg, code) {
    if (code === 0) return console.error(msg);
	console.log('disconnect - reconnect attempt');
    bot.connect();
});


bot.login(process.env.TOKEN);

function Botdatestring() {
var d = new Date();
var year=String(d.getUTCFullYear());
var month=String("0"+(d.getUTCMonth()+1)).slice(-2);
var day=String("0"+d.getUTCDate()).slice(-2);
var hour=String("0"+d.getUTCHours()).slice(-2);
var min=String("0"+d.getUTCMinutes()).slice(-2);
var sec=String("0"+d.getUTCSeconds()).slice(-2); //[11:22:33]
return('`'+year+'-'+month+'-'+day+' ['+hour+':'+min+':'+sec+'] `  ')
}
