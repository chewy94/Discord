const request = require('request');

function blah() {
	request.get('https://redisq.zkillboard.com/listen.php', (error, response, body) => {
		var test = JSON.parse(body)
		var attackerCount = 0;
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
				console.log('Victim was a real player');
			}
		}
		if (attackerCount > 0) {
			const killUrl = 'https://zkillboard.com/kill/' + test.package.killID;
			bluh(killUrl);
		}
		// var body = 'https://zkillboard.com/kill/' + test.package.killID
		// bluh(body)
		// console.log(body.data)
	})
}

function bluh(body) {
	request.post({
  		headers: {'content-type' : 'application/json'},
  		url:     'https://discordapp.com/api/webhooks/320605901436354562/nZUHDhMNXpDj0koYDBNylymA13d6giiSYUU9Dgg_7x9K6TYJpR249D36BhPyg8_3hlSC',
  		body:    `{ "content": ` + `"` + body + `"` + ` }`,
	}, function(error, response, body){
		// console.log(error);
		// console.log(response);
  		console.log(body);
	});
}
blah()
// setInterval(blah, 500)

// channelID: 320407647171903488