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
	//console.log(`${member.displayName} ${speaking.has(1)} ${speaking.has(2)} ${speaking.has(3)} ${speaking.has(4)} ${speaking.has(5)} ${speaking.has(6)} ${speaking.has(7)}`);
	if (speaking.has(1)) {
	let hChannel = bot.channels.get(process.env.TCHANNEL);	
	hChannel.send(BotDate()+member.displayName+' 				`'+member.user.id+'` ');	
	}  
});


bot.on("voiceStateUpdate", (oldState, newState) =>{
	//crash here on user d/c    
  let vlChannel = bot.channels.get(process.env.VLCHANNEL);
  let ttsChannel = bot.channels.get(process.env.TTSCHANNEL);
  let trackChannel = bot.channels.get(process.env.TRACKCHANNEL);
  let hChannel = bot.channels.get(process.env.TCHANNEL);	
	
  if (newState.channel !== null) {
	let newUserChannel = newState.channel.name;
	let newName = newState.member.displayName;
	let newID = newState.member.id;
  }
  if (oldState.channel !== null) {
	let oldUserChannel = oldState.channel.name;
	let oldName = oldState.member.displayName;
	let oldID = oldState.member.id;    
  }
	
  if (oldState.channel === null) {  	//user joined channel  	
	let newUserChannel = newState.channel.name;
	let newName = newState.member.displayName;
	let newID = newState.member.id;
	vlChannel.send(BotDate()+newName+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_');
	hChannel.send(BotDate()+newName+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_');	  
  	ttsChannel.send(newMember.newName+' JOINED '+newUserChannel.name.replace(/\s/g, '')+'', { tts: true});
		// 	if ((newState.member.roles.last().name) === "@everyone") {
		//		trackChannel.send(BotDate()+newName+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_');
		// 	}
		// check out .highest  https://discord.js.org/#/docs/main/master/class/GuildMemberRoleStore
  }
  else {		
		if (newState.channel === null) {	//user left channel
			vlChannel.send(BotDate()+oldName+'`'+oldID+'` ***LEFT*** _'+oldUserChannel+'_');
			hChannel.send(BotDate()+oldName+'`'+oldID+'` ***LEFT*** _'+oldUserChannel+'_');
			ttsChannel.send(oldName+' LEFT '+oldUserChannel.replace(/\s/g, '')+'', { tts: true});
			}
		else {	//user switched channel
			if (newUserChannel != oldUserChannel) {
				vlChannel.send(BotDate()+oldName+'`'+oldID+'` ***SWITCHED*** _'+oldUserChannel+'_ to _'+newUserChannel+'_');
				hChannel.send(BotDate()+oldName+'`'+oldID+'` ***SWITCHED*** _'+oldUserChannel+'_ to _'+newUserChannel+'_');
				ttsChannel.send(oldName+' SWITCHED '+oldUserChannel.replace(/\s/g, '')+' to '+newUserChannel.replace(/\s/g, '')+'', { tts: true});
				//str = str.replace(/\s/g, '');
				}
			}
  }		
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


function BotDate() {
	var d = new Date();
	var year=String(d.getUTCFullYear());
	var month=String("0"+(d.getUTCMonth()+1)).slice(-2);
	var day=String("0"+d.getUTCDate()).slice(-2);
	var hour=String("0"+d.getUTCHours()).slice(-2);
	var min=String("0"+d.getUTCMinutes()).slice(-2);
	var sec=String("0"+d.getUTCSeconds()).slice(-2); //[11:22:33]
return('`'+year+'-'+month+'-'+day+' ['+hour+':'+min+':'+sec+'] `  ')
}
