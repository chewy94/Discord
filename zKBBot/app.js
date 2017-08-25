const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

function blah(message) {
	request.get('https://redisq.zkillboard.com/listen.php', (error, response, body) => {
		var test;
		if (body) {
			test = JSON.parse(body);
			var attackerCount = 0;
			var wasVictim = false;
			if (test.package) {
				test.package.killmail.attackers.forEach(function(element) {
					if (element.character) {
						if (element.corporation.name === 'Pandemic Horde Inc.') {
							attackerCount++;
						}
					}
				});

				// console.log(test.package.killmail.victim)
				if (test.package.killmail.victim.character) {
					if (test.package.killmail.victim.corporation.name === 'Pandemic Horde Inc.') {
						console.log('Victim was an Pandemic member');
						wasVictim = true;
					}
				}
			}
			// console.log('Attackers that were ArcJet: ' + attackerCount);
			if (attackerCount > 0 || wasVictim) {
				const killUrl = 'https://zkillboard.com/kill/' + test.package.killID + '\n' + test.package.killmail.killTime;
				message.channel.send(killUrl);
			}
		}
	});
}

client.on('ready', () => {
	console.log('CLIENT IS ONLINE');
});

client.on('message', (message) => {
	if (message.content === '!kills') {
		message.channel.send('We are fetching killmails');
		setInterval(blah, 500, message);
	}
});

client.login(settings.token);