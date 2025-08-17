import {ASSET_FILEPATH_WIN} from '../utils/constants.js';
import {MAP_INFO} from '../utils/constants.js';
import MenuListener from '../handlers/MenuListener.js';

class WinScene extends Phaser.Scene {
    constructor(){
        super({ key: 'WinScene' });
    }

	init(data){
		this.holeId = data.holeId;
		this.totalStrokes = data.totalStrokes;
		this.strokes = data.strokes;
		this.totalTime = data.totalTime;
		this.time = data.time;
		this.par = data.par;
	}

    preload(){
        // Load any assets needed for the win menu
		this.load.image('winbg', ASSET_FILEPATH_WIN + 'win_bg.png');
        this.load.image('nextButton', ASSET_FILEPATH_WIN + 'next.png');
        this.load.image('quitButton', ASSET_FILEPATH_WIN + 'quit.png');
    }

    create(){
		//Load the background image so we can get image dimensions
		var background = new Image();
		background.src = ASSET_FILEPATH_WIN + 'win_bg.png';
		background.onload = () => {
			const s = this;
			//Set variables for item placement in scene
			const swidth = this.scale.width;
			const sheight = this.scale.height;
			const bwidth = background.width;
			const bheight = background.height;
			const bgx = (swidth - bwidth) / 2;
			const bgy = (sheight - bheight) / 2;

			//Background image
			this.add.image(swidth/2,sheight/2, 'winbg');

			//Text styling
			const fontSize = 32;
			const textStyle = {
				fontSize: (fontSize+'px'), 
				fill: '#ffffff'
			};

		
			if(this.holeId < MAP_INFO.length - 1){
				//Print game statistics
				const timex = swidth/2;
				const timey = bgy + bheight * 0.2;
				const strokesx = swidth/2;
				const strokesy = (bgy + bheight * 0.2) + fontSize + 5;
				const parx = swidth/2;
				const pary = (bgy + bheight * 0.2) + (fontSize*2) + 5;
				this.add.text(timex, timey, 'Time: ' + formatTime(this.time), textStyle).setOrigin(0.5)
				this.add.text(strokesx, strokesy, 'Sunk in ' + this.strokes, textStyle).setOrigin(0.5);
				this.add.text(parx, pary, 'Par: ' + this.par, textStyle).setOrigin(0.5);

				//Next level Button
				const restartx = bgx + bwidth * 0.25;
				const restarty = bgy + bheight * 0.8;
				const nextButton = this.add.image(restartx, restarty, 'nextButton').setInteractive();
				nextButton.on('pointerdown', this.nextLevel, this);

				//Quit button
				const quitx = bgx + bwidth * 0.75;
				const quity = bgy + bheight * 0.8;
				const quitButton = this.add.image(quitx, quity, 'quitButton').setInteractive();
				quitButton.on('pointerdown', this.quit, this);
			}else{
				fetch('./html/scoresubmit.html')
					.then(response => response.text())
					.then(html => {
						// Insert score submit HTML
						let div = document.createElement('div');
						div.innerHTML = html;
						div.id = "submit";
						document.body.appendChild(div);

						// Populate HTML with final statistics
						const coursepar = MAP_INFO.reduce((totalPar, hole) => totalPar + hole.par, 0);
						const totalStrokes = s.totalStrokes;
						const time = formatTime(s.totalTime);
						document.getElementById('coursepar').innerText = "Course Par: " + coursepar;
						document.getElementById('putt').innerText = "Completed in: " + totalStrokes;
						document.getElementById('time').innerText = "Total Time: " + time;

						// Link actions to buttons
						let quitButton = document.getElementById('quit');
						if (quitButton) {
							quitButton.addEventListener('click', () => {
								mainMenu(s);
							});
						}

						let sendButton = document.getElementById('submit');
						if (sendButton) {
							sendButton.addEventListener('click', () => {
								sendScore(s, totalStrokes, time);
							});
						}
					})
					.catch(error => console.error('Error loading overlay:', error));
			}

			const listener = new MenuListener(this);
		};
    }

	nextLevel(){
		this.scene.stop();
		this.scene.start('GameScene', {holeId: (this.holeId + 1), totalStrokes: this.totalStrokes, totalTime: this.totalTime});
	}

	quit(){
		this.scene.stop();
		this.scene.stop('GameScene');
		this.scene.start('MenuScene');
	}
}

function formatTime(time){
	let totalSeconds = Math.floor(time / 1000);
	let minutes = Math.floor((totalSeconds % 3600) / 60);
	let seconds = totalSeconds % 60;

	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function mainMenu(scene){
	var sub = document.getElementById('submit');
	if(sub){
		sub.remove();
	}

	scene.scene.stop();
	scene.scene.stop('GameScene');
	scene.scene.start('MenuScene');
}

function sendScore(scene, p, t){
	var n = document.getElementById('nameinput').value;
	console.log(n);
	if(n.length == 0) return;
	fetch('https://pg-leaderboard-worker.portal-golf.workers.dev/newscore', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: n,
			putt: p,
			time: t,
			date: new Date().toISOString().slice(0, 10)
		})
	})
	.then(response => response.json())
	.then(data => console.log('Success:', data))
	.catch(error => console.error('Error:', error));
	mainMenu(scene);
}

export default WinScene;