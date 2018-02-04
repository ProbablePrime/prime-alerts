// Alerter is a class which creates and manages our alerts, it draws a green rectangle along the top of the page and animates it
// on and off the page in response to events.
class Alerter {
	// Construct the alerter
	constructor(width, height) {
		// How long should our in and out phases last in ms?
		this.tweenDuration = 0.5;
		// How long should we hold the username on the screen?
		this.holdDuration = 3;

		// A container is a box we can throw other EaselJS objects into.
		this.container = new createjs.Container();

		// Set its dimensions to the passed in sizes
		this.container.height = height;
		this.container.width = width;
		// useful helper
		this.container.middle = width / 2;

		// Tween timeline for this alerter. We'll queue events onto it
		this.timeline = new TimelineLite({ autoRemoveChildren: true });

		// Let's make the box
		this.createBox();
	}

	createBox() {
		// We want a rectangle the entire width of the stage and our set height tall. We want it green..
		this.background = new createjs.Shape();
		this.background.graphics
			.beginFill('green')
			.rect(0, 0, this.container.width, this.container.height);

		// Setup a text object but we don't specify the text it should display here as we'll do this later
		this.textObj = new createjs.Text('', '28px Arial', '#FFFFFF');
		// Bump its y position down so its not riding the top of the box
		this.textObj.y = 10;

		// Throw the background and text into the container so they will move in unison
		this.container.addChild(this.background);
		this.container.addChild(this.textObj);

		// Move the container off the page by height*-1 pixels, so that it starts slightly out of the window
		this.container.y = this.container.height * -1;
	}

	// Update our previously created text object, with the passed in text.
	updateText(text) {
		// Set the text object's text to the text we want it to show.
		this.textObj.text = text;
		// Adjust the horizontal position of the text so that it is centered
		this.textObj.x =
			this.container.middle - this.textObj.getMeasuredWidth() / 2;
	}

	playSound(name) {
		if (!name) {
			return;
		}
		// lfgsound, is a cool bundle by SupportClass that lets broadcasters specify their own sounds without code
		// If we find it use it.
		if (window.lfgSound !== undefined) {
			window.lfgSound.play(name);
		} else {
			// Otherwise we'll use soundjs
			createjs.Sound.play(name);
		}
	}

	notify(text, sound) {
		// Shortcut to the timeline
		const t = this.timeline;
		// timeline label shortcut
		const i = 'notify';

		// Easing is fun, this just makes an elastic ease. I dont really care which one is used but feel free to change it.
		const ease = Elastic.easeOut.config(0.3, 0.5);

		// Add the timeline label
		t.add(i);

		// Immediately call this function at the label position
		t.call(
			() => {
				// Update the text to our new value
				this.updateText(text);
				// Play the sound for this alert.
				this.playSound(sound);
			},
			null,
			null,
			i,
		);

		// Slowly over tweenDuration ms drop the container into the stage by moving it downwards so it is onscreen.
		t.to(
			this.container,
			this.tweenDuration,
			{
				y: 0,
				ease,
			},
			i,
		);

		// Calculate the time we should start moving back up. This is the length of time it took the box to appear plus the time we want the alert to remain on the screen.
		const outTime = this.tweenDuration + this.holdDuration;

		// Slowly over tweenDuration ms hide the container by moving it up off the stage, we mark this at the label we created plus the outtime as a delay.
		t.to(
			this.container,
			this.tweenDuration,
			{
				y: this.container.height * -1,
				ease,
			},
			`${i}+=${outTime}`,
		);
	}
}
