const Discord = require("discord.js");
const bot = new Discord.Client();

var opusscript = require("opusscript");
// 48kHz sampling rate, 20ms frame duration, stereo audio (2 channels)
var samplingRate = 48000;
var frameDuration = 20;
var channels = 2;
// Optimize encoding for audio. Available applications are VOIP, AUDIO, and RESTRICTED_LOWDELAY
var encoder = new opusscript(samplingRate, channels, opusscript.Application.AUDIO);
var frameSize = samplingRate * frameDuration / 1000;
// Get PCM data from somewhere and encode it into opus
var pcmData = new Buffer(pcmSource);
var encodedPacket = encoder.encode(pcmData, frameSize);
// Decode the opus packet back into PCM
var decodedPacket = encoder.decode(encodedPacket);



bot.on("ready", () => {      				// join the correct voice channel 
  let vChannel = bot.channels.get(process.env.VCHANNEL);  
   vChannel.join()
     	.catch(console.error)  
	 		.then(async function(connection) {
		        connection.on('speaking', (user, speaking) => {
					console.log(`${user.username} ${speaking.has(1)} ${speaking.has(2)} ${speaking.has(3)} ${speaking.has(4)} ${speaking.has(5)} ${speaking.has(6)} ${speaking.has(7)}`);
					if (speaking.has(1)) {
						let hChannel = bot.channels.get(process.env.TCHANNEL);	
						hChannel.send(BotDate()+member.displayName+' 				`'+member.user.id+'` ');	
					} 
				})		
		})		
	//.then(connection => {console.log('Connected');
  	//add ffmpeg build pack https://github.com/jayzes/heroku-buildpack-ffmpeg
	//add node-opus build pack https://github.com/Rantanen/node-opus.git
});

// bot.on("guildMemberSpeaking", (member, speaking) => { 
//	console.log(`${member.displayName} ${speaking.has(1)} ${speaking.has(2)} ${speaking.has(3)} ${speaking.has(4)} ${speaking.has(5)} ${speaking.has(6)} ${speaking.has(7)}`);
	// if (speaking.has(1)) {
	// let hChannel = bot.channels.get(process.env.TCHANNEL);	
	// hChannel.send(BotDate()+member.displayName+' 				`'+member.user.id+'` ');	
	// }  
// });

bot.on("voiceStateUpdate", (oldState, newState) =>{
  //console.log(`${oldState.channel} ${newState.channel}`);
  //console.log(`${newState.member.roles.highest.name}`);
  let vlChannel = bot.channels.get(process.env.VLCHANNEL);
  let ttsChannel = bot.channels.get(process.env.TTSCHANNEL);
  let trackChannel = bot.channels.get(process.env.TRACKCHANNEL);
  let hChannel = bot.channels.get(process.env.TCHANNEL);	
  let newName=null; let newID=null; let newUserChannel=null;
  let oldName=null; let oldID=null; let oldUserChannel=null;
  
  if (newState.channel != null) { //console.log("new");
	newUserChannel = newState.channel.name;
	newName = newState.member.displayName;
	newID = newState.member.id;
  }
  if (oldState.channel !== null) { //console.log("old");
	oldUserChannel = oldState.channel.name;
	oldName = oldState.member.displayName;
	oldID = oldState.member.id;    
  }

  if (oldState.channel === null) {  	//user joined channel  	
	vlChannel.send(BotDate()+newName+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_');
	hChannel.send(BotDate()+newName+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_');	  
  	ttsChannel.send(newName+' JOINED '+newUserChannel.replace(/\s/g, '')+'', { tts: true});
		 	if (newState.member.roles.highest.name == "@everyone") {
				trackChannel.send(BotDate()+newName+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_');
		 	}		
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
  if(message.author.bot) return;	//only accept commands from within a guild (not DM or groupDM) message.member is null for the former two  
  if(message.member===null) return;	//console.log(message.member);  		
  if((message.content === "z join fleet voice please") && ((message.member.roles.highest.name) != "@everyone") ) {
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
