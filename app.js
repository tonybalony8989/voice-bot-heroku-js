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
	tChanSend(hChannel,BotDate()+member.displayName+special+' 				`'+member.user.id+'` ')
		//.catch((e) => channel.send('an error occurred')).catch(console.log);
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
	tChanSend(vlChannel,BotDate()+newName+botNote+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_ :white_check_mark:');
	tChanSend(hChannel,BotDate()+newName+botNote+'`'+newID+'` ***JOINED*** _'+newUserChannel+'_ :white_check_mark:');	  
  	tChanSend(ttsChannel,newName+' JOINED '+newUserChannel.replace(/\s/g, '')+'', { tts: true});
		 	if (newState.member.roles.highest.name == "@everyone") {
				tChanSend(trackChannel,BotDate()+newName+'<@'+newID+'> ***JOINED*** _'+newUserChannel+'_ :white_check_mark:');
		 	}		
			if (newState.member.user.bot) { track(BotDate()+':robot: '+newName+' is a bot')}
  }
  else {		
		if (newState.channel === null) {	//user left channel
			tChanSend(vlChannel,BotDate()+oldName+botNote+'`'+oldID+'` ***LEFT*** _'+oldUserChannel+'_ :stop_sign:');
			tChanSend(hChannel,BotDate()+oldName+botNote+'`'+oldID+'` ***LEFT*** _'+oldUserChannel+'_ :stop_sign:');
			tChanSend(ttsChannel,oldName+' LEFT '+oldUserChannel.replace(/\s/g, '')+'', { tts: true});
			}
		else {	//user switched channel
			if (newUserChannel != oldUserChannel) {
				tChanSend(vlChannel,BotDate()+oldName+botNote+'`'+oldID+'` ***SWITCHED*** _'+oldUserChannel+'_ to _'+newUserChannel+'_');
				tChanSend(hChannel,BotDate()+oldName+botNote+'`'+oldID+'` ***SWITCHED*** _'+oldUserChannel+'_ to _'+newUserChannel+'_');
				tChanSend(ttsChannel,oldName+' SWITCHED '+oldUserChannel.replace(/\s/g, '')+' to '+newUserChannel.replace(/\s/g, '')+'', { tts: true});
				//str = str.replace(/\s/g, '');
				}
			}
  }		
});
bot.on('message', async message => {
  if(message.author.bot) return;	//only accept commands from within a guild (not DM or groupDM) message.member is null for the former two  
  if(message.member===null) {	//track dms somewhat
						console.log(BotDate()+"DM from "+message.author.username+"   "+message.author.id);  		  
						track(BotDate()+":interrobang: DM from "+message.author.username+"   "+message.author.id);
						return;}
  if((message.content === "z join fleet voice please") && ((message.member.roles.highest.name) != "@everyone") ) {
  	// join the correct voice channel 	  
	let vChannel = bot.channels.get(process.env.VCHANNEL);  
	vChannel.leave()
	console.log("Left channel - Wait 5 seconds - rejoin request from "+message.author.username+"   "+message.author.id);
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
  if((message.content === "snapshot") && ((message.member.roles.highest.name) != "@everyone")) {
	  //console.log(message.channel.name);
 		let vChannel = bot.channels.get(process.env.VCHANNEL); 			
		let userNames = getVCnames(process.env.VCHANNEL);		
		let newMessage=BotDate()+vChannel.name+' :joystick: ' +userNames.length+' voice users\n';
		newMessage+='`'
		for (i = 0; i < userNames.length; i++) {
			newMessage+=userNames[i]+'\n';
			}
		newMessage+='`'
		message.channel.send(newMessage)
		//message.channel.send(`${BotDate()}:joystick: ${userNames.length} users. ${userNames.sort()}`);		
		console.log(BotDate()+"snapshot "+message.author.username+"   "+message.author.id+" "+userNames); 	
	}
	if((message.content === "snapshot2") && ((message.member.roles.highest.name) != "@everyone")) {
	  //console.log(message.channel.name);
 		let vChannel = bot.channels.get(process.env.VCHANNEL); 
		let userNames = getVCnames(process.env.VCHANNEL);		
		let memberList = vChannel.members.map(gMember=>{return gMember});
		let newMessage=BotDate()+vChannel.name+' :joystick: ' +memberList.length+' voice users\n';		
		
		for (i = 0; i < memberList.length; i++) {
			newMessage+='<@'+memberList[i].id+'>\n';
			}
		
		message.channel.send(newMessage)
		//message.channel.send(`${BotDate()}:joystick: ${userNames.length} users. ${userNames.sort()}`);		
		console.log(BotDate()+"snapshot "+message.author.username+"   "+message.author.id+" "+userNames); 	
	}
	if((message.content === "snapshot3") && ((message.member.roles.highest.name) != "@everyone")) {
	  //console.log(message.channel.name);
 		let vChannel = bot.channels.get(process.env.VCHANNEL); 			
		let userNames = getVCnames(process.env.VCHANNEL);		
		message.channel.send(`${BotDate()}:joystick: ${userNames.length} users. ${userNames.sort()}`);
		console.log(BotDate()+"snapshot2 "+message.author.username+"   "+message.author.id+" "+userNames); 	
	}
	if(message.content === "findmods") {
	  //console.log(message.channel.name);
 		let vChannel = bot.channels.get(process.env.VCHANNEL); 			
		let userNames = vChannel.members.map(gMember => {if (gMember.roles.highest.name=="Moderator3") {return gMember.displayName;}
														 return null
														});		
		message.channel.send(`${BotDate()}:jigsaw: ${userNames.sort().filter(Boolean)}`);
		console.log(BotDate()+"findmods "+message.author.username+"   "+message.author.id+" "+userNames.sort().filter(Boolean)); 
			// .filter(Boolean) is trimming 'falsy' type data eg. null, undefined, 0, ...		
	}
	 if ((message.content=== "togglemute") && (message.guild.ownerID === message.member.id)) {
		 //get a channel in the relevant guild, the guild itself, and then the relevant voice connection
		 let vChannel = bot.channels.get(process.env.VCHANNEL);
		 let Guild = vChannel.guild;
		 let vConn = Guild.voice.connection;
		 if (vConn.voice.mute) {
			vConn.voice.setSelfMute(false);	
			track(BotDate()+message.author.username+" - togglemute :sound:");
			}
		 else {
			 vConn.voice.setSelfMute(true);	
			 track(BotDate()+message.author.username+" - togglemute :mute:");
		 }				
	 }
	if ((message.content=== "localeinfo") && (message.guild.ownerID === message.member.id)) {
		 //get a channel in the relevant guild, the guild itself, and then the relevant voice connection
		 let vChannel = bot.channels.get(process.env.VCHANNEL);
		 let Guild = vChannel.guild;
		 //let memberList = Guild.members;   //this is the memberlist for the entire guild
		 let memberList=vChannel.members;  //this is the member list of the primary voice channel
		 let outputs = memberList.map(gMember => {return gMember.user.locale });		 
		track(BotDate()+" locales:"+outputs);
//UNTESTED
		
	 }
	 


});
//catch promise errors
process.on('unhandledRejection', error => console.error('Uh Oh, Uncaught Promise Rejection', error));

bot.login(process.env.TOKEN);
//setup the setInterval here - 300s is 5minutes
 setInterval(intervalFunc,300000);

function intervalFunc() {
	let vChannel = bot.channels.get(process.env.VCHANNEL); 
	let userNames = getVCnames(process.env.VCHANNEL);
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
		let userNames = getVCnames(process.env.VCHANNEL);
		console.log(BotDate()+'10x repairs, last chat was '+BotDate(lastChat));
		track(BotDate()+":clock3: 10x interval repairs - chats:"+chats+' last chat: '+BotDate(lastChat)+' current users:'+userNames);
		repairTrack=0;
	}
} 

