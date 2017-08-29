const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

var zInterval = '';

function zKillChar(charName, message) {
	request.get('https://redisq.zkillboard.com/listen.php', (error, response, body) => {
		if (error) {
			console.warn(error);
		}
		if (body && body.charAt(0) != '<') {
			var killResponse = JSON.parse(body);
			var wasAttacker = false;
			var wasVictim = false;

			if (killResponse.package) {
				killResponse.package.killmail.attackers.forEach(function(element) {
					if (element.character) {
						if (element.character.name === charName) {
							wasAttacker = true;
						}
					}
				});

				if (killResponse.package.killmail.victim.character && !wasAttacker) {
					if (killResponse.package.killmail.victim.character.name === charName) {
						wasVictim = true;
					}
				}
			}

			if (wasAttacker || wasVictim) {
				// if (wasAttacker) {
				// 	console.log('Attackers that were ' + corpName + ': ' + attackerCount + '\tTime: ' + killResponse.package.killmail.killTime);
				// } else {
				// 	console.log(corpName + ' was a victim!' + '\tTime: ' + killResponse.package.killmail.killTime);
				// }
				
				const killUrl = 'https://zkillboard.com/kill/' + killResponse.package.killID + '\n' + killResponse.package.killmail.killTime;
				message.channel.send(killUrl);
			}
		}
	});
}

function zKillCorp(corpName, message) {
	request.get('https://redisq.zkillboard.com/listen.php', (error, response, body) => {
		if (error) {
			console.warn(error);
		}
		if (body && body.charAt(0) != '<') {
			var killResponse = JSON.parse(body);
			var attackerCount = 0;
			var wasVictim = false;
			if (killResponse.package) {
				killResponse.package.killmail.attackers.forEach(function(element) {
					if (element.character) {
						if (element.corporation.name === corpName) {
							attackerCount++;
						}
					}
				});

				// console.log(killResponse.package.killmail.victim)
				if (killResponse.package.killmail.victim.character) {
					if (killResponse.package.killmail.victim.corporation.name === corpName) {
						// console.log('Victim was a(n) ' + corpName + ' member' + '\t\tTime: ' + killResponse.package.killmail.killTime);
						wasVictim = true;
					}
				}
			}
			if (attackerCount > 0 || wasVictim) {
				if (attackerCount > 0) {
					console.log('Attackers that were ' + corpName + ': ' + attackerCount + '\tTime: ' + killResponse.package.killmail.killTime);
				} else {
					console.log(corpName + ' was a victim!' + '\tTime: ' + killResponse.package.killmail.killTime);
				}
				
				const killUrl = 'https://zkillboard.com/kill/' + killResponse.package.killID + '\n' + killResponse.package.killmail.killTime;
				message.channel.send(killUrl);
			}
		}
	});
}

function zKillAlliance(allianceName, message) {
	request.get('https://redisq.zkillboard.com/listen.php', (error, response, body) => {
		if (error) {
			console.warn(error);
		}
		if (body && body.charAt(0) != '<') {
			var killResponse = JSON.parse(body);
			var attackerCount = 0;
			var wasVictim = false;
			if (killResponse.package) {
				killResponse.package.killmail.attackers.forEach(function(element) {
					if (element.character && element.alliance) {
						if (element.alliance.name === allianceName) {
							attackerCount++;
						}
					}
				});

				// console.log(killResponse.package.killmail.victim)
				if (killResponse.package.killmail.victim.character && killResponse.package.killmail.victim.alliance) {
					if (killResponse.package.killmail.victim.alliance.name === allianceName) {
						// console.log('Victim was a(n) ' + corpName + ' member' + '\t\tTime: ' + killResponse.package.killmail.killTime);
						wasVictim = true;
					}
				}
			}
			if (attackerCount > 0 || wasVictim) {
				if (attackerCount > 0) {
					console.log('Attackers that were ' + allianceName + ': ' + attackerCount + '\tTime: ' + killResponse.package.killmail.killTime);
				} else {
					console.log(allianceName + ' was a victim!' + '\tTime: ' + killResponse.package.killmail.killTime);
				}
				
				const killUrl = 'https://zkillboard.com/kill/' + killResponse.package.killID + '\n' + killResponse.package.killmail.killTime;
				message.channel.send(killUrl);
			}
		}
	});
}

client.on('ready', () => {
	console.log('CLIENT IS ONLINE');
	client.channels.first().send('I am the killmail bot! To get me started please enter: "!kills -char | -corp | -alliance"\nExample: "!kills -corp Celestial Horizon Corp"');
});

client.on('message', (message) => {
	if (!message.author.bot) {
		if (message.content.includes('!kills')) {
			if (message.content.includes('-char')) {
				let charName = message.content.split(' ').slice(2).join(' ');
				message.channel.send('We are fetching killmails for: ' + charName);
				zInterval = setInterval(zKillChar, 500, charName, message);
			} else if (message.content.includes('-corp')) {
				let corpName = message.content.split(' ').slice(2).join(' ');
				message.channel.send('We are fetching killmails for: ' + corpName);
				zInterval = setInterval(zKillCorp, 500, corpName, message);
			} else {
				let allianceName = message.content.split(' ').slice(2).join(' ');
				message.channel.send('We are fetching killmails for: ' + allianceName);
				zInterval = setInterval(zKillAlliance, 500, allianceName, message);
			}
		} else if (message.content.includes('!help')) {
			message.channel.send('Commands:\n\t!kills:\n\t\tDescription:\n\t\t\tPosts kills from zKillboard in real time\n\t\tOptions:\n\t\t\t-char\n\t\t\t-corp\n\t\t\t-alliance\n\t\tExample:\n\t\t\t"!kills -corp Celestial Horizon Corp"')
		} else if (message.content.includes('!stop') || message.content.includes('!quit')) {
			if (zInterval !== '') {
				clearInterval(zInterval);
				zInterval = '';
				message.channel.send('I have stopped pulling killboards');
			} else {
				message.channel.send('I am not currently pulling from zKillboard\nPlease type "!help" for more options');
			}
		} else {
			message.channel.send('I do not recognize that command. Please enter "!help" to see what commands I have available');
		}
	}
});

client.login(settings.testToken);