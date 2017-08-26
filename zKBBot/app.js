const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

var zInterval = '';

function blah(corpName, message) {
	request.get('https://redisq.zkillboard.com/listen.php', (error, response, body) => {
		var test;
		if (body) {
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
						console.log('Victim was a(n) ' + corpName + ' member' + '\t\tTime: ' + test.package.killmail.killTime);
						wasVictim = true;
					}
				}
			}
			if (attackerCount > 0 || wasVictim) {
				console.log('Attackers that were ' + corpName + ' members: ' + attackerCount + '\tTime: ' + test.package.killmail.killTime);
				const killUrl = 'https://zkillboard.com/kill/' + test.package.killID + '\n' + test.package.killmail.killTime;
				message.channel.send(killUrl);
			}
		}
	});
}

client.on('ready', () => {
	console.log('CLIENT IS ONLINE');
	client.channels.first().send('I am the killmail bot! To get me started please enter: "!kills [corp name]"\nExample: "!kills Celestial Horizon Corp"');
});

client.on('message', (message) => {
	if (!message.author.bot) {
		if (message.content.includes('!kills')) {
			let corpName = message.content.split(' ').slice(1).join(' ');
			message.channel.send('We are fetching killmails for: ' + corpName);
			zInterval = setInterval(blah, 500, corpName, message);
		} else if (message.content.includes('!help')) {
			message.channel.send('Commands:\n\t!kills [corp name]\n\tDescription:\n\t\tPosts kills from zKillboard in real time\n\tExample:\n\t\t"!kills Celestial Horizon Corp"')
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

client.login(settings.token);