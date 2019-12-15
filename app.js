const Discord = require('discord.js');
const bot = new Discord.Client();
//https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
//	https://elements.heroku.com/buildpacks/dubsmash/heroku-buildpack-opus 
//* https://github.com/jayzes/heroku-buildpack-ffmpeg
//* https://github.com/codeinteger6/heroku-buildpack-libopus 
//or https://github.com/Crazycatz00/heroku-buildpack-libopus.git
var chats = 0; //tracking chat occurances
var lastChats = 0; //tracking of chat occurances
var repairTrack=0;
var lastRepair = new Date('2010/01/05 10:11:12');
var lastChat = new Date('1999/01/05 10:11:12');

bot.on('ready', async () => {      				// join the correct voice channel 
  let vChannel = bot.channels.get(process.env.VCHANNEL);  
   await vChannel.join()			 	
			.then(connection => { BotConn(connection, ":boom: new voice connection", true)
			    }) 
			.catch(console.error) 
});

bot.on('guildMemberSpeaking', (member, speaking) => { 
	//console.log(`${member.displayName} ${speaking.has(1)}`);
	if (speaking.has(1)) {
	let hChannel = bot.channels.get(process.env.TCHANNEL);	
	let special="";
	if (speaking.bitfield==5) { special=" :loudspeaker:"; }
	hChannel.send(BotDate()+member.displayName+special+' 				`'+member.user.id+'` ');	
	//console.log(speaking.bitfield);  //this is 1 for regular voice, and 5 for priority voice
	if (chats==0) {  //first chat since the bot has started
		track(BotDate()+":rainbow: first chat received");
	}
	chats=chats+1;
	lastChat=new Date();	
	}  
});

