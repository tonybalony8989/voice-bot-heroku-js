const Discord = require('discord.js');
const bot = new Discord.Client();
//https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
//	https://elements.heroku.com/buildpacks/dubsmash/heroku-buildpack-opus 
//* https://github.com/jayzes/heroku-buildpack-ffmpeg
//* https://github.com/codeinteger6/heroku-buildpack-libopus 
//or https://github.com/Crazycatz00/heroku-buildpack-libopus.git
var chats = 1; //tracking chat occurances
var lastChats = 0; //tracking of chat occurances
var lastRejoin = new Date('2010/01/05 10:11:12');
var VCconn = null;

bot.on('ready', async () => {      				// join the correct voice channel 
  let vChannel = bot.channels.get(process.env.VCHANNEL);  
   await VCconn = vChannel.join()
			.catch(console.error)  	
			.then(connection => { BotConn(connection, ":boom: new voice connection", true)
			    })  	
});

bot.on('guildMemberSpeaking', (member, speaking) => { 
	//console.log(`${member.displayName} ${speaking.has(1)}`);
	if (speaking.has(1)) {
	let hChannel = bot.channels.get(process.env.TCHANNEL);	
	hChannel.send(BotDate()+member.displayName+' 				`'+member.user.id+'` ');	
	chats=chats+1;
	}  
	//something to modify output when member.permissions.has(9) for priority speaker  :mega: or :loudspeaker:
});

bot.on('voiceStateUpdate', (oldState, newState) =>{
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
	vlChannel.send(BotDate()+newName+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_ :white_check_mark:');
	hChannel.send(BotDate()+newName+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_ :white_check_mark:');	  
  	ttsChannel.send(newName+' JOINED '+newUserChannel.replace(/\s/g, '')+'', { tts: true});
		 	if (newState.member.roles.highest.name == "@everyone") {
				trackChannel.send(BotDate()+newName+'<@'+newID+'> ***JOINED*** _'+newUserChannel+'_ :white_check_mark:');
		 	}		
  }
  else {		
		if (newState.channel === null) {	//user left channel
			vlChannel.send(BotDate()+oldName+'`'+oldID+'` ***LEFT*** _'+oldUserChannel+'_ :stop_sign:');
			hChannel.send(BotDate()+oldName+'`'+oldID+'` ***LEFT*** _'+oldUserChannel+'_ :stop_sign:');
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
bot.on('message', async message => {
  if(message.author.bot) return;	//only accept commands from within a guild (not DM or groupDM) message.member is null for the former two  
  if(message.member===null) return;	//console.log(message.member);  		
  if((message.content === "z join fleet voice please") && ((message.member.roles.highest.name) != "@everyone") ) {
  	// join the correct voice channel 	  
	let vChannel = bot.channels.get(process.env.VCHANNEL);  
	vChannel.leave()
	console.log('Left channel - Wait 5 seconds');
	  setTimeout(function() {
			VCconn = vChannel.join()			
				.then(connection => { BotConn(connection, BotDate()+":dizzy: rejoin request from "+message.author.username+"   "+message.author.id, true)
					})			
				.catch(console.error);   
				}, 5000);   
  	 }
	//message.guild.ownerID === message.member.id
  if((message.content === "Play1") && ((message.member.roles.highest.name) == "Moderator3")) {
  	// join the correct voice channel 	  
	let vChannel = bot.channels.get(process.env.VCHANNEL); 
	//VCconn.play('https://github.com/tonybalony8989/voice-bot-heroku-js/blob/master/tone2.mp3', { volume: 1 });
	console.log(VCconn);
  
  	 }
	
});

//catch promise errors
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

bot.login(process.env.TOKEN);


//setup the setInterval here - 600s is 10minutes
setInterval(intervalFunc,600000);


function intervalFunc() {
	if (lastChats >= chats) {
		//nothing has happened since last interval - take action
		var newDate= new Date();
		var diff= newDate-lastRejoin;
		if (diff>1800000) {
			//we have exceeded the cooldown timer (diff is in milliseconds, 1,800,000ms for 30min cooldown)
			//do a leave and join, say the chats occurances into the trackchannel
			let vChannel = bot.channels.get(process.env.VCHANNEL);
			vChannel.leave();
			//console.log('Interval Rejoin - Wait 2.5 seconds - chats:'+chats);
			//use alternate function that doesn't play audio??
			setTimeout(function() {
				VCconn = vChannel.join()			
					.then(connection => { BotConn(connection, BotDate()+":clock3: interval rejoin - no chats recently:"+chats, true)
						})			
					.catch(console.error);   
					}, 240000);
			lastRejoin=new Date();
		}
	}
	else {
		console.log(BotDate()+' current chats:'+chats +' last chats:'+lastChats);		
	}
	lastChats=chats; //track the current state
	
}

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

function BotConn(bConn, msgString, playSound) {
	//console.log(`Connected status:${bConn.status} speaking:${bConn.speaking.has(1)} ch.name:${bConn.channel.name} selfDeaf:${bConn.voice.selfDeaf} mute:${bConn.voice.mute}`)
	console.log(msgString);
	  	bConn.voice.setSelfDeaf(true);
		bConn.voice.setSelfMute(false);
		setTimeout(function() {
			bConn.voice.setSelfMute(true);
			bConn.voice.setSelfDeaf(false);}, 2000)					
		let trackChannel = bot.channels.get(process.env.TRACKCHANNEL);
		trackChannel.send(BotDate()+msgString);
		if (playSound) {
			//bConn.play('https://www.myinstants.com/media/sounds/erro.mp3', { volume: 0.1 });
			bConn.play('https://github.com/tonybalony8989/voice-bot-heroku-js/blob/master/tone1.mp3', { volume: 0.1 });
			}		
		//console.log(`OK status:${bConn.status} speaking:${bConn.speaking.has(1)} ch.name:${bConn.channel.name} selfDeaf:${bConn.voice.selfDeaf} mute:${bConn.voice.mute}`)
}