function BotDate(dateVal) {  //date formatted in fixed width for discord. send nothing for current date
	if (dateVal===undefined) {var d= new Date();}
	else { var d = dateVal;}
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
	let trackChannel = bot.channels.get(process.env.TRACKCHANNEL);  //don't use tChanSend here
		trackChannel.send(testMsg);
}
function tChanSend(tChan, tMsg) { //try to catch some errors that intermitently show up as 'HTTPError'
	tChan.send(tMsg).catch((e) => track(BotDate()+'a send error occurred')).catch(console.log);	
}
function getVCnames(channelID) {  //gets the names of a voice channel
	 	let vChannel = bot.channels.get(channelID); 			
		let userNames = vChannel.members.map(gMember => {let base=gMember.displayName;
														 let prefix="";
														 let suffix="";
														 if (gMember.user.bot) {suffix=' :robot:'; prefix='';}
														 return prefix+base+suffix
														});	
		userNames=userNames.sort();
		
	return userNames
}
function getVCusers(channelID) {  //gets the names of a voice channel
	 	let vChannel = bot.channels.get(channelID); 			
		let userNames = vChannel.members.map(gMember => {return gMember.user});	
		userNames=userNames.sort(function (a, b) {
				return a.toLowerCase().localeCompare(b.toLowerCase());
				});
	return userNames
}
