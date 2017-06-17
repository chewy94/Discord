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
			// console.log(test);
			// console.log('--------------------------------------------------------')
			// console.log(test.package.killmail.attackers);
			if (test.package) {
				test.package.killmail.attackers.forEach(function(element) {
					if (element.character) {
						console.log(element.corporation.name);
						if (element.corporation.name === 'ArcJet Heavy Industries') {
							console.log('Attacker was an ArcJet member');
							attackerCount++;
						}
					}
				});

				if (test.package.killmail.victim.character) {
					if (test.package.killmail.victim.corporation === 'ArcJet Heavy Industries') {
						console.log('Victim was an ArcJet member');
						wasVictim = true;
					}
				}
			}
			console.log('Attackers that were ArcJet: ' + attackerCount);
			if (attackerCount > 0 || wasVictim) {
				const killUrl = 'https://zkillboard.com/kill/' + test.package.killID;
				message.channel.send(killUrl);
			}
			// var body = 'https://zkillboard.com/kill/' + test.package.killID
			// bluh(body)
			// console.log(body.data)
		}
	});
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