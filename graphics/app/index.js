
//Let's make some noise?
//http://www.freesound.org/people/InfiniteLifespan/sounds/266455/

if(window.lfgSound === undefined) {
	createjs.Sound.registerSound('snd/alert.wav', 'alert');
	createjs.Sound.registerSound('snd/alert.wav', 'sub');
}


//Get a refence to our container element on the view page
var containerEl = document.getElementById('container');

//Create the canvas that EaselJS ties into
var stageEl = document.createElement('canvas');

//Set some properties on the canvas
stageEl.id = 'notification';
stageEl.width = window.innerWidth;
stageEl.height = 100;

//Add the canvas to the page
containerEl.appendChild(stageEl);


//store some helpful shortcuts
var middle = stageEl.width / 2;
var width = stageEl.width;
var height = 50;

//Create the easeljs stage, we pass in the element id of the canvas we created above;
var stage = new createjs.Stage('notification');


//A container is a box we can throw other EaselJS objects into.
var container = new createjs.Container();


//We want a rectangle the entire width of the stage and our set height tall. We want it green
var background = new createjs.Shape();
background.graphics.beginFill("green").rect(0,0,width,height);

//Setup a text object but we don't specify the text it should display here
var textObj = new createjs.Text("", "28px Arial", "#FFFFFF");
textObj.y = 10;

//Throw the background and text into the container so they will move in unison
container.addChild(background);
container.addChild(textObj);
//Move the container off the page by height*-1 pixels.
container.y = height* -1;

//Add the container to the stage
stage.addChild(container);

//setup our animation settings
createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick", stage);

//How long should our in and out phases last in ms
var tweenDuration = 500;

//how long should we hold the username on the screen
var holdDuration = 3000;

var showing = false;

var queue = new Queue();

//Slowely over tweenDuration ms drop the container into the stage by moving it downwards
function tweenIn() {
	showing = true;
	return createjs.Tween.get(container).to({x:0,y:0},tweenDuration);
}

function deQueue() {
	if(queue.length && !showing) {
		var next = queue.shift();
		notify(next.text, next.sound);
	}
}

setInterval(deQueue,1000);

//Slowely over tweenDuration ms hide the container by moving it up off the stage
function tweenOut() {
	var tween = createjs.Tween.get(container).to({x:0,y:height*-1},tweenDuration).call(function(){
		showing = false;
	});
}

//Update our previously created text object, with the passed in text.
function updateText(text) {
	textObj.text = text;
	//Adjust the horizontal position of the text so that it is centered
	textObj.x = middle - textObj.getMeasuredWidth()/2;
}

function playSound(name) {
	if(!name) {
		return;
	}
	if(window.lfgSound !== undefined) {
		window.lfgSound.play(name);
	} else {
		createjs.Sound.play(name);
	}
}


function notify(text, sound) {
	if(showing) {
		queue.push({
			text:text,
			sound:sound
		});
		return;
	}
	showing = true;
	updateText(text);

	//Play the sound passed in
	playSound(sound);
	//In, HOLD, OUT
	tweenIn().wait(holdDuration).call(tweenOut);
}



function onFollow(name) {
	var text = 'New Follower: '+ name;
	notify(text, 'alert');
}

function onSub(name) {
	var text = 'New Subscriber: '+ name;
	notify(text, 'sub');
}
function onTip(name,amount,symbol) {
	//We want a space between the name and the donation amount
	var text = 'New Tip: ' + name + ' ' + symbol + amount ;
	notify(text, 'sub');
}

//Listen to the beam follow events
nodecg.listenFor('follow', 'nodecg-beam', function(data) {
	onFollow(data.name);
});

//Listen to our internal follow events(For testing)
nodecg.listenFor('follow','prime-manual-alerts', function(data) {
	onFollow(data.name);
});

//Listen to the beam sub events
nodecg.listenFor('subscription', 'nodecg-beam', function(data) {
	onSub(data.name);
});

//Listen to our internal sub events(For testing)
nodecg.listenFor('subscription','prime-manual-alerts', function(data) {
	onSub(data.name);
});

//Listen to Stream-Tip events
nodecg.listenFor('tip', 'lfg-streamtip', function(data) {
	//lfg-streamtip stores the username in data.name
	onTip(data.username,data.amount,data.currencySymbol);
});


//Listen to Internal Stream-Tip events
nodecg.listenFor('tip','prime-manual-alerts', function(data) {
	//We use data.name
	onTip(data.name,data.amount,data.currencySymbol);
});
