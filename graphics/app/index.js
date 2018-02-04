//Let's make some noise?
if (window.lfgSound === undefined) {
	// alert.wav from http://www.freesound.org/people/InfiniteLifespan/sounds/266455/
	window.createjs.Sound.registerSound('snd/alert.wav', 'alert');
	window.createjs.Sound.registerSound('snd/alert.wav', 'sub');
}

var stageEl = document.createElement('canvas');

//Set some properties on the canvas
stageEl.id = 'notification';
stageEl.width = window.innerWidth;
stageEl.height = 100;

//Add the canvas to the page
document.body.appendChild(stageEl);

//Create the easeljs stage, we pass in the element id of the canvas we created above;
var stage = new createjs.Stage('notification');

//setup our animation settings
createjs.Ticker.framerate = 60;
createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCED;
createjs.Ticker.addEventListener('tick', event => {
	stage.update();
});

const alerter = new Alerter(window.innerWidth, 50);

//Add the alerter to the stage
stage.addChild(alerter.container);

function onFollow(name) {
	var text = 'New Follower: ' + name;
	alerter.notify(text, 'alert');
}

function onHost(name) {
	var text = 'Host: ' + name;
	alerter.notify(text, 'alert');
}

function onSub(name) {
	var text = 'New Subscriber: ' + name;
	alerter.notify(text, 'sub');
}

function onTip(name, amount, symbol) {
	//We want a space between the name and the donation amount
	var text = 'New Tip: ' + name + ' ' + symbol + amount;
	alerter.notify(text, 'sub');
}

// Listen to the beam follow events
nodecg.listenFor('follow', 'nodecg-mixer', data => onFollow(data.username));

// Listen to our internal follow events(For testing)
nodecg.listenFor('follow', 'prime-manual-alerts', data =>
	onFollow(data.username),
);

// Listen to host events
nodecg.listenFor('host', 'nodecg-mixer', data => onHost(data.username));
nodecg.listenFor('host', 'prime-manual-alerts', data => onHost(data.username));

// Listen to the beam sub events
nodecg.listenFor('subscription', 'nodecg-mixer', data => onSub(data.username));

// Listen to our internal sub events(For testing)
nodecg.listenFor('subscription', 'prime-manual-alerts', data =>
	onSub(data.username),
);

// Listen to Stream-Tip events
//lfg-streamtip stores the username in data.name
nodecg.listenFor('tip', 'lfg-streamtip', data =>
	onTip(data.username, data.amount, data.currencySymbol),
);

// Listen to Internal Stream-Tip events
nodecg.listenFor('tip', 'prime-manual-alerts', data =>
	onTip(data.username, data.amount, data.currencySymbol),
);
