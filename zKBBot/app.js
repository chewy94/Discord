const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

var zInterval = '';

function blah(corpName, message) {
	request.get('https://redisq.zkillboard.com/listen.php', (error, response, body) => {
		if (error) {
			console.warn(error);
		}
		var test;
		if (body && body.charAt(0) != '<') {
			test = JSON.parse(body);
			var attackerCount = 0;
			var wasVictim = false;
			if (test.package) {
				test.package.killmail.attackers.forEach(function(element) {
					if (element.character) {
						if (element.corporation.name === corpName) {
							attackerCount++;
						}
					}
				});

				// console.log(test.package.killmail.victim)
				if (test.package.killmail.victim.character) {
					if (test.package.killmail.victim.corporation.name === corpName) {
						// console.log('Victim was a(n) ' + corpName + ' member' + '\t\tTime: ' + test.package.killmail.killTime);
						wasVictim = true;
					}
				}
			}
			if (attackerCount > 0 || wasVictim) {
				if (attackerCount > 0) {
					console.log('Attackers that were ' + corpName + ': ' + attackerCount + '\tTime: ' + test.package.killmail.killTime);
				} else {
					console.log(corpName + ' was a victim!' + '\tTime: ' + test.package.killmail.killTime);
				}
				
				const killUrl = 'https://zkillboard.com/kill/' + test.package.killID + '\n' + test.package.killmail.killTime;
				message.channel.send(killUrl);
			}
		}
	});
}

client.on('ready', () => {
	console.log('CLIENT IS ONLINE');
	client.channels.first().send('I am the killmail bot! To get me started please enter: "!kills character | corporation | alliance"\nExample: "!kills Celestial Horizon Corp"');
});

client.on('message', (message) => {
	if (!message.author.bot) {
		if (message.content.includes('!kills')) {
			if (message.content.includes('-char')) {
				let charName = message.content.split(' ').slice(2).join(' ');
				message.channel.send('We are fetching killmails for: ' + charName);
				zInterval = setInterval(blah, 500, charName, message);
			} else if (message.content.includes('-corp')) {
				let corpName = message.content.split(' ').slice(2).join(' ');
				message.channel.send('We are fetching killmails for: ' + corpName);
				zInterval = setInterval(blah, 500, corpName, message);
			} else {
				let aliianceName = message.content.split(' ').slice(2).join(' ');
				message.channel.send('We are fetching killmails for: ' + allianceName);
				zInterval = setInterval(blah, 500, allianceName, message);
			}
		} else if (message.content.includes('!help')) {
			message.channel.send('Commands:\n\t!kills:\n\t\tDescription:\n\t\t\tPosts kills from zKillboard in real time\n\t\tOptions:\n\t\t\t-char\n\t\t\t-corp\n\t\t\t-alliance\n\t\tExample:\n\t\t\t"!kills -corp Celestial Horizon Corp"')
		} else if (message.content.includes('!stop') || message.content.includes('!quit')) {
			if (zInterval !== '') {
				clearInterval(zInterval);
				zInterval = '';
				message.channel.send('I have stopped pulling killboards');
			} else {
				message.channel.send('I am not currently pulling from zKillboard');
			}
		}
	}
});

client.login(settings.testToken);