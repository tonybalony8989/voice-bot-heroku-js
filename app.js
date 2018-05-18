const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", () => {    
  				// join the correct voice channel 
  let vChannel = bot.channels.get(process.env.VCHANNEL);  
   vChannel.join()
   		.then(connection => console.log('Connected'))
  		.catch(console.error);  		
  				//add ffmpeg build pack https://github.com/jayzes/heroku-buildpack-ffmpeg
	//bot.voiceConnections.map(voiceConnection => console.log(voiceConnection));
});

bot.on("guildMemberSpeaking", (member, bool) => { 
	if (bool) {
	let hChannel = bot.channels.get(process.env.TCHANNEL);
var d = new Date();
var year=String(d.getUTCFullYear());
var month=String("0"+(d.getUTCMonth()+1)).slice(-2);
var day=String("0"+d.getUTCDate()).slice(-2);
var hour=String("0"+d.getUTCHours()).slice(-2);
var min=String("0"+d.getUTCMinutes()).slice(-2);
var sec=String("0"+d.getUTCSeconds()).slice(-2);
//[11:22:33]
	
		hChannel.send('`'+year+'-'+month+'-'+day+' ['+hour+':'+min+':'+sec+'] `  '+member.displayName+' 				`'+member.user.id+'` ');	}  
});

bot.on("voiceStateUpdate", (oldMember, newMember) =>{
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel
  let vlChannel = bot.channels.get(process.env.VLCHANNEL);
  let ttsChannel = bot.channels.get(process.env.TTSCHANNEL);
  let trackChannel = bot.channels.get(process.env.TRACKCHANNEL);
//	 console.log(newMember.roles.last().name);
	
	
var d = new Date();
var year=String(d.getUTCFullYear());
var month=String("0"+(d.getUTCMonth()+1)).slice(-2);
var day=String("0"+d.getUTCDate()).slice(-2);
var hour=String("0"+d.getUTCHours()).slice(-2);
var min=String("0"+d.getUTCMinutes()).slice(-2);
var sec=String("0"+d.getUTCSeconds()).slice(-2);
  if (oldUserChannel === undefined) {
  	//user joined channel
  	//vlChannel.send('`'+year+'-'+month+'-'+day+' ['+hour+':'+min+':'+sec+'] `  '+newMember.displayName+'`'+newMember.user.username+'#'+newMember.user.discriminator+'` ***JOINED*** _'+newUserChannel.name+'_');
	vlChannel.send('`'+year+'-'+month+'-'+day+' ['+hour+':'+min+':'+sec+'] `  '+newMember.displayName+'`'+newMember.user.id+'` ***JOINED*** _'+newUserChannel.name+'_');
  	ttsChannel.send(newMember.displayName+' JOINED '+newUserChannel.name.replace(/\s/g, '')+'', { tts: true});
  	if ((newMember.roles.last().name) === "@everyone") {
		trackChannel.send('`'+year+'-'+month+'-'+day+' ['+hour+':'+min+':'+sec+'] `  '+newMember.displayName+'`'+newMember.user.id+'` ***JOINED*** _'+newUserChannel.name+'_');
  	}

	
  }
  else {
		if (newUserChannel === undefined) {
			//user left channel
			vlChannel.send('`'+year+'-'+month+'-'+day+' ['+hour+':'+min+':'+sec+'] `  '+oldMember.displayName+'`'+oldMember.user.id+'` ***LEFT*** _'+oldUserChannel.name+'_');
			ttsChannel.send(oldMember.displayName+' LEFT '+oldUserChannel.name.replace(/\s/g, '')+'', { tts: true});
			}
		else {
			//user switched channel
			if (newUserChannel!=oldUserChannel) {
				vlChannel.send('`'+year+'-'+month+'-'+day+' ['+hour+':'+min+':'+sec+'] `  '+oldMember.displayName+'`'+oldMember.user.id+'` ***SWITCHED*** _'+oldUserChannel.name+'_ to _'+newUserChannel.name+'_');
				ttsChannel.send(oldMember.displayName+' SWITCHED '+oldUserChannel.name.replace(/\s/g, '')+' to '+newUserChannel.name.replace(/\s/g, '')+'', { tts: true});
				//str = str.replace(/\s/g, '');
				//something something
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
	  setTimeout(function() {console.log('Wait 5 seconds');}, 5000);
   vChannel.join()
   		.then(connection => console.log('Connected - manual. User ID= '+message.author.id))
  		.catch(console.error);   
  	 }
});
bot.on('disconnect', function(msg, code) {
    if (code === 0) return console.error(msg);
	console.log('disconnect - reconnect attempt');
    bot.connect();
});


bot.login(process.env.TOKEN);