bot.on('voiceStateUpdate', (oldState, newState) =>{
  let vlChannel = bot.channels.get(process.env.VLCHANNEL);
  let ttsChannel = bot.channels.get(process.env.TTSCHANNEL);
  let trackChannel = bot.channels.get(process.env.TRACKCHANNEL);
  let hChannel = bot.channels.get(process.env.TCHANNEL);	
  let newName=null; let newID=null; let newUserChannel=null;
  let oldName=null; let oldID=null; let oldUserChannel=null;
  let botNote="";
  if (newState.channel != null) { //console.log("new");
	newUserChannel = newState.channel.name;
	newName = newState.member.displayName;
	newID = newState.member.id;
	if (newState.member.user.bot) {botNote=':robot:';}
  }
  if (oldState.channel !== null) { //console.log("old");
	oldUserChannel = oldState.channel.name;
	oldName = oldState.member.displayName;
	oldID = oldState.member.id;    
	if (oldState.member.user.bot) {botNote=':robot:';}
  }

  if (oldState.channel === null) {  	//user joined channel  		
	vlChannel.send(BotDate()+newName+botNote+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_ :white_check_mark:');
	hChannel.send(BotDate()+newName+botNote+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_ :white_check_mark:');	  
  	ttsChannel.send(newName+' JOINED '+newUserChannel.replace(/\s/g, '')+'', { tts: true});
		 	if (newState.member.roles.highest.name == "@everyone") {
				trackChannel.send(BotDate()+newName+'<@'+newID+'> ***JOINED*** _'+newUserChannel+'_ :white_check_mark:');
		 	}		
			if (newState.member.user.bot) { track(BotDate()+':robot: '+newName+'is a bot')}
  }
  else {		
		if (newState.channel === null) {	//user left channel
			vlChannel.send(BotDate()+oldName+botNote+'`'+oldID+'` ***LEFT*** _'+oldUserChannel+'_ :stop_sign:');
			hChannel.send(BotDate()+oldName+botNote+'`'+oldID+'` ***LEFT*** _'+oldUserChannel+'_ :stop_sign:');
			ttsChannel.send(oldName+' LEFT '+oldUserChannel.replace(/\s/g, '')+'', { tts: true});
			}
		else {	//user switched channel
			if (newUserChannel != oldUserChannel) {
				vlChannel.send(BotDate()+oldName+botNote+'`'+oldID+'` ***SWITCHED*** _'+oldUserChannel+'_ to _'+newUserChannel+'_');
				hChannel.send(BotDate()+oldName+botNote+'`'+oldID+'` ***SWITCHED*** _'+oldUserChannel+'_ to _'+newUserChannel+'_');
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
			vChannel.join()			
				.then(connection => { BotConn(connection, BotDate()+":dizzy: rejoin request from "+message.author.username+"   "+message.author.id, true)
					})			
				.catch(console.error);   
				}, 5000);   
  	 }
	//message.guild.ownerID === message.member.id
  if((message.content === "Play1") && ((message.member.roles.highest.name) == "Moderator3")) {
  	// join the correct voice channel 	  
	let vChannel = bot.channels.get(process.env.VCHANNEL); 
	vChannel.join()			
		.then(connection => { track(BotDate()+":wolf: play "+message.author.username+"   "+message.author.id);
							  connection.play('https://raw.githubusercontent.com/tonybalony8989/voice-bot-heroku-js/master/tone2.mp3', { volume: 0.3 });
			})			
		.catch(console.error); 	
  	 }
  if((message.content === "Snapshot") && ((message.member.roles.highest.name) != "@everyone")) {
	  //console.log(message.channel.name);
 		let vChannel = bot.channels.get(process.env.VCHANNEL); 			
		let userNames = vChannel.members.map(gMember => {let base=gMember.displayName;
														 let prefix="";
														 let suffix="";
														 if (gMember.user.bot) {suffix=' :robot:'; prefix='[BOT->] ';}
														 return prefix+base+suffix
														});		
		message.channel.send(`${BotDate()}:joystick: ${userNames.length} users. ${userNames.sort()}`);
		console.log(BotDate()+"Snapshot "+message.author.username+"   "+message.author.id+" "+userNames.sort()); 	
	} 	 
});
//catch promise errors
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

bot.login(process.env.TOKEN);
//setup the setInterval here - 300s is 5minutes
 setInterval(intervalFunc,300000);

function intervalFunc() {
	let vChannel = bot.channels.get(process.env.VCHANNEL); 
	let userNames = vChannel.members.map(gMember => gMember.displayName);
	let userCount = userNames.length; //this is 1 when empty (bot is counted).
	if ((lastChats >= chats) && (userCount>=3)) { //no need to do anything if the server is empty
		//nothing has happened since last interval - take action to repair the connection
		var newDate = new Date();
		var diff = newDate-lastRepair;
		if (diff>600000) { //less than the interval value and this isn't useful			
			vChannel.join()			
				.then(connection => { //track(BotDate()+":clock3: interval repair - no chats recently:"+chats+' last chat'+lastChatDate());
					 connection.play('https://raw.githubusercontent.com/tonybalony8989/voice-bot-heroku-js/master/tone2.mp3', { volume: 0.05 });
					})			
				.catch(console.error);
			lastRepair=new Date();
			repairTrack++;
		}
	}
	else {
		//console.log(BotDate()+' current chats:'+chats +' last chats:'+lastChats);		
	}
	lastChats=chats; //track the current state	
	if (repairTrack>=10) {
		console.log(BotDate()+'10x repairs, last chat was '+lastChatDate());
		track(BotDate()+":clock3: 10x interval repairs - chats:"+chats+' last chat: '+lastChatDate());
		repairTrack=0;
	}
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
function lastChatDate() {
	var d = lastChat;
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
	  	bConn.voice.setSelfDeaf(false);
		bConn.voice.setSelfMute(false);				
		track(BotDate()+msgString);
		if (playSound) {
			//bConn.play('https://www.myinstants.com/media/sounds/erro.mp3', { volume: 0.1 });			
			bConn.play('https://raw.githubusercontent.com/tonybalony8989/voice-bot-heroku-js/master/tone2.mp3', { volume: 0.05 });
			}	
		setTimeout(function() {
			bConn.voice.setSelfMute(true);
			bConn.voice.setSelfDeaf(false);
		}, 2000)				
}
function track(testMsg) {
	//send a message into the track channel
	let trackChannel = bot.channels.get(process.env.TRACKCHANNEL);
		trackChannel.send(testMsg);
}
