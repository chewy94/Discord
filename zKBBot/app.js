const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

function blah(message) {
	request.get('https://redisq.zkillboard.com/listen.php', (error, response, body) => {
		var test = JSON.parse(body)
		var attackerCount = 0;
		var wasVictim = false;
		// console.log(test.package.killmail.attackers);
		console.log('--------------------------------------------------------')
		console.log(test.package.killmail.victim);
		if (test.package.killmail) {
			test.package.killmail.attackers.forEach(function(element) {
				if (element.character === undefined) {
					console.log('We do not need this shit');
				} else {
					attackerCount++;
				}
			}, this);

			if (test.package.killmail.victim.character) {
				console.log('Victim was a real character')
				if (test.package.killmail.victim.corporation === 'ArcJet Heavy Industries') {
					wasVictim = true;
				}
			}
		}
		if (attackerCount > 0 || wasVictim) {
			const killUrl = 'https://zkillboard.com/kill/' + test.package.killID;
			message.channel.send(killUrl);
		}
		// var body = 'https://zkillboard.com/kill/' + test.package.killID
		// bluh(body)
		// console.log(body.data)
	})
}

client.on('ready', () => {
	console.log('CLIENT IS ONLINE');
});

client.on('message', (message) => {
	if (message.content === '!kills') {
		message.channel.send('We are fetching killmails');
		// blah(message);
		setInterval(blah, 500, message);
	}
});

client.login(settings.token);