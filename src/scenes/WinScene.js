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
				const strokesx = swidth/2;
				const strokesy = bgy + bheight * 0.2;
				const parx = swidth/2;
				const pary = (bgy + bheight * 0.2) + fontSize + 5;
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
				//Print final game statistics
				const strokesx = swidth/2;
				const strokesy = bgy + bheight * 0.2;
				const parx = swidth/2;
				const pary = (bgy + bheight * 0.2) + fontSize + 5;
				const totalPar = MAP_INFO.reduce((totalPar, hole) => totalPar + hole.par, 0);
				this.add.text(strokesx, strokesy, 'Completed in ' + this.totalStrokes + ' strokes', textStyle).setOrigin(0.5);
				this.add.text(parx, pary, 'Course Par ' + totalPar + ' strokes', textStyle).setOrigin(0.5);

				//Quit button
				const quitx = bgx + bwidth * 0.5;
				const quity = bgy + bheight * 0.8;
				const quitButton = this.add.image(quitx, quity, 'quitButton').setInteractive();
				quitButton.on('pointerdown', this.quit, this);
			}

			const listener = new MenuListener(this);
		};
    }

	nextLevel(){
		this.scene.stop();
		this.scene.start('GameScene', {holeId: (this.holeId + 1), totalStrokes: this.totalStrokes});
	}

	quit(){
		this.scene.stop();
		this.scene.stop('GameScene');
		this.scene.start('MenuScene');
	}
}

export default WinScene;